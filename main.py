#!/usr/bin/env python3
"""
MediaGrab Backend - yt-dlp wrapper API
A FastAPI backend for downloading YouTube and Instagram content
"""

import os
import json
import asyncio
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime

import yt_dlp
from fastapi import FastAPI, HTTPException, BackgroundTasks, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, HttpUrl, validator
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="MediaGrab API",
    description="Backend API for downloading YouTube and Instagram content",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create downloads directory
DOWNLOADS_DIR = Path("downloads")
DOWNLOADS_DIR.mkdir(exist_ok=True)

# Mount static files for serving downloads
app.mount("/downloads", StaticFiles(directory=DOWNLOADS_DIR), name="downloads")

# Download request models
class DownloadRequest(BaseModel):
    url: HttpUrl
    platform: str
    quality: Optional[str] = "720p"
    audioType: Optional[str] = "mp3"

    @validator('platform')
    def validate_platform(cls, v):
        if v not in ['youtube', 'instagram']:
            raise ValueError('Platform must be either "youtube" or "instagram"')
        return v

    @validator('url')
    def validate_url_platform(cls, v, values):
        url_str = str(v)
        platform = values.get('platform')

        if platform == 'youtube':
            if not ('youtube.com' in url_str or 'youtu.be' in url_str):
                raise ValueError('Invalid YouTube URL')
        elif platform == 'instagram':
            if 'instagram.com' not in url_str:
                raise ValueError('Invalid Instagram URL')

        return v

class DownloadResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Global download progress tracking
download_progress = {}

def get_youtube_dl_options(platform: str, quality: str = "720p", audio_type: str = "mp3") -> Dict[str, Any]:
    """Get yt-dlp options based on platform and quality preferences"""

    base_options = {
        'outtmpl': str(DOWNLOADS_DIR / '%(title)s.%(ext)s'),
        'restrictfilenames': True,
        'ignoreerrors': True,
        'no_warnings': False,
        'extractaudio': False,
        'writeinfojson': True,
        'writethumbnail': True,
    }

    if platform == "youtube":
        # YouTube-specific options
        if quality == "audio_only":
            base_options.update({
                'format': 'bestaudio/best',
                'extractaudio': True,
                'audioformat': audio_type,
                'audioquality': '320' if audio_type == 'mp3' else '0',
            })
        else:
            # Video download with specific quality
            quality_map = {
                '2160p': 'bestvideo[height<=2160]+bestaudio/best[height<=2160]',
                '1440p': 'bestvideo[height<=1440]+bestaudio/best[height<=1440]',
                '1080p': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
                '720p': 'bestvideo[height<=720]+bestaudio/best[height<=720]',
                '480p': 'bestvideo[height<=480]+bestaudio/best[height<=480]',
                '360p': 'bestvideo[height<=360]+bestaudio/best[height<=360]',
            }
            base_options['format'] = quality_map.get(quality, 'best')

    elif platform == "instagram":
        # Instagram-specific options
        base_options.update({
            'format': 'best',
            'extract_flat': False,
        })

    return base_options

def progress_hook(d):
    """Progress hook for yt-dlp"""
    if d['status'] == 'downloading':
        download_id = d.get('info_dict', {}).get('id', 'unknown')
        if 'total_bytes' in d:
            percent = (d['downloaded_bytes'] / d['total_bytes']) * 100
        elif 'total_bytes_estimate' in d:
            percent = (d['downloaded_bytes'] / d['total_bytes_estimate']) * 100
        else:
            percent = 0

        download_progress[download_id] = {
            'status': 'downloading',
            'percent': round(percent, 2),
            'speed': d.get('speed', 0),
            'eta': d.get('eta', 0),
        }

    elif d['status'] == 'finished':
        download_id = d.get('info_dict', {}).get('id', 'unknown')
        download_progress[download_id] = {
            'status': 'finished',
            'percent': 100,
            'filename': d['filename'],
        }

async def download_content(request: DownloadRequest) -> Dict[str, Any]:
    """Download content using yt-dlp"""

    url_str = str(request.url)
    logger.info(f"Starting download for {url_str}")

    # Configure yt-dlp options
    ydl_opts = get_youtube_dl_options(request.platform, request.quality, request.audioType)
    ydl_opts['progress_hooks'] = [progress_hook]

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info first
            info = ydl.extract_info(url_str, download=False)
            if not info:
                raise Exception("Could not extract video information")

            video_id = info.get('id', 'unknown')
            title = info.get('title', 'Unknown Title')
            duration = info.get('duration', 0)
            uploader = info.get('uploader', 'Unknown')

            # Initialize progress tracking
            download_progress[video_id] = {
                'status': 'starting',
                'percent': 0,
                'title': title,
            }

            # Download the content
            ydl.download([url_str])

            # Get final status
            final_status = download_progress.get(video_id, {})

            if final_status.get('status') == 'finished':
                filename = final_status.get('filename', '')
                file_path = Path(filename)

                result = {
                    'video_id': video_id,
                    'title': title,
                    'duration': duration,
                    'uploader': uploader,
                    'filename': file_path.name,
                    'file_size': file_path.stat().st_size if file_path.exists() else 0,
                    'download_url': f"/downloads/{file_path.name}",
                    'platform': request.platform,
                    'quality': request.quality,
                    'audio_type': request.audioType if request.platform == 'youtube' else None,
                }

                logger.info(f"Download completed: {title}")
                return result
            else:
                raise Exception("Download did not complete successfully")

    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise e

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "MediaGrab API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "download": "POST /api/download",
            "progress": "GET /api/progress/{video_id}",
            "health": "GET /health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/download", response_model=DownloadResponse)
async def download_endpoint(request: DownloadRequest, background_tasks: BackgroundTasks):
    """Download content from YouTube or Instagram"""

    try:
        # Validate the request
        url_str = str(request.url)
        logger.info(f"Received download request for: {url_str}")

        # Start download in background
        result = await download_content(request)

        return DownloadResponse(
            success=True,
            message="Download completed successfully",
            data=result
        )

    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        return DownloadResponse(
            success=False,
            message="Download failed",
            error=str(e)
        )

@app.get("/api/progress/{video_id}")
async def get_download_progress(video_id: str):
    """Get download progress for a specific video"""

    progress = download_progress.get(video_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Download not found")

    return progress

@app.get("/api/info")
async def get_video_info(url: str):
    """Get video information without downloading"""

    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

            if not info:
                raise HTTPException(status_code=400, detail="Could not extract video information")

            return {
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'uploader': info.get('uploader', 'Unknown'),
                'view_count': info.get('view_count', 0),
                'description': info.get('description', ''),
                'thumbnail': info.get('thumbnail', ''),
                'upload_date': info.get('upload_date', ''),
                'formats': len(info.get('formats', [])),
            }

    except Exception as e:
        logger.error(f"Info extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/downloads/{filename}")
async def download_file(filename: str):
    """Serve downloaded files"""

    file_path = DOWNLOADS_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

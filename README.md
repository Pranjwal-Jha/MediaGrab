# MediaGrab 🎥📱

A modern, full-stack application for downloading content from YouTube and Instagram with an attractive web interface.

<!-- ![MediaGrab Banner](https://via.placeholder.com/800x200/6366f1/ffffff?text=MediaGrab+-+YouTube+%26+Instagram+Downloader) -->

##  Features

- **🎬 YouTube Downloads**: Support for videos, playlists, and audio extraction
- **📸 Instagram Content**: Download reels, stories, posts, and IGTV
- **🎨 Modern UI**: Beautiful, responsive interface built with Next.js and shadcn/ui
- **🌙 Dark Mode**: Full dark/light theme support
- **📊 Download History**: Track and manage your downloads
- **⚡ High Performance**: Lightning-fast downloads with progress tracking
- **🎯 Quality Options**: Choose from multiple video qualities (up to 4K) and audio formats
- **📱 Mobile Friendly**: Fully responsive design for all devices

<!-- ## 🏗️Tech Stack -->

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **FastAPI** - Modern Python web framework
- **yt-dlp** - YouTube/Instagram downloader
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mediagrab.git
   cd mediagrab
   ```

2. **Set up the Python backend**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Create downloads directory
   mkdir downloads
   ```

3. **Set up the Next.js frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Python backend** (Terminal 1)
   ```bash
   # From the root directory
   python main.py
   ```
   The API will be available at `http://localhost:8000`

2. **Start the Next.js frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   The web interface will be available at `http://localhost:3000`

##  Usage

### Web Interface

1. **Open your browser** to `http://localhost:3000`
2. **Paste a URL** from YouTube or Instagram
3. **Select platform** (auto-detected)
4. **Choose quality settings** (for YouTube)
5. **Click Download** and wait for completion
6. **View your downloads** in the history panel

### Supported URLs

#### YouTube
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/playlist?list=PLAYLIST_ID`

#### Instagram
- `https://instagram.com/p/POST_ID/`
- `https://instagram.com/reel/REEL_ID/`
- `https://instagram.com/stories/USERNAME/STORY_ID/`

### Quality Options

#### YouTube Video
- **4K (2160p)** - Ultra HD quality
- **2K (1440p)** - Quad HD quality
- **1080p** - Full HD quality
- **720p** - HD quality (default)
- **480p** - Standard definition
- **360p** - Low quality

#### YouTube Audio
- **MP3** - 320 kbps (most compatible)
- **FLAC** - Lossless quality
- **M4A** - AAC format
- **OPUS** - Efficient compression
- **WAV** - Uncompressed audio

##  Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Enable debug mode
NEXT_PUBLIC_DEBUG=false
```

### Backend Configuration

Edit `main.py` to customize:

```python
# Download directory
DOWNLOADS_DIR = Path("downloads")

# CORS origins
allow_origins=["http://localhost:3000", "https://yourdomain.com"]

# Server host and port
uvicorn.run("main:app", host="0.0.0.0", port=8000)
```

##  Project Structure

```
mediagrab/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   │   └── ui/         # shadcn/ui components
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   └── package.json
├── downloads/              # Downloaded files (created automatically)
├── main.py                # FastAPI backend
├── requirements.txt       # Python dependencies
└── README.md
```

##  UI Components

The application uses shadcn/ui components for a consistent and modern interface:

- **Cards** - Content containers
- **Buttons** - Interactive elements
- **Inputs** - Form fields
- **Select** - Dropdown menus
- **Progress** - Download progress
- **Toast** - Notifications
- **Dialog** - Modal windows
- **Badge** - Status indicators

##  Security Notes

- The application runs locally by default
- No user data is stored permanently
- Downloads are saved locally in the `downloads/` directory
- CORS is configured for local development

##  Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to your preferred platform

### Backend (VPS/Cloud)

1. Install dependencies on your server
2. Configure environment variables
3. Use a process manager like PM2:
   ```bash
   pip install pm2
   pm2 start main.py --name mediagrab-api
   ```

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for personal use only. Please respect the terms of service of YouTube and Instagram. Do not use this tool to download copyrighted content without permission.

<!-- ## 🆘 Troubleshooting -->

### Common Issues

**Backend not starting:**
- Ensure Python 3.8+ is installed
- Install all requirements: `pip install -r requirements.txt`
- Check if port 8000 is available

**Frontend not building:**
- Ensure Node.js 18+ is installed
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors

**Downloads failing:**
- Verify the URL is accessible
- Check if yt-dlp needs updating: `pip install --upgrade yt-dlp`
- Ensure sufficient disk space

### Getting Help

- Check the [Issues](https://github.com/yourusername/mediagrab/issues) page
- Create a new issue with detailed information
- Include error messages and steps to reproduce
<!--
## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - The powerful downloader backend
- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework

---

Made with ❤️ by [Your Name] -->

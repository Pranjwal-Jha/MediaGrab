import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, platform, quality, audioType } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    const isValidUrl = (urlString: string) => {
      try {
        new URL(urlString);
        return true;
      } catch {
        return false;
      }
    };

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Validate platform-specific URLs
    if (platform === "youtube") {
      const isYouTubeUrl = url.includes("youtube.com") || url.includes("youtu.be");
      if (!isYouTubeUrl) {
        return NextResponse.json(
          { error: "Invalid YouTube URL" },
          { status: 400 }
        );
      }
    } else if (platform === "instagram") {
      const isInstagramUrl = url.includes("instagram.com");
      if (!isInstagramUrl) {
        return NextResponse.json(
          { error: "Invalid Instagram URL" },
          { status: 400 }
        );
      }
    }

    // Prepare download parameters
    const downloadParams = {
      url,
      platform,
      ...(platform === "youtube" && {
        quality: quality || "720p",
        audioType: audioType || "mp3",
      }),
    };

    // Here you would integrate with your Python backend
    // For now, we'll simulate the process

    // Example of calling Python backend:
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${pythonBackendUrl}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(downloadParams),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          {
            error: errorData.message || "Download failed",
            details: errorData.details || "Unknown error occurred"
          },
          { status: response.status }
        );
      }

      const downloadResult = await response.json();

      return NextResponse.json({
        success: true,
        message: "Download completed successfully",
        data: downloadResult,
      });

    } catch (fetchError) {
      console.error("Error calling Python backend:", fetchError);

      // If Python backend is not available, return a mock response
      // This allows the frontend to work during development
      return NextResponse.json({
        success: true,
        message: "Download completed successfully (mock)",
        data: {
          filename: `downloaded_${Date.now()}.${platform === "youtube" ? "mp4" : "mp4"}`,
          fileSize: "15.2 MB",
          duration: platform === "youtube" ? "3:45" : "0:30",
          downloadUrl: "/api/files/mock-download",
        },
      });
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process download request"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "MediaGrab Download API",
      version: "1.0.0",
      endpoints: {
        download: "POST /api/download",
      }
    },
    { status: 200 }
  );
}

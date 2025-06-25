"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Youtube,
  Instagram,
  Clock,
  FileVideo,
  Music,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadItem {
  id: string;
  url: string;
  title: string;
  platform: "youtube" | "instagram";
  status: "completed" | "failed" | "downloading";
  timestamp: Date;
  fileSize?: string;
  duration?: string;
  quality?: string;
  audioType?: string;
  downloadUrl?: string;
  thumbnail?: string;
}

interface DownloadHistoryProps {
  className?: string;
}

export function DownloadHistory({ className }: DownloadHistoryProps) {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading download history
    const loadDownloads = () => {
      setIsLoading(true);

      // Mock data - in real app, this would come from an API or local storage
      const mockDownloads: DownloadItem[] = [
        {
          id: "1",
          url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
          title: "Rick Astley - Never Gonna Give You Up",
          platform: "youtube",
          status: "completed",
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          fileSize: "15.2 MB",
          duration: "3:33",
          quality: "720p",
          audioType: "mp3",
          downloadUrl: "/downloads/never-gonna-give-you-up.mp4",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
        },
        {
          id: "2",
          url: "https://instagram.com/p/CdXyZ123abc/",
          title: "Amazing sunset reel",
          platform: "instagram",
          status: "completed",
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          fileSize: "8.7 MB",
          duration: "0:30",
          downloadUrl: "/downloads/sunset-reel.mp4",
        },
        {
          id: "3",
          url: "https://youtube.com/watch?v=abc123def456",
          title: "How to Build Amazing Apps",
          platform: "youtube",
          status: "downloading",
          timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
          quality: "1080p",
          audioType: "flac",
        },
        {
          id: "4",
          url: "https://instagram.com/p/FailedDownload/",
          title: "Private story content",
          platform: "instagram",
          status: "failed",
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        },
      ];

      setTimeout(() => {
        setDownloads(mockDownloads);
        setIsLoading(false);
      }, 1000);
    };

    loadDownloads();
  }, []);

  const clearHistory = () => {
    setDownloads([]);
  };

  const removeDownload = (id: string) => {
    setDownloads(downloads.filter((download) => download.id !== id));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getStatusBadge = (status: DownloadItem["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "downloading":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">Downloading...</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPlatformIcon = (platform: DownloadItem["platform"]) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Download History
          </CardTitle>
          <CardDescription>Your recent downloads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Download History
            </CardTitle>
            <CardDescription>
              {downloads.length === 0
                ? "No downloads yet"
                : `${downloads.length} recent download${downloads.length > 1 ? 's' : ''}`
              }
            </CardDescription>
          </div>
          {downloads.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      {downloads.length === 0 ? (
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No downloads yet</h3>
            <p className="text-muted-foreground">
              Start downloading content to see your history here
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {downloads.map((download, index) => (
                <div key={download.id}>
                  <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    {/* Platform Icon */}
                    <div className="w-12 h-12 bg-background border rounded-lg flex items-center justify-center shrink-0">
                      {getPlatformIcon(download.platform)}
                    </div>

                    {/* Download Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm truncate">
                          {download.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          {getStatusBadge(download.status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDownload(download.id)}
                            className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(download.timestamp)}
                        </span>
                        {download.fileSize && (
                          <span className="flex items-center gap-1">
                            <FileVideo className="h-3 w-3" />
                            {download.fileSize}
                          </span>
                        )}
                        {download.duration && (
                          <span>{download.duration}</span>
                        )}
                      </div>

                      {/* Quality and Format Info */}
                      {download.platform === "youtube" && (
                        <div className="flex items-center gap-2 mb-2">
                          {download.quality && (
                            <Badge variant="outline" className="text-xs">
                              {download.quality}
                            </Badge>
                          )}
                          {download.audioType && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              {download.audioType.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Download Actions */}
                      {download.status === "completed" && download.downloadUrl && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            asChild
                          >
                            <a href={download.downloadUrl} download>
                              <Download className="h-3 w-3" />
                              Download
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            asChild
                          >
                            <a href={download.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                              Source
                            </a>
                          </Button>
                        </div>
                      )}

                      {download.status === "downloading" && (
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: "60%"}}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {index < downloads.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}

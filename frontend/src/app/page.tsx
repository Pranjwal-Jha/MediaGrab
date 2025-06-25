"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Youtube,
  Instagram,
  Link,
  Sparkles,
  Play,
  Music,
  Github,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { DownloadHistory } from "@/components/download-history";
import { SystemStatus } from "@/components/system-status";

export default function Home() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [quality, setQuality] = useState("720p");
  const [audioType, setAudioType] = useState("mp3");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Make actual API call to backend
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform, quality, audioType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsDownloading(false);
            toast.success("Download completed successfully!");
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const result = await response.json();

      // Clear the progress interval when actual download completes
      clearInterval(progressInterval);
      setIsDownloading(false);
      setDownloadProgress(100);

      toast.success(result.message || "Download completed successfully!");

      // Clear the form
      setUrl("");
    } catch (error) {
      setIsDownloading(false);
      setDownloadProgress(0);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Download failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const detectPlatform = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setPlatform("youtube");
    } else if (url.includes("instagram.com")) {
      setPlatform("instagram");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Header */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Download className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MediaGrab
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <SystemStatus />
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Star className="h-4 w-4" />
              Star
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Download Content
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Download your favorite content from YouTube and Instagram with
              ease. High-quality downloads, multiple formats, lightning fast.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>99.9% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>4K Quality Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Multiple Formats</span>
            </div>
          </div>
        </div>

        {/* Main Download Card */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              Download Content
            </CardTitle>
            <CardDescription>
              Paste your YouTube or Instagram URL below and choose your
              preferred settings
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-base font-medium">
                Content URL
              </Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="https://youtube.com/watch?v=... or https://instagram.com/p/..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    detectPlatform(e.target.value);
                  }}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Platform</Label>
              <RadioGroup
                value={platform}
                onValueChange={setPlatform}
                className="grid grid-cols-2 gap-4"
              >
                <div className="relative">
                  <RadioGroupItem
                    value="youtube"
                    id="youtube"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="youtube"
                    className="flex items-center justify-center gap-3 rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <Youtube className="h-8 w-8 text-red-500" />
                    <div className="text-center">
                      <div className="font-semibold">YouTube</div>
                      <div className="text-sm text-muted-foreground">
                        Videos & Playlists
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem
                    value="instagram"
                    id="instagram"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="instagram"
                    className="flex items-center justify-center gap-3 rounded-lg border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <Instagram className="h-8 w-8 text-pink-500" />
                    <div className="text-center">
                      <div className="font-semibold">Instagram</div>
                      <div className="text-sm text-muted-foreground">
                        Reels & Stories
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* YouTube Options */}
            {platform === "youtube" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg border">
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Video Quality
                  </Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2160p">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">4K</Badge>
                          2160p (4K Ultra HD)
                        </div>
                      </SelectItem>
                      <SelectItem value="1440p">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">2K</Badge>
                          1440p (2K Quad HD)
                        </div>
                      </SelectItem>
                      <SelectItem value="1080p">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">HD</Badge>
                          1080p (Full HD)
                        </div>
                      </SelectItem>
                      <SelectItem value="720p">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">HD</Badge>
                          720p (HD)
                        </div>
                      </SelectItem>
                      <SelectItem value="480p">480p (SD)</SelectItem>
                      <SelectItem value="360p">360p (Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Audio Format
                  </Label>
                  <Select value={audioType} onValueChange={setAudioType}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp3">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Popular</Badge>
                          MP3 (320 kbps)
                        </div>
                      </SelectItem>
                      <SelectItem value="flac">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Lossless</Badge>
                          FLAC (High Quality)
                        </div>
                      </SelectItem>
                      <SelectItem value="m4a">M4A (AAC)</SelectItem>
                      <SelectItem value="opus">OPUS (Efficient)</SelectItem>
                      <SelectItem value="wav">WAV (Uncompressed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Instagram Options */}
            {platform === "instagram" && (
              <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Instagram Download</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supports Instagram Reels, Stories, Posts, and IGTV. Original
                  quality will be preserved whenever possible.
                </p>
              </div>
            )}

            {/* Download Progress */}
            {isDownloading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Downloading...
                  </Label>
                  <Badge variant="outline">
                    {Math.round(downloadProgress)}%
                  </Badge>
                </div>
                <Progress value={downloadProgress} className="h-2" />
              </div>
            )}

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              disabled={!url || isDownloading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download {platform === "youtube" ? "Video" : "Content"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Two Column Layout: Features and Download History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto">
          {/* Features */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">High Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Download in original quality up to 4K resolution
                </p>
              </Card>

              <Card className="text-center p-6 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Fast & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast downloads with 99.9% success rate
                </p>
              </Card>

              <Card className="text-center p-6 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Multiple Formats</h3>
                <p className="text-sm text-muted-foreground">
                  Support for video, audio, and various quality options
                </p>
              </Card>
            </div>
          </div>

          {/* Download History */}
          <div className="lg:col-span-1">
            <DownloadHistory className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

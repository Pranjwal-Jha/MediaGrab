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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  Server,
  Database,
  Wifi,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemStatus {
  backend: {
    status: "online" | "offline" | "error";
    responseTime: number;
    version: string;
    uptime: string;
  };
  frontend: {
    status: "online" | "offline";
    version: string;
    buildTime: string;
  };
  system: {
    diskSpace: {
      total: string;
      used: string;
      free: string;
      percentage: number;
    };
    memory: {
      total: string;
      used: string;
      percentage: number;
    };
    cpu: {
      usage: number;
      cores: number;
    };
  };
  downloads: {
    active: number;
    completed: number;
    failed: number;
    totalSize: string;
  };
  lastUpdate: Date;
}

interface SystemStatusProps {
  className?: string;
}

export function SystemStatus({ className }: SystemStatusProps) {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemStatus = async () => {
    try {
      setError(null);
      const startTime = Date.now();

      // Check backend health
      const backendResponse = await fetch("/api/health").catch(() => null);
      const backendResponseTime = Date.now() - startTime;

      let backendStatus: SystemStatus["backend"] = {
        status: "offline",
        responseTime: backendResponseTime,
        version: "Unknown",
        uptime: "Unknown",
      };

      if (backendResponse?.ok) {
        const backendData = await backendResponse.json();
        backendStatus = {
          status: "online",
          responseTime: backendResponseTime,
          version: backendData.version || "1.0.0",
          uptime: backendData.uptime || "Unknown",
        };
      } else if (backendResponse) {
        backendStatus.status = "error";
      }

      // Mock system data (in a real app, this would come from the backend)
      const mockSystemStatus: SystemStatus = {
        backend: backendStatus,
        frontend: {
          status: "online",
          version: "1.0.0",
          buildTime: new Date().toISOString().split("T")[0],
        },
        system: {
          diskSpace: {
            total: "100 GB",
            used: "45 GB",
            free: "55 GB",
            percentage: 45,
          },
          memory: {
            total: "8 GB",
            used: "4.2 GB",
            percentage: 52,
          },
          cpu: {
            usage: Math.floor(Math.random() * 40) + 10, // Random 10-50%
            cores: 4,
          },
        },
        downloads: {
          active: Math.floor(Math.random() * 3),
          completed: Math.floor(Math.random() * 50) + 10,
          failed: Math.floor(Math.random() * 5),
          totalSize: "2.3 GB",
        },
        lastUpdate: new Date(),
      };

      setStatus(mockSystemStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSystemStatus();
  };

  useEffect(() => {
    fetchSystemStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: "online" | "offline" | "error") => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: "online" | "offline" | "error") => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Online
          </Badge>
        );
      case "offline":
        return <Badge variant="outline">Offline</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const formatUptime = (uptime: string) => {
    if (uptime === "Unknown") return uptime;
    // In a real app, you'd parse and format the uptime properly
    return uptime;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "text-green-500";
    if (percentage < 80) return "text-yellow-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Activity className="h-4 w-4" />
            System Status
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </DialogTitle>
            <DialogDescription>
              Loading system information...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Activity className="h-4 w-4" />
          System Status
          {status && (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                status.backend.status === "online"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              )}
            />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status Dashboard
              </DialogTitle>
              <DialogDescription>
                Real-time monitoring of MediaGrab services and resources
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4",
                  isRefreshing && "animate-spin"
                )}
              />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
          </div>
        )}

        {status && (
          <div className="space-y-6">
            {/* Services Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Backend API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.backend.status)}
                      {getStatusBadge(status.backend.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-mono">
                      {status.backend.responseTime}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <Badge variant="outline">{status.backend.version}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm">{formatUptime(status.backend.uptime)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    Frontend App
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.frontend.status)}
                      {getStatusBadge(status.frontend.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <Badge variant="outline">{status.frontend.version}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Build Date</span>
                    <span className="text-sm">{status.frontend.buildTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Environment</span>
                    <Badge variant="secondary">Development</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* System Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Disk Space
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Used</span>
                      <span className={cn("text-sm font-mono", getUsageColor(status.system.diskSpace.percentage))}>
                        {status.system.diskSpace.used} / {status.system.diskSpace.total}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          status.system.diskSpace.percentage < 50
                            ? "bg-green-500"
                            : status.system.diskSpace.percentage < 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                        style={{ width: `${status.system.diskSpace.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Free</span>
                      <span className="text-sm">{status.system.diskSpace.free}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MemoryStick className="h-4 w-4" />
                      Memory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Used</span>
                      <span className={cn("text-sm font-mono", getUsageColor(status.system.memory.percentage))}>
                        {status.system.memory.used} / {status.system.memory.total}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          status.system.memory.percentage < 50
                            ? "bg-green-500"
                            : status.system.memory.percentage < 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                        style={{ width: `${status.system.memory.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Usage</span>
                      <span className="text-sm">{status.system.memory.percentage}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      CPU
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Usage</span>
                      <span className={cn("text-sm font-mono", getUsageColor(status.system.cpu.usage))}>
                        {status.system.cpu.usage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          status.system.cpu.usage < 50
                            ? "bg-green-500"
                            : status.system.cpu.usage < 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                        style={{ width: `${status.system.cpu.usage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cores</span>
                      <span className="text-sm">{status.system.cpu.cores}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Download Statistics */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Download Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-500">
                      {status.downloads.active}
                    </div>
                    <p className="text-sm text-muted-foreground">Active Downloads</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-500">
                      {status.downloads.completed}
                    </div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-500">
                      {status.downloads.failed}
                    </div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-purple-500">
                      {status.downloads.totalSize}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Size</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Last Update */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last updated: {status.lastUpdate.toLocaleString()}
              </div>
              <div className="text-xs">
                Auto-refresh every 30 seconds
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

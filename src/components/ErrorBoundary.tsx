"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: _, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You could also log error to an error reporting service here
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <Alert variant="destructive" className="max-w-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Terjadi Kesalahan!</AlertTitle>
            <AlertDescription>
              <p>Maaf, terjadi kesalahan tak terduga pada aplikasi.</p>
              <p className="mt-2 font-semibold">Detail Error:</p>
              <pre className="whitespace-pre-wrap text-xs bg-red-50 dark:bg-red-900 p-2 rounded-md mt-1">
                {this.state.error?.toString() || "Unknown Error"}
                {this.state.errorInfo?.componentStack && (
                  <>
                    {"\n\n"}Component Stack:
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </pre>
              <Button onClick={this.handleReload} className="mt-4">
                <RefreshCcw className="mr-2 h-4 w-4" /> Muat Ulang Aplikasi
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
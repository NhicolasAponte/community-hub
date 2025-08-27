"use client";
// NOTE TODO: LOOK INTO IMPLEMENTING UNSUBSCRIBE WITH A SERVER ACTION
import { useState, useEffect } from "react";
import {
  unsubscribeAction,
  resubscribeAction,
} from "@/lib/data/unsubscribe-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UnsubscribePageProps {
  searchParams: {
    token?: string;
  };
}

export default function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const [status, setStatus] = useState<
    "loading" | "unsubscribed" | "error" | "confirm"
  >("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const token = searchParams.token;

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing unsubscribe token");
      return;
    }

    // Check if this is a valid token and show confirmation
    setStatus("confirm");
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setIsProcessing(true);
    try {
      const result = await unsubscribeAction(token);
      if (result.success) {
        setStatus("unsubscribed");
        setMessage(result.message);
        setEmail(result.email || "");
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResubscribe = async () => {
    if (!token) return;

    setIsProcessing(true);
    try {
      const result = await resubscribeAction(token);
      if (result.success) {
        setMessage(
          "You've been resubscribed! You'll continue to receive our newsletters."
        );
      } else {
        setMessage(result.message);
      }
    } catch {
      setMessage("Failed to resubscribe. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">{message}</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "confirm") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
            <CardTitle>Unsubscribe from Newsletter</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Are you sure you want to unsubscribe from Community Hub
              newsletters?
            </p>
            <p className="text-sm text-gray-500">
              You&apos;ll no longer receive updates about community events,
              vendor highlights, and important announcements.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleUnsubscribe}
                disabled={isProcessing}
                variant="destructive"
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Yes, Unsubscribe"}
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "unsubscribed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <CardTitle className="text-green-600">
              Unsubscribed Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{message}</p>
            {email && (
              <p className="text-sm text-gray-500">
                Email: <span className="font-medium">{email}</span>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Changed your mind? You can resubscribe anytime.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleResubscribe}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Resubscribe"}
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

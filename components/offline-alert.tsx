// src/components/offline-alert.tsx
"use client";

import { useOnlineStatus } from "@/lib/offline-cache";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function OfflineAlert() {
  const isOnline = useOnlineStatus();
  const [showAlert, setShowAlert] = useState(false);
  
  // Show alert when offline, with a slight delay to avoid flashing
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isOnline) {
      timeout = setTimeout(() => setShowAlert(true), 500);
    } else {
      setShowAlert(false);
    }
    
    return () => clearTimeout(timeout);
  }, [isOnline]);
  
  // Show reconnection message when coming back online
  const [showReconnected, setShowReconnected] = useState(false);
  
  useEffect(() => {
    if (isOnline && showAlert) {
      setShowAlert(false);
      setShowReconnected(true);
      
      const timeout = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isOnline, showAlert]);
  
  if (!showAlert && !showReconnected) return null;
  
  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-50">
      {showAlert && (
        <div className="bg-destructive/90 text-destructive-foreground p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <WifiOff size={20} />
          <div>
            <h3 className="font-semibold">You're offline</h3>
            <p className="text-sm">Some features may be limited until you reconnect</p>
          </div>
        </div>
      )}
      
      {showReconnected && (
        <div className="bg-green-600/90 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Wifi size={20} />
          <div>
            <h3 className="font-semibold">You're back online</h3>
            <p className="text-sm">All features are now available</p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { OfflineAlert } from "@/components/offline-alert";
import { useEffect } from "react";

export default function OfflineIndicator() {
  // Mount the offline alert component
  useEffect(() => {
    const offlineIndicator = document.getElementById('offline-indicator');
    if (offlineIndicator) {
      // Create a root element for the offline alert
      const root = document.createElement('div');
      offlineIndicator.appendChild(root);
      
      // Render the OfflineAlert component
      const alert = document.createElement('div');
      root.appendChild(alert);
      
      // In a real implementation, we would use ReactDOM.render or similar
      // This is a simplified version for demonstration
      const offlineAlert = document.createElement('div');
      offlineAlert.id = 'offline-alert-container';
      alert.appendChild(offlineAlert);
    }
    
    return () => {
      const offlineIndicator = document.getElementById('offline-indicator');
      if (offlineIndicator) {
        offlineIndicator.innerHTML = '';
      }
    };
  }, []);

  return <OfflineAlert />;
}

/**
 * Service Worker Registration Utility
 */

// Check if service workers are supported
export function isServiceWorkerSupported(): boolean {
  return "serviceWorker" in navigator
}

// Register the service worker
export async function registerServiceWorker(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    console.log("Service workers are not supported in this browser")
    return
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js")
    console.log("Service worker registered successfully:", registration.scope)

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker is installed but waiting
            console.log("New service worker installed and waiting")
            // Notify the user about the update
            dispatchUpdateEvent()
          }
        })
      }
    })
  } catch (error) {
    console.error("Service worker registration failed:", error)
  }
}

// Check for service worker updates
export async function checkForUpdates(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.update()
      return true
    }
    return false
  } catch (error) {
    console.error("Failed to check for service worker updates:", error)
    return false
  }
}

// Update the service worker immediately
export async function updateServiceWorker(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration && registration.waiting) {
      // Send message to the waiting service worker
      registration.waiting.postMessage({ type: "SKIP_WAITING" })

      // Reload the page to activate the new service worker
      window.location.reload()
      return true
    }
    return false
  } catch (error) {
    console.error("Failed to update service worker:", error)
    return false
  }
}

// Unregister all service workers
export async function unregisterServiceWorkers(): Promise<boolean> {
  if (!isServiceWorkerSupported()) {
    return false
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))
    return true
  } catch (error) {
    console.error("Failed to unregister service workers:", error)
    return false
  }
}

// Dispatch an event when a service worker update is available
function dispatchUpdateEvent(): void {
  const event = new CustomEvent("serviceWorkerUpdateAvailable")
  window.dispatchEvent(event)
}

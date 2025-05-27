// This file provides a simplified export for development mode
// It avoids the complex dynamic imports that cause build errors

export const config = {
  // This ensures the page is completely client-side rendered
  unstable_runtimeJS: true
}

export default function LoginFallback() {
  return null; // This is just a placeholder, the actual content is rendered client-side
}

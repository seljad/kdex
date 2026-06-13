import { ComponentType, lazy, LazyExoticComponent } from "react";

const MAX_RETRY_COUNT = 5; // Reduced number of retries
const INITIAL_RETRY_DELAY_MS = 500; // Initial delay for retry
const FALLBACK_DELAY_MS = 2000; // Delay before showing fallback UI

// Regex to extract the module URL from the import statement
const uriOrRelativePathRegex = /import\(["']([^)]+)['"]\)/;

const getRouteComponentUrl = (originalImport: () => Promise<any>): string | null => {
  try {
    const fnString = originalImport.toString();
    return fnString.match(uriOrRelativePathRegex)?.[1] || null;
  } catch (e) {
    console.error("Error extracting component URL:", e);
    return null;
  }
};

// Generate a retry import function that adds a version parameter to bust the cache
const getRetryImportFunction = (
  originalImport: () => Promise<any>,
  retryCount: number
): (() => Promise<any>) => {
  const importUrl = getRouteComponentUrl(originalImport);
  if (!importUrl || retryCount === 0) {
    return originalImport;
  }

  const importUrlWithVersionQuery = importUrl.includes("?")
    ? `${importUrl}&v=${retryCount}-${Math.random().toString(36).substring(2)}`
    : `${importUrl}?v=${retryCount}-${Math.random().toString(36).substring(2)}`;

  return () => import(importUrlWithVersionQuery);
};

// Custom error class to differentiate between retryable and non-retryable errors
class FatalError extends Error {
}

// Main retryDynamicImport function
export function retryDynamicImport<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  FallbackComponent?: ComponentType<any> // Optional fallback component to display on failure
): LazyExoticComponent<T> {
  let retryCount = 0;
  let hasShownFallback = false;

  const loadComponent = (): Promise<{ default: T }> =>
    new Promise((resolve, reject) => {
      function tryLoadComponent() {
        const retryImport = getRetryImportFunction(importFunction, retryCount);

        retryImport()
          .then((module) => {
            if (retryCount > 0) {
              console.log(
                `Component loaded successfully after ${retryCount} ${retryCount === 1 ? "retry" : "retries"}.`
              );
            }
            resolve(module);
          })
          .catch((error) => {
            retryCount += 1;

            if (retryCount <= MAX_RETRY_COUNT && isRetryableError(error)) {
              console.warn(`Retry attempt ${retryCount} failed. Retrying...`);

              // Exponential backoff for retries
              setTimeout(() => {
                tryLoadComponent();
              }, Math.pow(2, retryCount) * INITIAL_RETRY_DELAY_MS);
            } else {
              console.error("Failed to load component after maximum retries.", error);

              // Send error to Sentry or any logging service
              // Sentry.captureException(error);

              if (FallbackComponent) {
                if (!hasShownFallback) {
                  console.warn("Showing fallback UI...");
                  hasShownFallback = true;
                }
                reject(new FatalError("Show fallback UI"));
              } else {
                reject(error);
              }
            }
          });
      }

      // Delay showing fallback UI to avoid quick flashes
      setTimeout(() => {
        if (!hasShownFallback && retryCount > 0 && FallbackComponent) {
          hasShownFallback = true;
          reject(new FatalError("Show fallback UI"));
        }
      }, FALLBACK_DELAY_MS);

      tryLoadComponent();
    });

  return lazy(() => loadComponent());
}

// Helper function to determine if the error is retryable
const isRetryableError = (error: any): boolean => {
  if (error instanceof FatalError) return false;
  // Add more logic for non-retryable errors (e.g., status codes)
  return error?.message?.includes("Network") || error?.response?.status !== 404;
};

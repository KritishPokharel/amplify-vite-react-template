import { useState, useEffect } from "react";

const NGROK_URL = "https://studybuddy.ngrok.app/";

const DISCLAIMER_MESSAGE = `Hello Dr. Keeling,

Please note that the backend server operates on-demand by design to manage AI inference costs and hosting resources. We adopted this industry-standard practice because our platform is heavily AI-driven with a full RAG implementation, which results in high compute and hosting expenses. To avoid unnecessary 24/7 runtime costs at this stage, the backend remains off until needed.

For grading or testing, please contact the Scrum Master at (202) 873-6662 or (682) 364-0822 to start the hosted backend server. Once requested, the server typically becomes fully operational within 30–60 seconds. After that, you will be able to access, test, and use all StudyBuddy features without any issues.

Once the server is started, we usually keep it running for approximately 2 hours to give users ample time for testing. After that, it is turned off again. If needed, you can notify us in advance, and we can keep it running for an entire day as well.

We are also in discussions with Heroku and AWS to obtain free credits through student programs so that, in the future, the backend can be hosted to run 24/7.`;

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Fetch the page to check if it's an ngrok error page
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(NGROK_URL, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check if response is ok
        if (!response.ok) {
          setShowDisclaimer(true);
          setIsChecking(false);
          return;
        }

        // Read the response text to check for ngrok error indicators
        const text = await response.text();

        // Check for ngrok error indicators
        const hasNgrokError =
          text.includes("ERR_NGROK_8012") ||
          text.includes("ngrok agent failed to establish a connection") ||
          text.includes("connection refused") ||
          text.includes("If you're the developer of this page");

        if (hasNgrokError) {
          setShowDisclaimer(true);
        } else {
          // Server is working, redirect to the URL
          window.location.href = NGROK_URL;
          return;
        }
      } catch (error) {
        // Network error, timeout, or other fetch failure
        // Assume server is down
        setShowDisclaimer(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkServer();
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#666" }}>
          Checking server status...
        </div>
      </div>
    );
  }

  // Show disclaimer if server is down
  if (showDisclaimer) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            lineHeight: "1.6",
            whiteSpace: "pre-line",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#333",
          }}
        >
          {DISCLAIMER_MESSAGE}
        </div>
      </div>
    );
  }

  // This shouldn't be reached, but just in case
  return null;
}

export default App;

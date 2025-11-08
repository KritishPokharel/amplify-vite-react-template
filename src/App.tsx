import { useEffect } from "react";

function App() {
  useEffect(() => {
    // 👇 Replace with your actual ngrok URL
    window.location.replace("https://abcd1234.ngrok.io");
  }, []);

  return <p>Redirecting to your live site...</p>;
}

export default App;

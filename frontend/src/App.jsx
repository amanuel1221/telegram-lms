import { useEffect, useState } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const launchParams = retrieveLaunchParams();

      console.log("Launch Params:", launchParams);

     setData({
  user: launchParams.initData?.user,
  platform: launchParams.platform,
  version: launchParams.version,
  theme: launchParams.themeParams,
  authenticated: !!launchParams.initDataRaw,
});
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (!data) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 >Telegram LMS</h1>

      <h2>👋 Welcome</h2>

      <p>
        <strong>Name:</strong>{" "}
        {data.user?.firstName || "Unknown"}
      </p>

      <p>
        <strong>Username:</strong>{" "}
        {data.user?.username || "No username"}
      </p>

      <p>
        <strong>Telegram ID:</strong>{" "}
        {data.user?.id}
      </p>

      <p>
        <strong>Language:</strong>{" "}
        {data.user?.languageCode}
      </p>

      <p>
        <strong>Platform:</strong>{" "}
        {data.platform}
      </p>

      <p>
        <strong>Version:</strong>{" "}
        {data.version}
      </p>

      <hr />

      <h3>Raw Init Data</h3>

      <p>
  <strong>Authenticated:</strong>{" "}
  {data.initDataRaw ? "✅ Yes" : "❌ No"}
</p>
    </div>
  );
}

export default App;
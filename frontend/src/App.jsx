import { useEffect, useState } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const launchParams = retrieveLaunchParams();

    console.log("ALL LAUNCH PARAMS:", launchParams);

    console.log(
      "INIT DATA RAW:",
      launchParams.initDataRaw
    );

    console.log(
      "INIT DATA:",
      launchParams.initData
    );

    setData({
      user: launchParams.initData?.user,
      platform: launchParams.platform,
      version: launchParams.version,
      authenticated: Boolean(launchParams.initDataRaw),
    });
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>Telegram LMS</h1>

      <p>
        User:
        {data.user?.firstName}
      </p>

      <p>
        ID:
        {data.user?.id}
      </p>

      <p>
        Auth:
        {data.authenticated ? "YES" : "NO"}
      </p>
    </div>
  );
}

export default App;
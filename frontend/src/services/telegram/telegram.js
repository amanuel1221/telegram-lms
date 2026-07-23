import { retrieveLaunchParams } from "@telegram-apps/sdk";

export function getTelegramData() {
  const launchParams = retrieveLaunchParams();

  return {
    user: launchParams.initData?.user,
    initDataRaw: launchParams.initDataRaw,
    platform: launchParams.platform,
    version: launchParams.version,
  };
}
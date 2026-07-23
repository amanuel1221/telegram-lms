import { useEffect, useState } from "react";
import { getTelegramData } from "../services/telegram/telegram";

export function useTelegram() {
  const [telegram, setTelegram] = useState(null);

  useEffect(() => {
    try {
      const data = getTelegramData();
      setTelegram(data);
    } catch (error) {
      console.error(
        "Telegram initialization failed",
        error
      );
    }
  }, []);

  return telegram;
}
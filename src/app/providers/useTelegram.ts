import { useContext } from "react";
import { TelegramContext } from "./telegramContext";
import type { TelegramData } from "../../processes/telegram-integration/useTelegramWebApp";

export const useTelegram = (): TelegramData => {
  const context = useContext(TelegramContext);
  if (!context) {
    return {
      user: null,
      theme: {},
      isReady: false,
    };
  }
  return context;
};

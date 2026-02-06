import { type ReactNode, type FC } from "react";
import { useTelegramWebApp } from "../../processes/telegram-integration/useTelegramWebApp";
import { TelegramContext } from "./telegramContext";

export const TelegramProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const data = useTelegramWebApp();
  return (
    <TelegramContext.Provider value={data}>{children}</TelegramContext.Provider>
  );
};

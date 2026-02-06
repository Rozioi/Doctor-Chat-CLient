import { useEffect, useState } from "react";
import {
  tg,
  getTelegramUser,
  getTelegramTheme,
} from "../../shared/lib/telegram";

export interface TelegramData {
  user: ReturnType<typeof getTelegramUser> | null;
  theme: Record<string, string>;
  isReady: boolean;
}

export function useTelegramWebApp(): TelegramData {
  const [user, setUser] = useState(getTelegramUser());
  const [theme, setTheme] = useState(getTelegramTheme());
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    try {
      tg.ready();

      setUser(getTelegramUser());
      setTheme(getTelegramTheme());
      setReady(true);

      const themeHandler = () => setTheme(getTelegramTheme());
      tg.onEvent("themeChanged", themeHandler);

      return () => tg.offEvent("themeChanged", themeHandler);
    } catch {
      setUser(getTelegramUser());
      setTheme(getTelegramTheme());
      setReady(true);
    }
  }, []);

  return { user, theme, isReady };
}

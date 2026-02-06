import { createContext } from "react";
import type { TelegramData } from "../../processes/telegram-integration/useTelegramWebApp";

export const TelegramContext = createContext<TelegramData | null>(null);

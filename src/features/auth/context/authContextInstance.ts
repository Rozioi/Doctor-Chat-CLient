import { createContext } from "react";
import type { AuthContextType } from "../../../api/types";

export const authContext = createContext<AuthContextType | null>(null);

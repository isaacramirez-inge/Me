import { createContext } from "react";
import type { ContextTimelineData } from "./ContextTimeline";

export const ContextTimeline = createContext<ContextTimelineData | null>(null);

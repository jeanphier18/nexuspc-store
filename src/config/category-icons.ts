import {
  Box,
  CircuitBoard,
  Cpu,
  Fan,
  Gpu,
  HardDrive,
  Keyboard,
  MemoryStick,
  Monitor,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CategoryKey } from "@/config/nav";

export const categoryIcons: Record<CategoryKey, LucideIcon> = {
  gpu: Gpu,
  cpu: Cpu,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  psu: Zap,
  cases: Box,
  monitors: Monitor,
  peripherals: Keyboard,
  cooling: Fan,
};

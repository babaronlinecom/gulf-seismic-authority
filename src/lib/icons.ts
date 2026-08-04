/**
 * Dynamic lucide icon resolver — maps string icon names from the data layer
 * to actual Lucide React components.
 */
import {
  Route,
  Flame,
  SquareParking,
  Warehouse,
  Plane,
  Factory,
  ShieldAlert,
  Layers,
  Building2,
  Truck,
  Home,
  HeartPulse,
  Zap,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Road: Route,
  Route,
  Flame,
  SquareParking,
  Warehouse,
  Plane,
  Factory,
  ShieldAlert,
  Layers,
  Building2,
  Truck,
  Home,
  HeartPulse,
  Zap,
  ShoppingBag,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Route;
}

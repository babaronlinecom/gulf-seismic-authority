"use client";

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
} from "lucide-react";

/**
 * Client-side icon renderer.
 *
 * Resolves a string icon name (from the data layer) to a Lucide component.
 * Uses an explicit switch (rather than a dynamic lookup + render) so we never
 * create a component during render — keeping the react-hooks/static-components
 * lint rule happy in server components that consume this.
 */
export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "Road":
      return <Route className={className} />;
    case "Route":
      return <Route className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "SquareParking":
      return <SquareParking className={className} />;
    case "Warehouse":
      return <Warehouse className={className} />;
    case "Plane":
      return <Plane className={className} />;
    case "Factory":
      return <Factory className={className} />;
    case "ShieldAlert":
      return <ShieldAlert className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Truck":
      return <Truck className={className} />;
    case "Home":
      return <Home className={className} />;
    case "HeartPulse":
      return <HeartPulse className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} />;
    default:
      return <Route className={className} />;
  }
}

"use client";

import Link from "next/link";
import { type ComponentProps } from "react";

// Keep the existing import name, but fetch routes only when visitors navigate.
// Browsing menus or hovering links should not download unused pages.
export default function HoverPrefetchLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} prefetch={false} />;
}

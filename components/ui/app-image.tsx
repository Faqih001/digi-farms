"use client";

import Image, { ImageProps } from "next/image";

export default function AppImage(props: ImageProps) {
  const { src } = props as { src?: string | any };
  const srcStr = typeof src === "string" ? src : undefined;
  const unoptimized = srcStr ? srcStr.startsWith("blob:") || srcStr.startsWith("http") : false;
  return <Image {...props} unoptimized={unoptimized} />;
}

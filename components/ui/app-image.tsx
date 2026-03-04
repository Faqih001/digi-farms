"use client";

import Image, { ImageProps } from "next/image";

export default function AppImage(props: ImageProps) {
  const { src, fill, style } = props;
  const srcStr = typeof src === "string" ? src : undefined;
  const unoptimized = srcStr
    ? srcStr.startsWith("blob:") || srcStr.startsWith("http")
    : false;
  // When not using fill, allow height to auto-adjust so CSS-driven width changes
  // don't break the aspect ratio (avoids the Next/Image aspect-ratio warning).
  const mergedStyle: React.CSSProperties | undefined = fill
    ? style
    : { height: "auto", ...style };
  return <Image {...props} unoptimized={unoptimized} style={mergedStyle} />;
}

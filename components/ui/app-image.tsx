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
  const mergedStyleBase: React.CSSProperties = fill
    ? ({ width: "100%", height: "100%", ...(style as React.CSSProperties) } as React.CSSProperties)
    : ({ width: "100%", height: "auto", ...(style as React.CSSProperties) } as React.CSSProperties);

  // If the consumer passed explicit width/height props but CSS may override one
  // dimension, ensure the other dimension is set to 'auto' to preserve aspect.
  const mergedStyle: React.CSSProperties = { ...mergedStyleBase };
  const hasWidthProp = typeof (props as any).width !== "undefined";
  const hasHeightProp = typeof (props as any).height !== "undefined";

  if (!fill) {
    if (hasWidthProp && !hasHeightProp && mergedStyle.height == null) {
      mergedStyle.height = "auto";
    }
    if (hasHeightProp && !hasWidthProp && mergedStyle.width == null) {
      mergedStyle.width = "auto";
    }
  }

  return <Image {...props} unoptimized={unoptimized} style={mergedStyle} />;
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

import logotipoInlineLight from "@/app/assets/brand/logotipo-inline-light.png";
import logotipoInlineDark from "@/app/assets/brand/logotipo-inline-dark.png";
import logotipoVerticalLight from "@/app/assets/brand/logotipo-vertical-light.png";
import logotipoVerticalDark from "@/app/assets/brand/logotipo-vertical-dark.png";
import isotipoLight from "@/app/assets/brand/isotipo-light.png";
import isotipoDark from "@/app/assets/brand/isotipo-dark.png";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "inline" | "vertical";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  iconOnly?: boolean;
  className?: string;
}

const imageStyles: Record<LogoSize, { inline: string; vertical: string; icon: string }> = {
  sm: { inline: "h-6 w-auto", vertical: "h-12 w-auto", icon: "w-6 h-6" },
  md: { inline: "h-8 w-auto", vertical: "h-16 w-auto", icon: "w-8 h-8" },
  lg: { inline: "h-10 w-auto", vertical: "h-20 w-auto", icon: "w-10 h-10" },
};

export default function Logo({
  size = "md",
  variant = "inline",
  iconOnly = false,
  className = "",
}: LogoProps) {
  const { resolvedTheme = "dark" } = useTheme();
  const isIconOnly = iconOnly || className.includes("[&>span]:hidden");
  const styles = imageStyles[size];

  // Select the correct image based on variant, iconOnly, and theme
  let src;
  let alt = "SellBox";
  let imgClass = "";

  if (isIconOnly) {
    src = resolvedTheme === "light" ? isotipoDark : isotipoLight;
    alt = "SellBox Isotipo";
    imgClass = styles.icon;
  } else if (variant === "vertical") {
    src = resolvedTheme === "light" ? logotipoVerticalDark : logotipoVerticalLight;
    alt = "SellBox Logo Vertical";
    imgClass = styles.vertical;
  } else {
    src = resolvedTheme === "light" ? logotipoInlineDark : logotipoInlineLight;
    alt = "SellBox Logo";
    imgClass = styles.inline;
  }

  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      <Image
        src={src}
        alt={alt}
        priority
        className={`${imgClass} object-contain transition-transform duration-200 group-hover:scale-105`}
      />
    </Link>
  );
}

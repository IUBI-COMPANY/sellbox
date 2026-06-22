import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const sizeStyles: Record<LogoSize, { text: string; icon: string }> = {
  sm: { text: "text-lg", icon: "w-5 h-5" },
  md: { text: "text-xl", icon: "w-6 h-6" },
  lg: { text: "text-3xl", icon: "w-8 h-8" },
};

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const theme = useTheme();
  const styles = sizeStyles[size];
  const { resolvedTheme = null } = theme;

  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* Icon: Play button with shopping bag concept */}
      <div
        className={`
          ${styles.icon} rounded-lg flex items-center justify-center
          transition-transform duration-200 group-hover:scale-110
        `}
        style={{ background: "var(--gradient-brand)" }}
      >
        {/* Play triangle */}
        <svg viewBox="0 0 24 24" fill="none" className="w-[60%] h-[60%]">
          <path
            d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z"
            fill="white"
          />
        </svg>
      </div>

      {/* Text */}
      <span className={`${styles.text} font-bold tracking-tight`}>
        <span className="text-gradient">Sell</span>
        <span
          className={resolvedTheme === "dark" ? "text-white" : "text-black"}
        >
          Box
        </span>
      </span>
    </Link>
  );
}

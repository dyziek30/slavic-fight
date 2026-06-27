import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  size = 40,
  withText = true,
  className,
}: {
  href?: string;
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-3", className)}>
      <Image
        src="/logo.jpg"
        alt="Slavic Fight"
        width={size}
        height={size}
        className="rounded-md ring-1 ring-white/10 transition-transform group-hover:scale-105"
        priority
      />
      {withText && (
        <span className="heading-display text-lg leading-none tracking-brand text-chalk">
          Slavic<span className="text-smoke"> Fight</span>
        </span>
      )}
    </Link>
  );
}

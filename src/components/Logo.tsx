import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}>
      <span className="size-6 rounded-md bg-primary flex items-center justify-center">
        <span className="size-2.5 bg-primary-foreground rotate-45" />
      </span>
      SyncBridge
    </span>
  );
}
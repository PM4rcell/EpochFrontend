import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  // Use a visible neutral background by default so skeletons show on dark backgrounds.
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-slate-700/30 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };

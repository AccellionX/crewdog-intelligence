import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-slate-700 bg-slate-800 text-slate-200",
        amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        teal: "border-teal-500/30 bg-teal-500/10 text-teal-300",
        blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
        rose: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        outline: "border-slate-600 text-slate-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

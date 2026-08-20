import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="enter">
      <h1 className="text-3xl font-bold tracking-tighter text-balance">{title}</h1>
      <p className="mt-2 max-w-[60ch] text-pretty text-muted-foreground">{description}</p>
    </div>
  );
}

export function Panel({
  label,
  action,
  footer,
  busy,
  className,
  bodyClassName,
  children,
}: {
  label: string;
  action?: ReactNode;
  footer?: ReactNode;
  busy?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
    >
      {busy ? <div className="wipe absolute left-0 top-0 h-0.5 bg-signal" /> : null}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <span className="label-mono">{label}</span>
        {action}
      </div>
      <div className={cn("p-6", bodyClassName)}>{children}</div>
      {footer ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-4 py-4">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="label-mono mb-3">// {title}</h3>
      {children}
    </div>
  );
}

export function EmptyOutput({ hint }: { hint: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 text-center">
      <div className="size-8 rounded border border-dashed border-border" />
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

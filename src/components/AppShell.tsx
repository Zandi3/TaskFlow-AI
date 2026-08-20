import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarRange,
  Mail,
  Mic,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { ResponsibleAiBanner } from "@/components/ResponsibleAiBanner";

const NAV = [
  { to: "/", label: "Meeting Summarizer", icon: Mic },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/planner", label: "Task Planner", icon: CalendarRange },
  { to: "/assistant", label: "Assistant Chat", icon: Bot },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      <ResponsibleAiBanner />

      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar pt-9 transition-[width] duration-300 ease-out",
          collapsed ? "w-16" : "w-16 sm:w-64",
        )}
      >
        <div
          className={cn(
            "flex h-[73px] items-center gap-3 border-b border-sidebar-border px-5",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="flex size-6 shrink-0 items-center justify-center rounded bg-primary">
            <div className="size-2.5 rounded-full bg-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="hidden text-lg font-bold italic tracking-tight sm:block">TaskFlow</span>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                title={label}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="hidden truncate sm:block">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-sidebar-border p-3">
          <button
            onClick={toggle}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            {theme === "dark" ? (
              <Sun className="size-4 shrink-0" />
            ) : (
              <Moon className="size-4 shrink-0" />
            )}
            {!collapsed && (
              <span className="hidden sm:block">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            )}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 shrink-0" />
            ) : (
              <PanelLeftClose className="size-4 shrink-0" />
            )}
            {!collapsed && <span className="hidden sm:block">Collapse</span>}
          </button>

          {!collapsed && (
            <div className="mt-2 hidden items-center gap-3 px-2 py-2 sm:flex">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                SJ
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold">Sarah Jenkins</span>
                <span className="text-[10px] text-muted-foreground">Design Director</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto bg-surface/40 pt-9">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">{children}</div>
      </main>
    </div>
  );
}

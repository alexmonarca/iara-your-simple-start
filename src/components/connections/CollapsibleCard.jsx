import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CollapsibleCard({
  title,
  description,
  rightSlot,
  collapsed,
  onToggle,
  children,
}) {
  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-[0_0_0_1px_hsl(var(--border))] overflow-hidden">
      <div className="p-5 border-b border-border">
        <div
          className="flex items-center justify-between gap-3 cursor-pointer"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onToggle?.();
          }}
          aria-expanded={!collapsed}
        >
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
          </div>

          <div className="flex items-center gap-2">
            {rightSlot}
            {collapsed ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {!collapsed ? <div className="p-5">{children}</div> : null}
    </div>
  );
}

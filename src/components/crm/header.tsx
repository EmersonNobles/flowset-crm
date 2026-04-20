"use client";

import { ChevronDown, Building2, LogOut, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockWorkspaces = [
  { id: "1", name: "Minha Empresa" },
  { id: "2", name: "Workspace Demo" },
];

export function Header() {
  const [activeWorkspace] = useState(mockWorkspaces[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between shrink-0">
      {/* Workspace switcher */}
      <div className="relative ml-10 md:ml-0">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors"
        >
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{activeWorkspace.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute left-0 top-full mt-1 w-52 bg-card border border-border rounded-md shadow-lg z-20 py-1">
              {mockWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors",
                    ws.id === activeWorkspace.id
                      ? "text-primary font-medium"
                      : "text-foreground"
                  )}
                  onClick={() => setDropdownOpen(false)}
                >
                  {ws.name}
                </button>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
                  + Criar workspace
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User area */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Minha conta</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-destructive transition-colors">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}

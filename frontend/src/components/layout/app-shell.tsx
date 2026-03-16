"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  Stethoscope,
  X,
} from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Search;
  match: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (pathname) => pathname.startsWith("/dashboard"),
  },
  {
    href: "/search",
    label: "Search",
    icon: Search,
    match: (pathname) =>
      pathname === "/" ||
      pathname.startsWith("/search") ||
      pathname.startsWith("/resource/"),
  },
  {
    href: "/learning",
    label: "Learning",
    icon: GraduationCap,
    match: (pathname) => pathname.startsWith("/learning"),
  },
  {
    href: "/research",
    label: "Research",
    icon: FlaskConical,
    match: (pathname) => pathname.startsWith("/research"),
  },
];

function getPageMeta(pathname: string) {
  if (pathname.startsWith("/dashboard")) {
    return {
      title: "Clinical Dashboard",
      description: "Browse the workspace and jump into the evidence tools.",
    };
  }

  if (pathname.startsWith("/resource/")) {
    return {
      title: "Resource Detail",
      description: "Static detail preview based on the Figma reference layout.",
    };
  }

  if (pathname.startsWith("/learning")) {
    return {
      title: "Learning & Quiz",
      description: "Prepared UI for quiz and study workflows while API wiring is pending.",
    };
  }

  if (pathname.startsWith("/research")) {
    return {
      title: "Research Support",
      description: "Prepared UI for literature analysis and evidence synthesis workflows.",
    };
  }

  return {
    title: "Evidence Search",
    description: "Your working search flow, now wrapped in the Figma-inspired interface.",
  };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);

  return (
    <div className="flex min-h-screen bg-transparent">
      {mobileMenuOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "w-72" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-200/80 px-4">
          <Link
            href="/search"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Stethoscope className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  Clinical Evidence
                </p>
                <p className="truncate text-xs text-teal-600">
                  Frontend merge workspace
                </p>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          <div className="space-y-1">
            {sidebarOpen && (
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Workspace
              </p>
            )}
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.match(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                    active
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    !sidebarOpen && "justify-center px-2",
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      active ? "text-blue-600" : "text-slate-400",
                    )}
                  />
                  {sidebarOpen && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {active && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
            <p className="text-sm font-semibold text-slate-900">Merge strategy</p>
            {sidebarOpen && (
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Reuse the Figma layout and components as references while keeping
                the current Next.js routes and FastAPI-backed search behavior.
              </p>
            )}
          </div>
        </nav>

        <div className="border-t border-slate-200/80 p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3",
              !sidebarOpen && "justify-center",
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
              CE
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  Frontend Integration
                </p>
                <p className="truncate text-xs text-slate-500">
                  Next.js App Router
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen((current) => !current)}
          className="absolute -right-3 top-20 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 lg:flex"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:max-h-screen">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="flex min-h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 lg:hidden"
              aria-label="Open navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold text-slate-900">
                {pageMeta.title}
              </p>
              <p className="truncate text-sm text-slate-500">
                {pageMeta.description}
              </p>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/search"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Link
                href="/dashboard"
                className={buttonStyles({ variant: "ghost", size: "sm" })}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

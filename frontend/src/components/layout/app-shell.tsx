"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Dna,
  FileText,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Microscope,
  Search,
  Settings,
  Stethoscope,
  User,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    section: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: Search, label: "Search", path: "/search" },
    ],
  },
  {
    section: "Resources",
    items: [
      { icon: BookOpen, label: "Textbooks", path: "/search?type=textbook" },
      { icon: FileText, label: "Research Papers", path: "/search?type=paper" },
      {
        icon: ClipboardList,
        label: "Clinical Guidelines",
        path: "/search?type=guideline",
      },
      { icon: Stethoscope, label: "Case Reports", path: "/search?type=case" },
      {
        icon: Microscope,
        label: "Conference Materials",
        path: "/search?type=conference",
      },
      { icon: Dna, label: "Research Data", path: "/search?type=data" },
    ],
  },
  {
    section: "Tools",
    items: [
      { icon: GraduationCap, label: "Learning & Quiz", path: "/learning" },
      { icon: FlaskConical, label: "Research Support", path: "/research" },
      { icon: BookOpen, label: "Saved", path: "/search?saved=true" },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchQuery = searchParams.get("q") ?? "";

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedQuery = String(formData.get("query") ?? "").trim();

    if (submittedQuery) {
      router.push(`/search?q=${encodeURIComponent(submittedQuery)}`);
    } else {
      router.push("/search");
    }
  };

  const isActive = (path: string) => {
    const basePath = path.split("?")[0];

    if (path === "/") {
      return pathname === "/" || pathname.startsWith("/dashboard");
    }

    return pathname.startsWith(basePath) && basePath !== "/";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close mobile navigation"
        />
      )}

      <aside
        className={`
          fixed z-50 flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:relative lg:z-auto
          ${sidebarOpen ? "w-60" : "w-16"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-800">
                  MedKnowledge
                </span>
                <span className="block truncate text-xs text-teal-600">
                  Clinical Intelligence
                </span>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {NAV_ITEMS.map((group) => (
            <div key={group.section} className="mb-4">
              {sidebarOpen && (
                <p className="mb-1.5 px-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      group flex items-center gap-3 rounded-lg px-2 py-2 transition-all duration-150
                      ${active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"}
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 ${active ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"}`}
                    />
                    {sidebarOpen && (
                      <>
                        <span className="truncate text-sm">{item.label}</span>
                        {active && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 border-t border-slate-200 p-2">
          <button
            type="button"
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-slate-600 transition-colors hover:bg-slate-50 ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-slate-500" />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          <div
            className={`relative flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50 ${!sidebarOpen ? "justify-center" : ""}`}
            onClick={() => setProfileOpen((current) => !current)}
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
              <span className="text-xs font-semibold text-teal-700">DR</span>
            </div>
            {sidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-800">
                    Dr. Rachel Chen
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Internal Medicine
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
              </>
            )}
            {profileOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 z-10 mb-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4" /> Profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <HelpCircle className="h-4 w-4" /> Help
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen((current) => !current)}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors hover:bg-slate-50 lg:flex"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3 text-slate-500" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-500" />
          )}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-16 flex-shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                key={searchQuery}
                name="query"
                type="text"
                defaultValue={searchQuery}
                placeholder="Search textbooks, papers, guidelines, cases..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-20 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-400 sm:inline-flex">
                  ⌘K
                </kbd>
              </div>
            </div>
          </form>

          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-teal-500" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/search")}
              className="hidden items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              Advanced Search
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

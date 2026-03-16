import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Bookmark,
  Bell,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  FileText,
  Microscope,
  Stethoscope,
  Menu,
  X,
  ChevronDown,
  Dna,
  ClipboardList,
  LogOut,
  HelpCircle,
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
      { icon: ClipboardList, label: "Clinical Guidelines", path: "/search?type=guideline" },
      { icon: Stethoscope, label: "Case Reports", path: "/search?type=case" },
      { icon: Microscope, label: "Conference Materials", path: "/search?type=conference" },
      { icon: Dna, label: "Research Data", path: "/search?type=data" },
    ],
  },
  {
    section: "Tools",
    items: [
      { icon: GraduationCap, label: "Learning & Quiz", path: "/learning" },
      { icon: FlaskConical, label: "Research Support", path: "/research" },
      { icon: Bookmark, label: "Saved", path: "/search?saved=true" },
    ],
  },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          flex flex-col bg-white border-r border-slate-200
          h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-60" : "w-16"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <span className="text-slate-800 font-semibold text-sm block truncate">MedKnowledge</span>
                <span className="text-teal-600 text-xs block truncate">Clinical Intelligence</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map((group) => (
            <div key={group.section} className="mb-4">
              {sidebarOpen && (
                <p className="text-xs text-slate-400 uppercase tracking-wider px-2 mb-1.5 font-medium">
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path.split("?")[0]) &&
                      item.path.split("?")[0] !== "/";
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-150 group
                      ${isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }
                    `}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"}`} />
                    {sidebarOpen && (
                      <span className="text-sm truncate">{item.label}</span>
                    )}
                    {isActive && sidebarOpen && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-200 p-2 flex-shrink-0">
          <button className={`flex items-center gap-3 px-2 py-2 rounded-lg text-slate-600 hover:bg-slate-50 w-full transition-colors ${!sidebarOpen ? "justify-center" : ""}`}>
            <Settings className="w-4 h-4 flex-shrink-0 text-slate-500" />
            {sidebarOpen && <span className="text-sm">Settings</span>}
          </button>
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors relative ${!sidebarOpen ? "justify-center" : ""}`}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <span className="text-teal-700 text-xs font-semibold">DR</span>
            </div>
            {sidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800 truncate">Dr. Rachel Chen</p>
                  <p className="text-xs text-slate-500 truncate">Internal Medicine</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </>
            )}
            {profileOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-10">
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  <HelpCircle className="w-4 h-4" /> Help
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-10"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-3 h-3 text-slate-500" />
          ) : (
            <ChevronRight className="w-3 h-3 text-slate-500" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0 z-30">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, papers, guidelines, cases..."
                className="w-full pl-9 pr-20 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 text-xs text-slate-400 bg-white">⌘K</kbd>
              </div>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 border-2 border-white"></span>
            </button>
            <button
              onClick={() => navigate("/search")}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              Advanced Search
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

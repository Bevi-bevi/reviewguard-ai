import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  FileImage,
  Globe,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/analyze", label: "Text Analysis" },
  { to: "/analyze/image", label: "Image Analysis" },
  { to: "/analyze/url", label: "URL Analysis" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

// Compact analyze sub-links for desktop (shown inline under analyze group)
const ANALYZE_NAV = [
  { to: "/analyze", label: "Text", shortLabel: "Text" },
  {
    to: "/analyze/image",
    label: "Image",
    shortLabel: "Image",
    icon: FileImage,
  },
  { to: "/analyze/url", label: "URL", shortLabel: "URL", icon: Globe },
] as const;

const TOP_NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isInitializing, login, clear } =
    useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAnalyzePath = currentPath.startsWith("/analyze");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 group"
              data-ocid="nav.logo"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm group-hover:opacity-90 transition-smooth">
                <ShieldCheck size={16} strokeWidth={2.5} />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-foreground leading-none">
                ReviewGuard<span className="text-primary"> AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {TOP_NAV.map((link) => {
                const isActive = currentPath === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "px-3.5 py-2 rounded-md text-sm font-medium transition-smooth",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                    data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}_link`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Analyze group */}
              <div className="flex items-center gap-0.5 ml-0.5">
                <span
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    isAnalyzePath ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  Analyze
                </span>
                <div className="flex items-center gap-0.5 bg-muted/60 rounded-lg px-1.5 py-1">
                  {ANALYZE_NAV.map((link) => {
                    const isActive = currentPath === link.to;
                    const Icon = "icon" in link ? link.icon : null;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-smooth",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background",
                        )}
                        data-ocid={`nav.analyze_${link.shortLabel.toLowerCase()}_link`}
                      >
                        {Icon && <Icon size={11} />}
                        {link.shortLabel}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-3">
              {!isInitializing && isAuthenticated ? (
                <>
                  <Badge
                    variant="outline"
                    className="hidden sm:flex font-mono text-xs text-primary border-primary/30"
                  >
                    Authenticated
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clear}
                    className="gap-1.5"
                    data-ocid="nav.logout_button"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => login()}
                  disabled={isInitializing}
                  className="gap-1.5"
                  data-ocid="nav.login_button"
                >
                  <LogIn size={14} />
                  Sign In
                </Button>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
                data-ocid="nav.mobile_menu_toggle"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 pb-4 pt-2">
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex w-full items-center px-3 py-2.5 rounded-md text-sm font-medium transition-smooth",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    link.to.startsWith("/analyze") && link.to !== "/analyze"
                      ? "pl-7"
                      : "",
                  )}
                  data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/ /g, "_")}_link`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-xs font-display font-semibold text-foreground">
              ReviewGuard AI
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

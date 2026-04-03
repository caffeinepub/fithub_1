import { Button } from "@/components/ui/button";
import { Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  page: Page;
  navigate: (p: Page) => void;
}

export default function Navigation({ page, navigate }: Props) {
  const { identity, login, clear, isInitializing } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const [menuOpen, setMenuOpen] = useState(false);

  const links: { label: string; page: Page }[] = [
    { label: "Home", page: { name: "home" } },
    { label: "Videos", page: { name: "videos" } },
    { label: "Membership", page: { name: "membership" } },
  ];

  const isActive = (p: Page) => p.name === page.name;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate({ name: "home" })}
            className="flex items-center gap-2 text-primary font-display font-bold text-xl"
            data-ocid="nav.link"
          >
            <Dumbbell className="h-6 w-6" />
            urtrainer
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                type="button"
                key={l.label}
                onClick={() => navigate(l.page)}
                data-ocid={`nav.${l.label.toLowerCase()}.link`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(l.page)
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Auth + Dashboard */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ name: "dashboard" })}
                data-ocid="nav.dashboard.link"
                className={page.name === "dashboard" ? "text-primary" : ""}
              >
                My Dashboard
              </Button>
            )}
            {!isInitializing &&
              (isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.signout.button"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  data-ocid="nav.signin.button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Sign In
                </Button>
              ))}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.toggle.button"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((l) => (
              <button
                type="button"
                key={l.label}
                onClick={() => {
                  navigate(l.page);
                  setMenuOpen(false);
                }}
                data-ocid={`nav.${l.label.toLowerCase()}.link`}
                className="block w-full text-left px-2 py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                {l.label}
              </button>
            ))}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  navigate({ name: "dashboard" });
                  setMenuOpen(false);
                }}
                data-ocid="nav.dashboard.link"
                className="block w-full text-left px-2 py-2 text-sm font-medium text-foreground hover:text-primary"
              >
                My Dashboard
              </button>
            )}
            <div className="px-2 pt-2">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.signout.button"
                  className="w-full"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  data-ocid="nav.signin.button"
                  className="w-full bg-primary text-primary-foreground"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

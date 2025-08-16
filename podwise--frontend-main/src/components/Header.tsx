import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const Header: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = React.useState(false);

  const pill = "px-3 py-1.5 rounded-full text-sm md:text-base transition-colors";
  const isActive = (to: string) =>
    pathname === to
      ? "bg-indigo-600 text-white"
      : "text-slate-200 hover:text-white hover:bg-white/10";

  const handleSignOut = async () => {
    try {
      await signOut();
      logout();
      navigate("/signin");
    } catch {}
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <Link
            to="/index"
            className="inline-flex items-center gap-2 text-white font-semibold tracking-tight"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/30" />
            Podwise
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/about" className={`${pill} ${isActive("/about")}`}>About</Link>
            {user && (
              <>
                <Link to="/history" className={`${pill} ${isActive("/history")}`}>History</Link>
                <Link to="/profile" className={`${pill} ${isActive("/profile")}`}>Profile</Link>
              </>
            )}
            {!user ? (
              <Link to="/signin" className={`${pill} ${isActive("/signin")}`}>Sign In</Link>
            ) : (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-full bg-rose-600 text-white hover:opacity-90"
              >
                Sign Out
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10"
            >
              About
            </Link>
            {user && (
              <>
                <Link
                  to="/history"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10"
                >
                  History
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left rounded-xl px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10"
                >
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-slate-200 hover:text-white hover:bg-white/10"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  Trophy,
  Users,
  Zap,
  PlayCircle,
  ArrowRight,
  CircleUser,
  LogOut,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // Example auth check
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setMenuOpen(false);

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900">
      {/* Navbar - Blue background */}
      <nav className="sticky top-0 z-50 border-b border-blue-700 bg-blue-600 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Brain className="h-8 w-8 text-blue-200" />
            <span className="text-2xl font-bold">Trivia Hunt</span>
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-full p-1 transition hover:bg-white/10"
              >
                <CircleUser
                  size={40}
                  className="text-blue-200 hover:text-white"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl text-slate-800">
                  {/* Cleaned up menu: Only the Logout button remains */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-white/40 px-5 py-2 transition hover:bg-white/10"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-white px-5 py-2 font-medium text-blue-600 transition hover:bg-blue-50"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50/50">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight text-black md:text-7xl">
            Compete in Live Quiz Battles
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Create quizzes, host multiplayer rooms, challenge friends, and
            climb live leaderboards in real time.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link 
              to="/create_room"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-600/20"
            >
              Play Now
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard value="50K+" label="Players" />
            <StatCard value="10K+" label="Quizzes" />
            <StatCard value="500+" label="Live Rooms" />
            <StatCard value="24/7" label="Competition" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Everything Needed For Competitive Quizzing
          </h2>

          <p className="mt-4 text-slate-500">
            Fast, interactive, and built for multiplayer experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-yellow-500" />}
            title="Real-Time Gameplay"
            description="Instant answer synchronization with live scoring."
          />

          <FeatureCard
            icon={<Users className="h-10 w-10 text-blue-500" />}
            title="Private Multiplayer Rooms"
            description="Invite friends using room codes and compete together."
          />

          <FeatureCard
            icon={<Trophy className="h-10 w-10 text-purple-500" />}
            title="Live Leaderboards"
            description="Watch rankings update after every question."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 transition hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white hover:shadow-xl">
      <div className="mb-6">{icon}</div>

      <h3 className="mb-3 text-2xl font-semibold text-slate-900">{title}</h3>

      <p className="text-slate-500">{description}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-3xl font-bold text-blue-600">{value}</h3>
      <p className="text-slate-500 font-medium">{label}</p>
    </div>
  );
}
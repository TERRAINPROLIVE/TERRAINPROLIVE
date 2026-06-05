import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/apiError";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canSubmit = /^\S+@\S+\.\S+$/.test(form.email) && form.password.length >= 1 && !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await login({ email: form.email.trim().toLowerCase(), password: form.password });
      toast.success("Welcome back.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail) || "Couldn't log you in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center px-5 py-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="absolute top-0 inset-x-0 h-1 hazard-stripes opacity-80" aria-hidden />

      <div
        data-testid="login-page"
        className="relative w-full max-w-md rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-950 p-6 sm:p-8"
      >
        <Link to="/" data-testid="login-logo" className="flex items-center gap-3 mb-8">
          <img
            src="/terrainpro-logo.png"
            alt="TerrainPRO"
            data-testid="login-logo-img"
            className="w-12 h-12 object-contain shrink-0 select-none"
            draggable={false}
          />
          <span className="font-display uppercase text-2xl font-black tracking-wide leading-none">
            <span className="text-white">Terrain</span>
            <span className="text-yellow-500">PRO</span>
          </span>
        </Link>

        <h1 className="font-display uppercase text-3xl tracking-tight leading-[0.95]">
          Welcome
          <br />
          <span className="text-yellow-500">back.</span>
        </h1>
        <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
          Log in to your TerrainPRO workspace.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4" data-testid="login-form">
          <div className="space-y-2">
            <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">Email</Label>
            <Input
              data-testid="login-email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="you@yourbusiness.com.au"
              autoComplete="email"
              className="h-12 rounded-none bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">Password</Label>
            <Input
              data-testid="login-password"
              type="password"
              value={form.password}
              onChange={onChange("password")}
              placeholder="Your password"
              autoComplete="current-password"
              className="h-12 rounded-none bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            data-testid="login-submit"
            className="w-full inline-flex items-center justify-center gap-2 h-14 bg-yellow-500 text-black font-black uppercase tracking-[0.18em] text-sm btn-industrial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Log In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          New to TerrainPRO?{" "}
          <Link to="/signup" data-testid="login-signup-link" className="text-yellow-500 font-semibold hover:underline">
            Start free trial
          </Link>
        </p>
      </div>
    </div>
  );
}

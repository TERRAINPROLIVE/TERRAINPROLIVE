import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowRight, Mountain, Home } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/apiError";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit =
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 6 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.password.length >= 6 &&
    !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success("You're in. 7-day free trial unlocked.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(formatApiErrorDetail(err?.response?.data?.detail) || "Couldn't sign you up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center px-5 py-12 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="absolute top-0 inset-x-0 h-1 hazard-stripes opacity-80" aria-hidden />

      <div
        data-testid="signup-page"
        className="relative w-full max-w-md rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-950 p-6 sm:p-8"
      >
        {/* Logo + Home */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <Link to="/" data-testid="signup-logo" className="flex items-center gap-3">
            <div className="relative w-11 h-11 bg-yellow-500 grid place-items-center shrink-0">
              <Mountain className="w-6 h-6 text-black" strokeWidth={2.4} />
            </div>
            <span className="font-display uppercase text-2xl font-black tracking-wide leading-none">
              <span className="text-white">Terrain</span>
              <span className="text-yellow-500">PRO</span>
            </span>
          </Link>

          <Link
            to="/"
            data-testid="signup-home-btn"
            aria-label="Back to home"
            title="Back to home"
            className="shrink-0 h-9 w-9 grid place-items-center border border-zinc-800 text-neutral-400 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
          >
            <Home className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        {/* High-contrast trial badge */}
        <div
          data-testid="signup-trial-badge"
          className="inline-block bg-yellow-500 text-black text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-sm mb-5"
        >
          [ No Credit Card Required — 7 Days Free Access ]
        </div>

        <h1 className="font-display uppercase text-3xl tracking-tight leading-[0.95]">
          Start your
          <br />
          <span className="text-yellow-500">free trial.</span>
        </h1>
        <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
          Create your account and jump straight into the AI Quote Estimator.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4" data-testid="signup-form">
          <FormField label="Full Name">
            <Input
              data-testid="signup-name"
              value={form.name}
              onChange={onChange("name")}
              placeholder="Mike Thompson"
              autoComplete="name"
              className="h-12 rounded-none bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FormField>
          <FormField label="Mobile Number">
            <Input
              data-testid="signup-phone"
              value={form.phone}
              onChange={onChange("phone")}
              placeholder="0412 345 678"
              inputMode="tel"
              autoComplete="tel"
              className="h-12 rounded-none bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FormField>
          <FormField label="Email">
            <Input
              data-testid="signup-email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="you@yourbusiness.com.au"
              autoComplete="email"
              className="h-12 rounded-none bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FormField>
          <FormField label="Password">
            <Input
              data-testid="signup-password"
              type="password"
              value={form.password}
              onChange={onChange("password")}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              className="h-12 rounded-none bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FormField>

          <button
            type="submit"
            disabled={!canSubmit}
            data-testid="signup-submit"
            className="w-full inline-flex items-center justify-center gap-2 h-14 bg-yellow-500 text-black font-black uppercase tracking-[0.18em] text-sm btn-industrial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already on the tools?{" "}
          <Link to="/login" data-testid="signup-login-link" className="text-yellow-500 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
        {label}
      </Label>
      {children}
    </div>
  );
}

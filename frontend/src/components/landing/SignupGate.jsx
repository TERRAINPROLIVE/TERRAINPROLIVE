import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STORAGE_KEY = "terrainpro:user";

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function SignupGate({ children }) {
  const [user, setUser] = useState(loadUser);

  const signOut = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  if (user) {
    return (
      <div data-testid="signup-gate-unlocked">
        <div className="mb-6 border border-yellow-500/40 bg-yellow-500/[0.04] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-yellow-500" strokeWidth={2} />
            <div className="leading-tight">
              <div className="font-display uppercase text-base tracking-tight">
                {user.name}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                Trial active · ABN {user.abn || "—"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            data-testid="signup-signout"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 hover:text-yellow-500 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
        {children}
      </div>
    );
  }

  return <SignupForm onSuccess={(u) => setUser(u)} />;
}

function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    abn: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validAbn = form.abn.replace(/\D/g, "").length >= 9; // ABN = 11 digits but accept 9+ for flexibility
  const canSubmit =
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 6 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    validAbn &&
    !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/signup`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        abn: form.abn.trim(),
      });
      const userPayload = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        abn: data.abn,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userPayload));
      } catch {
        /* ignore */
      }
      toast.success(
        data.is_new
          ? "You're in. Free trial unlocked."
          : "Welcome back — trial unlocked."
      );
      onSuccess(userPayload);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Couldn't sign you up. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      data-testid="signup-form"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-neutral-800 bg-neutral-950"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT — pitch */}
        <div className="lg:col-span-5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-neutral-800 bg-black flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
                Free Trial — No card
              </span>
            </div>
            <h3 className="font-display uppercase text-3xl sm:text-4xl tracking-tight leading-[0.95]">
              Start quoting
              <br />
              <span className="text-yellow-500">in 60 seconds.</span>
            </h3>
            <p className="mt-5 text-sm text-neutral-400 leading-relaxed">
              Drop your details and you'll unlock the AI Quote Estimator —
              consolidated AUD quotes across concreting, landscaping and
              earthmoving with line items, GST and nearest suppliers.
            </p>
          </div>
          <ul className="mt-8 space-y-3 text-sm text-neutral-300">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-yellow-500 mt-2 flex-shrink-0" />
              20 free AI quotes for your first month
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-yellow-500 mt-2 flex-shrink-0" />
              Built around Australian rates, suppliers & standards
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-yellow-500 mt-2 flex-shrink-0" />
              No credit card. Cancel any time.
            </li>
          </ul>
        </div>

        {/* RIGHT — form */}
        <form
          onSubmit={submit}
          className="lg:col-span-7 p-6 sm:p-10 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              / Your Details
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500">
              Required
            </span>
          </div>

          <Field label="Full name">
            <Input
              data-testid="signup-name"
              value={form.name}
              onChange={onChange("name")}
              placeholder="Mike Thompson"
              autoComplete="name"
              className="h-12 rounded-none bg-zinc-900 border-zinc-700 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </Field>
          <Field label="Phone">
            <Input
              data-testid="signup-phone"
              value={form.phone}
              onChange={onChange("phone")}
              placeholder="0412 345 678"
              inputMode="tel"
              autoComplete="tel"
              className="h-12 rounded-none bg-zinc-900 border-zinc-700 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </Field>
          <Field label="Email">
            <Input
              data-testid="signup-email"
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="you@yourbusiness.com.au"
              autoComplete="email"
              className="h-12 rounded-none bg-zinc-900 border-zinc-700 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </Field>
          <Field label="ABN">
            <Input
              data-testid="signup-abn"
              value={form.abn}
              onChange={onChange("abn")}
              placeholder="12 345 678 901"
              inputMode="numeric"
              maxLength={14}
              className="h-12 rounded-none bg-zinc-900 border-zinc-700 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500 font-mono"
            />
          </Field>

          <button
            type="submit"
            disabled={!canSubmit}
            data-testid="signup-submit"
            className="w-full inline-flex items-center justify-center gap-2 h-14 bg-yellow-500 text-black font-bold uppercase tracking-[0.18em] text-sm btn-industrial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600 text-center">
            By continuing you agree to receive trial updates by email. We never
            share your data.
          </p>
        </form>
      </div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
        {label}
      </Label>
      {children}
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/waitlist/count`)
      .then((r) => setCount(r.data.count))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post(`${API}/waitlist`, {
        email,
        name: name || null,
      });
      toast.success("You're on the list. We'll be in touch soon.");
      setName("");
      setEmail("");
      setCount((c) => (typeof c === "number" ? c + 1 : c));
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || "Couldn't sign up. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="waitlist"
      data-testid="waitlist-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div className="absolute top-0 inset-x-0 h-1 hazard-stripes opacity-80" aria-hidden />
      <div className="absolute bottom-0 inset-x-0 h-1 hazard-stripes opacity-80" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
            <span className="opacity-50">[</span> Contact <span className="opacity-50">]</span>
          </span>
          <p className="mt-4 text-neutral-400 max-w-xl leading-relaxed">
            Sign up free and we&apos;ll get you set up in your first week.
            TerrainPRO is rolling out to Aussie crews now — early access
            pricing locked in for the first 500.
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 border-l-2 border-l-yellow-500 rounded-lg p-6 sm:p-10 max-w-3xl">
          <form
            onSubmit={submit}
            data-testid="waitlist-form"
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5"
          >
            <div className="sm:col-span-6">
              <label
                htmlFor="waitlist-name"
                className="block font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500 mb-2"
              >
                Name
              </label>
              <Input
                id="waitlist-name"
                data-testid="waitlist-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-neutral-950 border-neutral-800 rounded-none focus-visible:ring-yellow-500 focus-visible:ring-1 focus-visible:border-yellow-500 text-sm"
              />
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="waitlist-email"
                className="block font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500 mb-2"
              >
                Email Address
              </label>
              <Input
                id="waitlist-email"
                data-testid="waitlist-email"
                type="email"
                required
                placeholder="you@yourbusiness.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-neutral-950 border-neutral-800 rounded-none focus-visible:ring-yellow-500 focus-visible:ring-1 focus-visible:border-yellow-500 text-sm"
              />
            </div>

            <div className="sm:col-span-12">
              <button
                type="submit"
                disabled={loading}
                data-testid="waitlist-submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 bg-yellow-500 text-black font-bold uppercase tracking-[0.18em] text-xs btn-industrial disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Get Early Access <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600">
            No spam · Unsubscribe one click · Australian-owned
          </p>
        </div>
      </div>
    </section>
  );
}

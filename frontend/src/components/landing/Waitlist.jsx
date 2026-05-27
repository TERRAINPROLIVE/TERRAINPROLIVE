import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TRADES = [
  { v: "earthmoving", l: "Earthmoving" },
  { v: "concreting", l: "Concreting" },
  { v: "landscaping", l: "Landscaping" },
  { v: "civil", l: "Civil / Commercial" },
];

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("");
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
        trade: trade || null,
      });
      toast.success("You're on the list. We'll be in touch soon.");
      setName("");
      setEmail("");
      setTrade("");
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

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500">
          [ Early Access ]
        </span>
        <h2 className="mt-4 font-display uppercase text-4xl sm:text-6xl tracking-tight leading-[0.95]">
          Stop quoting at midnight.
          <br />
          <span className="text-yellow-500">Start winning more jobs.</span>
        </h2>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          TerrainPRO is rolling out to Aussie crews now. Drop your email and
          we'll get you set up in your first week. Early access pricing locked
          in for the first 500.
        </p>

        {count !== null && (
          <div className="mt-6 inline-flex items-center gap-3 border border-neutral-800 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-neutral-300">
            <span className="w-2 h-2 bg-yellow-500 animate-pulse" />
            <span data-testid="waitlist-count">
              {count.toLocaleString()} tradies on the list
            </span>
          </div>
        )}

        <form
          onSubmit={submit}
          data-testid="waitlist-form"
          className="mt-10 grid grid-cols-1 sm:grid-cols-12 gap-3 max-w-3xl mx-auto"
        >
          <div className="sm:col-span-4">
            <Input
              data-testid="waitlist-name"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-neutral-950 border-neutral-800 rounded-none focus-visible:ring-yellow-500 focus-visible:ring-1 focus-visible:border-yellow-500 text-sm"
            />
          </div>
          <div className="sm:col-span-5">
            <Input
              data-testid="waitlist-email"
              type="email"
              required
              placeholder="you@yourbusiness.com.au"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-neutral-950 border-neutral-800 rounded-none focus-visible:ring-yellow-500 focus-visible:ring-1 focus-visible:border-yellow-500 text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <Select value={trade} onValueChange={setTrade}>
              <SelectTrigger
                data-testid="waitlist-trade"
                className="h-12 bg-neutral-950 border-neutral-800 rounded-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
              >
                <SelectValue placeholder="Trade" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 border-neutral-800 rounded-none">
                {TRADES.map((t) => (
                  <SelectItem
                    key={t.v}
                    value={t.v}
                    className="rounded-none focus:bg-yellow-500 focus:text-black"
                  >
                    {t.l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
    </section>
  );
}

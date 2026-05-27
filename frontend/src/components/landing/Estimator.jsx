import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const JOB_TYPES = [
  { v: "earthmoving", l: "Earthmoving · Bulk Cut/Fill" },
  { v: "excavation", l: "Excavation · Trenching" },
  { v: "concreting", l: "Concreting · Slab Pour" },
  { v: "driveway", l: "Driveway · Concrete or Pavers" },
  { v: "retaining_wall", l: "Retaining Wall" },
  { v: "landscaping", l: "Landscaping · Soft + Hardscape" },
];

const MATERIALS = [
  "32MPa Concrete",
  "Road Base",
  "Geo Fabric",
  "Reo Mesh (SL82)",
  "Mulch & Soil",
  "Pavers",
  "Turf",
  "Treated Pine Sleepers",
  "Drainage (ag pipe)",
];

const COMPLEXITY = [
  { v: "low", l: "Low — flat, easy access" },
  { v: "medium", l: "Medium — typical residential" },
  { v: "high", l: "High — tight access, slope, services" },
];

const currency = (n) =>
  "$" +
  Math.round(Number(n) || 0)
    .toLocaleString("en-AU");

export default function Estimator() {
  const [jobType, setJobType] = useState("concreting");
  const [description, setDescription] = useState(
    "Pour a 60m² shed slab, 32MPa concrete, SL82 mesh, broom finish, includes setting out and edge formwork."
  );
  const [areaSqm, setAreaSqm] = useState(60);
  const [timeline, setTimeline] = useState([7]);
  const [location, setLocation] = useState("Geelong, VIC");
  const [complexity, setComplexity] = useState("medium");
  const [selectedMats, setSelectedMats] = useState([
    "32MPa Concrete",
    "Reo Mesh (SL82)",
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(null);

  const toggleMat = (m) =>
    setSelectedMats((cur) =>
      cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]
    );

  const submit = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setError(null);
    setQuote(null);
    try {
      const { data } = await axios.post(`${API}/quote/generate`, {
        job_type: jobType,
        description,
        area_sqm: Number(areaSqm) || 1,
        timeline_days: timeline[0],
        location,
        materials: selectedMats,
        complexity,
      });
      setQuote(data);
      toast.success("Quote generated. Have a squiz on the right.");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Couldn't generate quote.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="estimator"
      data-testid="estimator-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-7">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500">
              [ Live Demo · Powered by GPT-5.2 ]
            </span>
            <h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Build a quote.
              <br />
              Right now.
            </h2>
          </div>
          <div className="md:col-span-5 self-end text-neutral-400 leading-relaxed">
            Punch in a real job. Watch Quoteforge spit out a tight, line-itemed
            AUD quote with materials, plant, labour, contingency and GST. No
            account required.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 border border-neutral-800">
          {/* LEFT: Form */}
          <form
            onSubmit={submit}
            data-testid="estimator-form"
            className="p-6 sm:p-10 bg-neutral-950 border-b lg:border-b-0 lg:border-r border-neutral-800 space-y-7"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">
                / INPUTS
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-yellow-500">
                AUD · GST INCL.
              </span>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="job-type"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400"
              >
                Job type
              </Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger
                  id="job-type"
                  data-testid="estimator-job-type"
                  className="h-12 rounded-none bg-black border-neutral-800 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border-neutral-800 rounded-none">
                  {JOB_TYPES.map((j) => (
                    <SelectItem
                      key={j.v}
                      value={j.v}
                      className="rounded-none focus:bg-yellow-500 focus:text-black"
                    >
                      {j.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="desc"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400"
              >
                Job description
              </Label>
              <Textarea
                id="desc"
                data-testid="estimator-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500 resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Area (m²)
                </Label>
                <Input
                  data-testid="estimator-area"
                  type="number"
                  min={1}
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(e.target.value)}
                  className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Location
                </Label>
                <Input
                  data-testid="estimator-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Timeline
                </Label>
                <span
                  data-testid="estimator-timeline-value"
                  className="font-mono text-sm text-yellow-500"
                >
                  {timeline[0]} day{timeline[0] === 1 ? "" : "s"}
                </span>
              </div>
              <Slider
                data-testid="estimator-timeline"
                value={timeline}
                onValueChange={setTimeline}
                min={1}
                max={45}
                step={1}
                className="[&_[role=slider]]:rounded-none [&_[role=slider]]:bg-yellow-500 [&_[role=slider]]:border-yellow-500 [&_.bg-primary]:bg-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                Complexity
              </Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger
                  data-testid="estimator-complexity"
                  className="h-12 rounded-none bg-black border-neutral-800 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border-neutral-800 rounded-none">
                  {COMPLEXITY.map((c) => (
                    <SelectItem
                      key={c.v}
                      value={c.v}
                      className="rounded-none focus:bg-yellow-500 focus:text-black"
                    >
                      {c.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                Materials included
              </Label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 border border-neutral-800 p-4 bg-black">
                {MATERIALS.map((m) => {
                  const id = `mat-${m.replace(/\W+/g, "-").toLowerCase()}`;
                  const checked = selectedMats.includes(m);
                  return (
                    <label
                      key={m}
                      htmlFor={id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <Checkbox
                        id={id}
                        data-testid={`material-${m.replace(/\W+/g, "-").toLowerCase()}`}
                        checked={checked}
                        onCheckedChange={() => toggleMat(m)}
                        className="rounded-none border-neutral-700 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:text-black"
                      />
                      <span
                        className={`text-xs sm:text-sm ${
                          checked ? "text-neutral-100" : "text-neutral-400"
                        } group-hover:text-yellow-500 transition-colors`}
                      >
                        {m}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="estimator-submit"
              className="w-full inline-flex items-center justify-center gap-2 h-14 bg-yellow-500 text-black font-bold uppercase tracking-[0.18em] text-sm btn-industrial disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Quoting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Quote
                </>
              )}
            </button>
          </form>

          {/* RIGHT: Terminal output */}
          <div
            data-testid="estimator-output"
            className="relative bg-black min-h-[640px] overflow-hidden"
          >
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            <div className="relative p-6 sm:p-10 h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal
                    className="w-4 h-4 text-yellow-500"
                    strokeWidth={2}
                  />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                    quoteforge://terminal
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-yellow-500">
                  {loading ? "ANALYZING" : quote ? "READY" : "STANDBY"}
                </span>
              </div>

              <div className="flex-1 mt-6 font-mono text-sm">
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 text-neutral-300"
                    >
                      <Line>$ quoteforge --estimate --trade={jobType}</Line>
                      <Line delay={0.1}>→ parsing job brief...</Line>
                      <Line delay={0.4}>→ resolving regional rates ({location})...</Line>
                      <Line delay={0.7}>→ sizing plant / spoil / formwork...</Line>
                      <Line delay={1.0}>→ querying gpt-5.2 estimator...</Line>
                      <Line delay={1.3}>→ assembling line items...</Line>
                      <div className="flex items-center gap-2 mt-3 text-yellow-500">
                        <span>computing</span>
                        <span className="caret" />
                      </div>
                    </motion.div>
                  )}

                  {!loading && !quote && !error && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3 text-neutral-500"
                    >
                      <Line>$ quoteforge --help</Line>
                      <p className="text-neutral-400 leading-relaxed">
                        Fill out the brief on the left and hit{" "}
                        <span className="text-yellow-500">Generate AI Quote</span>.
                        You'll get a full line-itemed estimate here in about 10
                        seconds — same format you'd send to a client.
                      </p>
                      <p className="text-neutral-600 text-xs mt-6">
                        // Sample output: labour, materials, plant, contingency,
                        GST, total range, assumptions, next steps.
                      </p>
                    </motion.div>
                  )}

                  {error && !loading && (
                    <motion.div
                      key="err"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300 flex gap-3"
                    >
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {quote && !loading && <QuoteReadout quote={quote} />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="text-neutral-300"
    >
      {children}
    </motion.div>
  );
}

function QuoteReadout({ quote }) {
  return (
    <motion.div
      key="quote"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-testid="quote-readout"
      className="space-y-6 text-neutral-200"
    >
      <div className="flex items-center gap-2 text-yellow-500">
        <span>$</span>
        <span>quote.generated</span>
        <span className="text-neutral-600">·</span>
        <span className="text-neutral-400">
          id={quote.id?.slice(0, 8)}
        </span>
      </div>

      <p className="text-sm text-neutral-300 leading-relaxed">{quote.summary}</p>

      <div className="border border-neutral-800">
        <div className="grid grid-cols-12 px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          <span className="col-span-6">Item</span>
          <span className="col-span-2 text-right">Qty</span>
          <span className="col-span-2 text-right">Rate</span>
          <span className="col-span-2 text-right">Total</span>
        </div>
        <div className="divide-y divide-neutral-900">
          {quote.line_items?.map((li, i) => (
            <div
              key={i}
              data-testid={`quote-line-${i}`}
              className="grid grid-cols-12 px-3 py-3 text-xs hover:bg-neutral-950"
            >
              <div className="col-span-6">
                <div className="text-neutral-200">{li.label}</div>
                <div className="text-neutral-500 text-[11px] mt-0.5">
                  {li.detail}
                </div>
              </div>
              <span className="col-span-2 text-right text-neutral-400">
                {li.qty} {li.unit}
              </span>
              <span className="col-span-2 text-right text-neutral-400">
                {currency(li.unit_cost)}
              </span>
              <span className="col-span-2 text-right text-yellow-500 font-semibold">
                {currency(li.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-800">
        <Stat label="Labour" value={currency(quote.labor_total)} />
        <Stat label="Materials" value={currency(quote.materials_total)} />
        <Stat label="Contingency" value={currency(quote.contingency_total)} />
        <Stat label="GST" value={currency(quote.gst)} />
      </div>

      <div className="border border-yellow-500/60 bg-yellow-500/5 p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
          Total Range (incl. GST)
        </div>
        <div className="mt-2 flex items-baseline gap-3 flex-wrap">
          <span className="font-display text-3xl sm:text-4xl text-yellow-500">
            {currency(quote.total_low)}
          </span>
          <span className="text-neutral-500">→</span>
          <span className="font-display text-3xl sm:text-4xl text-yellow-500">
            {currency(quote.total_high)}
          </span>
        </div>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
          {quote.timeline_estimate} · confidence: {quote.confidence}
        </div>
      </div>

      {quote.assumptions?.length > 0 && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
            // Assumptions
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-400">
            {quote.assumptions.map((a, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-yellow-500">→</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {quote.next_steps?.length > 0 && (
        <div className="border-t border-neutral-800 pt-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
            // Next steps
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {quote.next_steps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <ArrowRight className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-neutral-950 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-base text-neutral-100 font-semibold">
        {value}
      </div>
    </div>
  );
}

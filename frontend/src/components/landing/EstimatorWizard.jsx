import { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
  Box,
  Leaf,
  Truck,
  User,
  Terminal,
  AlertTriangle,
  X,
  Hammer,
  Wrench,
  Droplets,
  MapPin,
  ExternalLink,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { JOB_GROUPS, JOB_LOOKUP, jobsByIds } from "@/lib/jobCatalog";
import { AU_STATES } from "@/lib/auSuburbs";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TRADE_ICON = { Landscaping: Leaf, Concreting: Box, Earthmoving: Truck };

const currency = (n) =>
  "$" + Math.round(Number(n) || 0).toLocaleString("en-AU");

function evalComputed(expr, values) {
  // Tiny expression evaluator: a*b/c, a*b, a+b. Operates on numeric keys.
  try {
    const safe = expr.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (k) => {
      const v = parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    });
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${safe});`)();
    return Number.isFinite(result) ? Math.round(result * 100) / 100 : "";
  } catch {
    return "";
  }
}

export default function EstimatorWizard() {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({
    full_name: "",
    phone: "",
    email: "",
    street: "",
    suburb: "",
    state: "QLD",
    postcode: "",
  });
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [measurements, setMeasurements] = useState({}); // { [jobId]: { fieldKey: value } }
  const [complexity, setComplexity] = useState("medium");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(null);

  const toggleJob = (id) =>
    setSelectedJobIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      if (!cur.includes(id) && !measurements[id]) {
        // seed defaults for the newly added job
        const j = JOB_LOOKUP[id];
        const seed = {};
        j.fields.forEach((f) => {
          if (f.default !== undefined) seed[f.key] = f.default;
          if (f.type === "boolean" && f.default === undefined) seed[f.key] = false;
        });
        setMeasurements((m) => ({ ...m, [id]: seed }));
      }
      return next;
    });

  const setField = (jobId, fieldKey, value) =>
    setMeasurements((m) => ({
      ...m,
      [jobId]: { ...(m[jobId] || {}), [fieldKey]: value },
    }));

  const selectedJobs = useMemo(() => jobsByIds(selectedJobIds), [selectedJobIds]);

  const canAdvanceStep1 =
    customer.full_name.trim().length >= 2 &&
    customer.street.trim().length >= 2 &&
    customer.suburb.trim().length >= 2 &&
    customer.state.trim().length >= 2 &&
    selectedJobIds.length > 0;

  const canAdvanceStep2 = selectedJobs.every((j) => {
    const m = measurements[j.id] || {};
    // every required numeric field with min has a value > 0; required selects have a choice
    return j.fields.every((f) => {
      if (f.computed) return true;
      if (f.type === "boolean") return true;
      const v = m[f.key];
      if (f.type === "number") return Number.isFinite(parseFloat(v)) && parseFloat(v) > 0;
      if (f.type === "select") return !!v;
      return true;
    });
  });

  const submit = async () => {
    setLoading(true);
    setError(null);
    setQuote(null);
    setStep(3);
    try {
      // Compute any derived fields before sending
      const scopes = selectedJobs.map((j) => {
        const m = { ...(measurements[j.id] || {}) };
        j.fields.forEach((f) => {
          if (f.computed) m[f.key] = evalComputed(f.computed, m);
        });
        return {
          job_type: j.id,
          trade: j.trade,
          label: j.label,
          measurements: m,
        };
      });

      const composedAddress = [
        customer.street.trim(),
        [
          customer.suburb.trim(),
          customer.state.trim(),
          (customer.postcode || "").trim(),
        ]
          .filter(Boolean)
          .join(" "),
      ]
        .filter(Boolean)
        .join(", ");

      const { data } = await axios.post(`${API}/quote/multi-generate`, {
        customer: {
          full_name: customer.full_name.trim(),
          phone: customer.phone || null,
          email: customer.email || null,
          address: composedAddress,
        },
        scopes,
        complexity,
        notes: notes || null,
      });
      setQuote(data);
      toast.success("Quote ready. Scroll to see the breakdown.");
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

  const reset = () => {
    setStep(1);
    setQuote(null);
    setError(null);
  };

  return (
    <div data-testid="estimator-wizard">
      <StepHeader step={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Step1
              customer={customer}
              setCustomer={setCustomer}
              selectedJobIds={selectedJobIds}
              toggleJob={toggleJob}
            />
            <StepNav
              onNext={() => setStep(2)}
              nextDisabled={!canAdvanceStep1}
              showBack={false}
              nextLabel="Continue to measurements"
            />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Step2
              selectedJobs={selectedJobs}
              measurements={measurements}
              setField={setField}
              complexity={complexity}
              setComplexity={setComplexity}
              notes={notes}
              setNotes={setNotes}
            />
            <StepNav
              onBack={() => setStep(1)}
              onNext={submit}
              nextDisabled={!canAdvanceStep2 || loading}
              nextLabel={loading ? "Building quote..." : "Generate AI Quote"}
              nextIcon={loading ? Loader2 : Sparkles}
              nextSpin={loading}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Step3
              loading={loading}
              error={error}
              quote={quote}
              selectedJobs={selectedJobs}
              customer={customer}
              onReset={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Step header (progress)
   ============================================================ */
function StepHeader({ step }) {
  const steps = [
    { n: 1, label: "Customer & Job Types" },
    { n: 2, label: "Measurements" },
    { n: 3, label: "AI Quote" },
  ];
  return (
    <div className="mb-10">
      <div className="border border-neutral-800 p-6 sm:p-8 bg-neutral-950 mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
          Step {step} of 3
        </div>
        <h3 className="mt-2 font-display uppercase text-2xl sm:text-3xl tracking-tight">
          {steps[step - 1].label}
        </h3>
        <p className="mt-2 text-sm text-neutral-400">
          {step === 1 &&
            "Tell us who the quote's for and which trades apply. Pick every job that's part of the scope."}
          {step === 2 &&
            "Punch in measurements for each selected job. We've defaulted what we can — adjust to suit the site."}
          {step === 3 &&
            "TerrainPRO AI is reading the brief and assembling a line-itemed AUD quote."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {steps.map((s) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <div
              key={s.n}
              data-testid={`step-indicator-${s.n}`}
              className={`relative border p-4 ${
                active
                  ? "border-yellow-500 bg-yellow-500/5"
                  : done
                  ? "border-yellow-500/40 bg-neutral-950"
                  : "border-neutral-800 bg-neutral-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
                    active || done ? "text-yellow-500" : "text-neutral-500"
                  }`}
                >
                  Step {s.n}
                </span>
                {done && (
                  <Check className="w-3.5 h-3.5 text-yellow-500" strokeWidth={3} />
                )}
              </div>
              <div
                className={`mt-1 font-display uppercase text-xs sm:text-sm tracking-tight ${
                  active ? "text-yellow-500" : done ? "text-neutral-200" : "text-neutral-500"
                }`}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Step 1 — Customer details + job-type chips
   ============================================================ */
function Step1({
  customer,
  setCustomer,
  selectedJobIds,
  toggleJob,
}) {
  const onChange = (k) => (e) =>
    setCustomer((c) => ({ ...c, [k]: e.target.value }));

  return (
    <div className="space-y-10">
      {/* Customer */}
      <div className="border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4 mb-6">
          <User className="w-4 h-4 text-yellow-500" strokeWidth={2} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Customer Details
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldShell label="Full name" required>
            <Input
              data-testid="wiz-customer-name"
              value={customer.full_name}
              onChange={onChange("full_name")}
              placeholder="Mike Thompson"
              className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FieldShell>
          <FieldShell label="Phone">
            <Input
              data-testid="wiz-customer-phone"
              value={customer.phone}
              onChange={onChange("phone")}
              placeholder="0412 345 678"
              className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FieldShell>
          <FieldShell label="Email">
            <Input
              data-testid="wiz-customer-email"
              type="email"
              value={customer.email}
              onChange={onChange("email")}
              placeholder="customer@email.com"
              className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FieldShell>
          <FieldShell label="Suburb / town" required>
            <Input
              data-testid="wiz-customer-suburb"
              value={customer.suburb}
              onChange={onChange("suburb")}
              placeholder="Narangba"
              className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
            />
          </FieldShell>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mt-5">
          <div className="sm:col-span-7">
            <FieldShell label="Street address" required>
              <Input
                data-testid="wiz-customer-street"
                value={customer.street}
                onChange={onChange("street")}
                placeholder="14 Settlers Cres"
                className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500"
              />
            </FieldShell>
          </div>
          <div className="sm:col-span-3">
            <FieldShell label="State" required>
              <Select
                value={customer.state}
                onValueChange={(v) => setCustomer((c) => ({ ...c, state: v }))}
              >
                <SelectTrigger
                  data-testid="wiz-customer-state"
                  className="h-12 rounded-none bg-black border-neutral-800 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border-neutral-800 rounded-none">
                  {AU_STATES.map((s) => (
                    <SelectItem
                      key={s.code}
                      value={s.code}
                      className="rounded-none focus:bg-yellow-500 focus:text-black"
                    >
                      {s.code} — {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldShell>
          </div>
          <div className="sm:col-span-2">
            <FieldShell label="Postcode">
              <Input
                data-testid="wiz-customer-postcode"
                value={customer.postcode}
                onChange={onChange("postcode")}
                placeholder="4504"
                inputMode="numeric"
                maxLength={4}
                className="h-12 rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500 font-mono"
              />
            </FieldShell>
          </div>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
          {customer.state && customer.suburb
            ? `Site context locked — ${customer.suburb}, ${customer.state} ${customer.postcode}. Rates auto-tune for the region.`
            : "Suppliers & rates auto-tune once a suburb is selected."}
        </p>
      </div>

      {/* Job types */}
      <div className="border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Job Types — Select all that apply
          </span>
          <span
            data-testid="wiz-selected-count"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-yellow-500"
          >
            {selectedJobIds.length} selected
          </span>
        </div>

        <div className="space-y-8">
          {JOB_GROUPS.map((group) => {
            const Icon = TRADE_ICON[group.trade] || Box;
            return (
              <div key={group.trade}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon
                    className="w-4 h-4 text-yellow-500"
                    strokeWidth={1.8}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
                    {group.trade}
                  </span>
                  <span className="h-px flex-1 bg-neutral-800" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.jobs.map((j) => {
                    const active = selectedJobIds.includes(j.id);
                    return (
                      <button
                        key={j.id}
                        type="button"
                        data-testid={`job-chip-${j.id}`}
                        onClick={() => toggleJob(j.id)}
                        className={`px-4 h-10 border text-xs uppercase tracking-[0.12em] font-semibold transition-colors ${
                          active
                            ? "bg-yellow-500 border-yellow-500 text-black"
                            : "bg-black border-neutral-800 text-neutral-300 hover:border-yellow-500 hover:text-yellow-500"
                        }`}
                      >
                        {active && <Check className="inline w-3 h-3 mr-1.5" strokeWidth={3} />}
                        {j.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FieldShell({ label, required, children }) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
        {label} {required && <span className="text-yellow-500">*</span>}
      </Label>
      {children}
    </div>
  );
}

/* ============================================================
   Step 2 — Measurements per selected job
   ============================================================ */
function Step2({
  selectedJobs,
  measurements,
  setField,
  complexity,
  setComplexity,
  notes,
  setNotes,
}) {
  return (
    <div className="space-y-6">
      {selectedJobs.map((job) => (
        <JobMeasurements
          key={job.id}
          job={job}
          values={measurements[job.id] || {}}
          setField={setField}
        />
      ))}

      <div className="border border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Job Complexity & Notes
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldShell label="Complexity">
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger
                data-testid="wiz-complexity"
                className="h-12 rounded-none bg-black border-neutral-800 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 border-neutral-800 rounded-none">
                <SelectItem value="low" className="rounded-none focus:bg-yellow-500 focus:text-black">
                  Low — flat, easy access
                </SelectItem>
                <SelectItem value="medium" className="rounded-none focus:bg-yellow-500 focus:text-black">
                  Medium — typical residential
                </SelectItem>
                <SelectItem value="high" className="rounded-none focus:bg-yellow-500 focus:text-black">
                  High — tight access, slope, services
                </SelectItem>
              </SelectContent>
            </Select>
          </FieldShell>
        </div>
        <FieldShell label="Notes for the estimator (optional)">
          <Textarea
            data-testid="wiz-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else worth knowing — overhead power, septic, council overlays, deadlines..."
            className="rounded-none bg-black border-neutral-800 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500 resize-none text-sm"
          />
        </FieldShell>
      </div>
    </div>
  );
}

function JobMeasurements({ job, values, setField }) {
  const Icon = TRADE_ICON[job.trade] || Box;

  return (
    <div
      data-testid={`measurements-${job.id}`}
      className="border border-neutral-800 bg-neutral-950"
    >
      <div className="flex items-center justify-between border-b border-neutral-800 px-6 sm:px-8 py-4">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
            {job.trade}
          </span>
          <span className="text-neutral-700">/</span>
          <span className="font-display uppercase text-lg tracking-tight">
            {job.label}
          </span>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        {job.description && (
          <p className="text-sm text-neutral-400 mb-6">{job.description}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {job.fields.map((field) => (
            <MeasurementField
              key={field.key}
              jobId={job.id}
              field={field}
              value={
                field.computed
                  ? computedDisplay(field.computed, values)
                  : values[field.key] ?? ""
              }
              onChange={(v) => setField(job.id, field.key, v)}
              readOnly={!!field.computed}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function computedDisplay(expr, values) {
  // Only show a number once all input fields referenced are filled
  const keys = expr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  const allFilled = keys.every((k) => {
    const v = parseFloat(values[k]);
    return Number.isFinite(v) && v > 0;
  });
  if (!allFilled) return "";
  return evalComputed(expr, values);
}

function MeasurementField({ jobId, field, value, onChange, readOnly }) {
  const labelWithUnit = field.unit ? `${field.label} (${field.unit})` : field.label;

  if (field.type === "select") {
    return (
      <FieldShell label={labelWithUnit}>
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger
            data-testid={`mfield-${jobId}-${field.key}`}
            className="h-12 rounded-none bg-zinc-900 border-zinc-700 text-white focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-white rounded-none max-h-72">
            {field.options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="rounded-none text-white focus:bg-yellow-500 focus:text-black"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldShell>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between border border-zinc-700 px-4 h-12 bg-zinc-900">
        <Label className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-300">
          {field.label}
        </Label>
        <Switch
          data-testid={`mfield-${jobId}-${field.key}`}
          checked={!!value}
          onCheckedChange={onChange}
          className="data-[state=checked]:bg-yellow-500"
        />
      </div>
    );
  }

  return (
    <FieldShell label={labelWithUnit}>
      <Input
        data-testid={`mfield-${jobId}-${field.key}`}
        type="number"
        inputMode="decimal"
        readOnly={readOnly}
        value={value}
        min={field.min}
        step={field.step || "any"}
        onChange={(e) => onChange(e.target.value)}
        placeholder={readOnly ? "Auto" : field.default ?? ""}
        className={`h-12 rounded-none border-zinc-700 focus-visible:ring-1 focus-visible:ring-yellow-500 focus-visible:border-yellow-500 font-mono ${
          readOnly
            ? "bg-zinc-950 text-yellow-500 cursor-not-allowed"
            : "bg-zinc-900 text-white placeholder:text-neutral-500"
        }`}
      />
    </FieldShell>
  );
}

/* ============================================================
   Step 3 — AI quote output
   ============================================================ */
function Step3({ loading, error, quote, selectedJobs, customer, onReset }) {
  return (
    <div className="space-y-6">
      <div className="relative border border-neutral-800 bg-black overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative p-6 sm:p-10">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-yellow-500" strokeWidth={2} />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                terrainpro://terminal
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-yellow-500">
              {loading ? "ANALYZING" : quote ? "READY" : error ? "ERROR" : "IDLE"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-sm space-y-2 text-neutral-300"
              >
                <Line>$ terrainpro --multi-quote --scopes={selectedJobs.length}</Line>
                <Line delay={0.1}>→ parsing customer: {customer.full_name || "(anon)"}</Line>
                <Line delay={0.3}>→ resolving regional rates for {customer.suburb ? `${customer.suburb}, ${customer.state}` : "site"}...</Line>
                <Line delay={0.6}>→ sizing plant, materials, labour across {selectedJobs.length} scope{selectedJobs.length === 1 ? "" : "s"}...</Line>
                <Line delay={0.9}>→ querying gpt-5.2 estimator...</Line>
                <Line delay={1.3}>→ assembling consolidated line items...</Line>
                <div className="flex items-center gap-2 mt-3 text-yellow-500">
                  <span>computing</span>
                  <span className="caret" />
                </div>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300 flex gap-3"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {quote && !loading && (
              <QuoteReadout
                quote={quote}
                customer={customer}
                selectedJobs={selectedJobs}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onReset}
          data-testid="wiz-reset"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-neutral-700 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 font-semibold uppercase tracking-[0.15em] text-xs transition-colors"
        >
          <X className="w-4 h-4" /> Start a new quote
        </button>
      </div>
    </div>
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

function QuoteReadout({ quote, customer, selectedJobs }) {
  // Group line items by scope
  const groups = {};
  (quote.line_items || []).forEach((li) => {
    const k = li.scope || "general";
    if (!groups[k]) groups[k] = [];
    groups[k].push(li);
  });
  const orderedScopeIds = selectedJobs.map((j) => j.id).filter((id) => groups[id]);
  const remaining = Object.keys(groups).filter((k) => !orderedScopeIds.includes(k));
  const scopeOrder = [...orderedScopeIds, ...remaining];

  return (
    <motion.div
      key="quote"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-testid="wiz-quote-readout"
      className="space-y-8 text-neutral-200"
    >
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
          Quote {quote.id?.slice(0, 8)} · {customer.full_name || "Customer"}
        </div>
        <p className="mt-3 text-sm text-neutral-300 leading-relaxed">{quote.summary}</p>
      </div>

      {scopeOrder.map((scopeId) => {
        const items = groups[scopeId];
        const scopeJob = selectedJobs.find((j) => j.id === scopeId);
        const subtotal = items.reduce((s, li) => s + (li.total || 0), 0);
        return (
          <div key={scopeId}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
                {scopeJob ? scopeJob.label : scopeId}
              </div>
              <div className="font-mono text-sm text-neutral-300">
                {currency(subtotal)}
              </div>
            </div>
            <div className="border border-neutral-800">
              <div className="grid grid-cols-12 px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-right">Qty</span>
                <span className="col-span-2 text-right">Rate</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              <div className="divide-y divide-neutral-900">
                {items.map((li, i) => (
                  <div
                    key={i}
                    data-testid={`wiz-line-${scopeId}-${i}`}
                    className="grid grid-cols-12 px-3 py-3 text-xs hover:bg-neutral-950"
                  >
                    <div className="col-span-6">
                      <div className="text-neutral-200">{li.label}</div>
                      <div className="text-neutral-500 text-[11px] mt-0.5">{li.detail}</div>
                    </div>
                    <span className="col-span-2 text-right text-neutral-400 font-mono">
                      {li.qty} {li.unit}
                    </span>
                    <span className="col-span-2 text-right text-neutral-400 font-mono">
                      {currency(li.unit_cost)}
                    </span>
                    <span className="col-span-2 text-right text-yellow-500 font-semibold font-mono">
                      {currency(li.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

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

      <NearbySuppliers customer={customer} />
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

/* ============================================================
   Nearby Suppliers
   ============================================================ */
const SUPPLIER_META = {
  bunnings:  { label: "Bunnings Warehouse",     Icon: Hammer  },
  mitre10:   { label: "Mitre 10",               Icon: Wrench  },
  reece:     { label: "Reece Plumbing",         Icon: Droplets},
  landscape: { label: "Landscape Supplies",     Icon: Truck   },
  nursery:   { label: "Nursery / Garden Centre",Icon: Leaf    },
};
const SUPPLIER_ORDER = ["bunnings", "mitre10", "reece", "landscape", "nursery"];

function NearbySuppliers({ customer }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    if (!customer?.suburb || !customer?.state) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API}/suppliers/nearby`, {
        params: {
          suburb: customer.suburb,
          state: customer.state,
          postcode: customer.postcode || "",
          radius_km: 30,
        },
      });
      setData(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Couldn't fetch suppliers");
    } finally {
      setLoading(false);
    }
  }, [customer?.suburb, customer?.state, customer?.postcode]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const grouped = {};
  (data?.suppliers || []).forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <div
      data-testid="nearby-suppliers"
      className="border-t border-neutral-800 pt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Store className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
            Nearest Suppliers
          </span>
          {data?.origin_label && (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 hidden sm:inline">
              · within {data.radius_km}km of {customer.suburb}, {customer.state}
            </span>
          )}
        </div>
        {data && (
          <button
            type="button"
            onClick={fetchSuppliers}
            disabled={loading}
            data-testid="suppliers-refresh"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 hover:text-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>

      {loading && !data && (
        <div className="border border-neutral-800 bg-neutral-950 p-6 flex items-center gap-3 text-sm text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
          Locating nearest Bunnings, Mitre 10, Reece, landscape supplies & nurseries...
        </div>
      )}

      {error && (
        <div className="border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300 flex gap-3">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Suppliers lookup failed: {error}</span>
        </div>
      )}

      {data && data.suppliers.length === 0 && (
        <div className="border border-neutral-800 bg-neutral-950 p-6 text-sm text-neutral-400">
          No suppliers found within {data.radius_km}km — try a closer postcode or
          widen the search.
        </div>
      )}

      {data && data.suppliers.length > 0 && (
        <div className="border border-neutral-800">
          <div className="hidden sm:grid grid-cols-12 px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            <span className="col-span-3">Category</span>
            <span className="col-span-4">Name</span>
            <span className="col-span-4">Address</span>
            <span className="col-span-1 text-right">KM</span>
          </div>
          <div className="divide-y divide-neutral-900">
            {SUPPLIER_ORDER.flatMap((catId) => {
              const items = grouped[catId];
              if (!items?.length) return [];
              const meta = SUPPLIER_META[catId];
              const Icon = meta.Icon;
              return items.map((s, i) => (
                <a
                  key={`${catId}-${i}`}
                  href={s.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`supplier-${catId}-${i}`}
                  className="grid grid-cols-12 gap-2 px-3 py-3 text-xs hover:bg-neutral-950 group"
                >
                  <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
                    <Icon
                      className="w-4 h-4 text-yellow-500 flex-shrink-0"
                      strokeWidth={1.8}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                      {meta.label}
                    </span>
                  </div>
                  <div className="col-span-7 sm:col-span-4 text-neutral-100 font-semibold group-hover:text-yellow-500 transition-colors">
                    {s.name}
                  </div>
                  <div className="col-span-12 sm:col-span-4 text-neutral-500 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{s.address || "Address n/a"}</span>
                  </div>
                  <div className="col-span-5 sm:col-span-1 text-right font-mono text-yellow-500 font-semibold flex items-center justify-end gap-1">
                    {s.distance_km}
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  </div>
                </a>
              ));
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Step navigation buttons
   ============================================================ */
function StepNav({
  onBack,
  onNext,
  nextDisabled,
  showBack = true,
  nextLabel = "Continue",
  nextIcon: NextIcon = ArrowRight,
  nextSpin = false,
}) {
  return (
    <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          data-testid="wiz-back"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 border border-neutral-700 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 font-semibold uppercase tracking-[0.15em] text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      ) : (
        <span className="hidden sm:block" />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        data-testid="wiz-next"
        className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-yellow-500 text-black font-bold uppercase tracking-[0.18em] text-xs btn-industrial disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <NextIcon className={`w-4 h-4 ${nextSpin ? "animate-spin" : ""}`} />
        {nextLabel}
      </button>
    </div>
  );
}

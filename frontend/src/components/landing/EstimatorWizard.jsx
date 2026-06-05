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
  Terminal,
  AlertTriangle,
  X,
  Hammer,
  Wrench,
  Droplets,
  MapPin,
  ExternalLink,
  Store,
  Gem,
  Download,
  Save,
  Percent,
  Receipt,
  HardHat,
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
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateQuotePdf } from "@/lib/quotePdf";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TRADE_ICON = {
  Landscaping: Leaf,
  "Decorative Rocks & Pebbles": Gem,
  Concreting: Box,
  Earthmoving: Truck,
};

const currency = (n) =>
  "$" + Math.round(Number(n) || 0).toLocaleString("en-AU");

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());

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
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable Step-3 model
  const [editItems, setEditItems] = useState([]);
  const [markupPct, setMarkupPct] = useState(20);

  const updateEditItem = (key, field, value) =>
    setEditItems((items) =>
      items.map((it) => (it.key === key ? { ...it, [field]: value } : it))
    );

  const isLabourItem = (it) => /\b(hr|hrs|hour|hours|day|days)\b/i.test(it.unit || "");
  const itemTotal = (it) => (parseFloat(it.qty) || 0) * (parseFloat(it.unit_cost) || 0);

  const computed = useMemo(() => {
    const materials = editItems.filter((it) => !isLabourItem(it));
    const labour = editItems.filter((it) => isLabourItem(it));
    const materialsTotal = materials.reduce((s, it) => s + itemTotal(it), 0);
    const labourTotal = labour.reduce((s, it) => s + itemTotal(it), 0);
    const subtotal = materialsTotal + labourTotal;
    const markupAmt = subtotal * ((parseFloat(markupPct) || 0) / 100);
    const preGst = subtotal + markupAmt;
    const gst = preGst * 0.1;
    const total = preGst + gst;
    return { materials, labour, materialsTotal, labourTotal, subtotal, markupAmt, preGst, gst, total };
  }, [editItems, markupPct]);

  const computedQuote = useMemo(() => {
    if (!quote) return null;
    const r = (n) => Math.round((Number(n) || 0) * 100) / 100;
    return {
      ...quote,
      line_items: editItems.map((it) => ({
        scope: it.scope,
        label: it.label,
        detail: it.detail,
        unit: it.unit,
        qty: parseFloat(it.qty) || 0,
        unit_cost: parseFloat(it.unit_cost) || 0,
        total: r(itemTotal(it)),
      })),
      materials_total: r(computed.materialsTotal),
      labor_total: r(computed.labourTotal),
      contingency_total: r(computed.markupAmt),
      markup_pct: parseFloat(markupPct) || 0,
      subtotal: r(computed.subtotal),
      gst: r(computed.gst),
      total: r(computed.total),
      total_low: r(computed.total),
      total_high: r(computed.total),
    };
  }, [quote, editItems, markupPct, computed]);

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
    (!customer.email.trim() || isValidEmail(customer.email)) &&
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
    setSaved(false);
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

      const { data } = await axios.post(
        `${API}/quote/multi-generate`,
        {
          customer: {
            full_name: customer.full_name.trim(),
            phone: customer.phone || null,
            email: isValidEmail(customer.email) ? customer.email.trim() : null,
            address: composedAddress,
          },
          scopes,
          complexity,
          notes: notes || null,
          labour_rate: user?.hourly_rate ?? null,
        },
        { timeout: 120000 }
      );
      setQuote(data);
      setSaved(false);
      setMarkupPct(20);
      setEditItems(
        (data.line_items || []).map((li, i) => ({
          key: `${li.scope || "general"}-${i}`,
          scope: li.scope || "general",
          label: li.label || "Item",
          detail: li.detail || "",
          unit: li.unit || "",
          qty: li.qty != null ? String(li.qty) : "",
          unit_cost: li.unit_cost != null ? String(li.unit_cost) : "",
        }))
      );
      toast.success("Quote ready. Adjust the line items and margin below.");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      let msg;
      if (err?.code === "ECONNABORTED") {
        msg = "The estimator took too long to respond. Please try again.";
      } else if (Array.isArray(detail)) {
        msg =
          "Some customer details look invalid (check the email and address), then try again.";
      } else if (typeof detail === "string") {
        msg = detail;
      } else {
        msg = err?.message || "Couldn't generate quote.";
      }
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
    setSaved(false);
    setEditItems([]);
    setMarkupPct(20);
    setCustomer({
      full_name: "",
      phone: "",
      email: "",
      street: "",
      suburb: "",
      state: "QLD",
      postcode: "",
    });
    setSelectedJobIds([]);
    setMeasurements({});
    setComplexity("medium");
    setNotes("");
  };

  const selectedJobsForExport = () => jobsByIds(selectedJobIds);

  const handleExportPdf = () => {
    if (!quote) return;
    try {
      generateQuotePdf({
        quote: computedQuote || quote,
        customer: {
          full_name: customer.full_name,
          address: [
            customer.street,
            [customer.suburb, customer.state, customer.postcode].filter(Boolean).join(" "),
          ]
            .filter(Boolean)
            .join(", "),
        },
        selectedJobs: selectedJobsForExport(),
        business: {
          name: user?.business_name || (user?.name ? `${user.name}'s Quote` : "TerrainPRO"),
          abn: user?.abn ? `ABN ${user.abn}` : "",
        },
      });
      toast.success("PDF downloaded.");
    } catch {
      toast.error("Couldn't generate the PDF. Please try again.");
    }
  };

  const handleSaveQuote = async () => {
    if (!quote || saving || saved) return;
    setSaving(true);
    try {
      await axios.post(`${API}/quotes`, {
        quote: computedQuote || quote,
        customer: {
          full_name: customer.full_name,
          phone: customer.phone || null,
          email: customer.email || null,
        },
        scope_summary: jobsByIds(selectedJobIds)
          .map((j) => j.label)
          .join(", "),
      });
      setSaved(true);
      toast.success("Quote saved to your dashboard.");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Couldn't save the quote.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateFinal = async () => {
    if (!saved) await handleSaveQuote();
    handleExportPdf();
  };

  return (
    <div data-testid="estimator-wizard">
      <StepHeader step={step} />

      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          data-testid="wiz-back-dashboard"
          className="group inline-flex items-center gap-2 h-10 px-4 bg-zinc-950/30 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wider transition-all duration-150 hover:border-zinc-600 hover:text-zinc-100"
        >
          <ArrowLeft
            className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5"
            strokeWidth={2.5}
          />
          Back to Dashboard
        </button>

        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            data-testid="wiz-back-step"
            className="group inline-flex items-center gap-2 h-10 px-4 bg-zinc-950/30 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wider transition-all duration-150 hover:border-zinc-600 hover:text-zinc-100"
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5"
              strokeWidth={2.5}
            />
            Previous Step
          </button>
        )}
      </div>

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
              selectedCount={selectedJobIds.length}
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
              onRetry={submit}
              onSave={handleSaveQuote}
              onGenerateFinal={handleGenerateFinal}
              saving={saving}
              saved={saved}
              editItems={editItems}
              updateEditItem={updateEditItem}
              markupPct={markupPct}
              setMarkupPct={setMarkupPct}
              computed={computed}
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
      <div className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-6 sm:p-8 mb-6">
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
              className={`relative rounded-lg border border-l-2 p-4 transition-colors ${
                active
                  ? "border-yellow-500 border-l-yellow-500 bg-zinc-900"
                  : done
                  ? "border-zinc-800 border-l-yellow-500 bg-zinc-900/40"
                  : "border-zinc-800 border-l-zinc-700 bg-zinc-900/40"
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

  const inputCls =
    "h-12 rounded-none bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 transition-colors focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-500/20";

  return (
    <div className="space-y-10">
      {/* Customer */}
      <div className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-6 sm:p-8">
        <SectionHeader>Customer Details</SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          <FieldShell label="Full name" required>
            <Input
              data-testid="wiz-customer-name"
              value={customer.full_name}
              onChange={onChange("full_name")}
              placeholder="Mike Thompson"
              className={inputCls}
            />
          </FieldShell>
          <FieldShell label="Phone">
            <Input
              data-testid="wiz-customer-phone"
              value={customer.phone}
              onChange={onChange("phone")}
              placeholder="0412 345 678"
              className={inputCls}
            />
          </FieldShell>
          <FieldShell label="Email">
            <Input
              data-testid="wiz-customer-email"
              type="email"
              value={customer.email}
              onChange={onChange("email")}
              placeholder="customer@email.com"
              className={inputCls}
              aria-invalid={!!customer.email.trim() && !isValidEmail(customer.email)}
            />
            {!!customer.email.trim() && !isValidEmail(customer.email) && (
              <p
                data-testid="wiz-email-error"
                className="mt-1.5 font-mono text-[11px] text-red-400"
              >
                Enter a valid email or leave it blank.
              </p>
            )}
          </FieldShell>
          <FieldShell label="Suburb / town" required>
            <Input
              data-testid="wiz-customer-suburb"
              value={customer.suburb}
              onChange={onChange("suburb")}
              placeholder="Narangba"
              className={inputCls}
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
                className={inputCls}
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
                  className="h-12 rounded-none bg-zinc-950 border-zinc-800 text-zinc-100 transition-colors focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100 rounded-none">
                  {AU_STATES.map((s) => (
                    <SelectItem
                      key={s.code}
                      value={s.code}
                      className="rounded-none text-zinc-100 focus:bg-yellow-500 focus:text-black"
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
                className={`${inputCls} font-mono`}
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
      <div className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader>Job Types</SectionHeader>
          <span
            data-testid="wiz-selected-count"
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-500"
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
                  <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">
                    {group.trade}
                  </span>
                  <span className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.jobs.map((j) => {
                    const active = selectedJobIds.includes(j.id);
                    return (
                      <button
                        key={j.id}
                        type="button"
                        data-testid={`job-chip-${j.id}`}
                        onClick={() => toggleJob(j.id)}
                        className={`group flex items-center justify-between gap-3 p-4 rounded-lg border text-left transition-colors ${
                          active
                            ? "bg-yellow-500/[0.02] border-yellow-500 text-white"
                            : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-tight leading-snug">
                          {j.label}
                        </span>
                        <span
                          className={`shrink-0 w-5 h-5 grid place-items-center border transition-colors ${
                            active
                              ? "bg-yellow-500 border-yellow-500"
                              : "border-zinc-700 group-hover:border-zinc-600"
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                        </span>
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

const WIZ_INPUT =
  "h-12 rounded-none bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 transition-colors focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-500/20";
const WIZ_TRIGGER =
  "h-12 rounded-none bg-zinc-950 border-zinc-800 text-zinc-100 transition-colors focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 min-w-0 [&>span]:truncate";
const WIZ_CONTENT = "bg-zinc-950 border-zinc-800 text-zinc-100 rounded-none";
const WIZ_ITEM = "rounded-none text-zinc-100 focus:bg-yellow-500 focus:text-black";
const WIZ_CARD =
  "rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40";

function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden className="w-1 h-4 bg-yellow-500" />
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
        {children}
      </span>
    </div>
  );
}

function FieldShell({ label, required, children }) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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

      <div className={`${WIZ_CARD} p-6 sm:p-8 space-y-5`}>
        <SectionHeader>Job Complexity &amp; Notes</SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldShell label="Complexity">
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger data-testid="wiz-complexity" className={WIZ_TRIGGER}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={WIZ_CONTENT}>
                <SelectItem value="low" className={WIZ_ITEM}>
                  Low — flat, easy access
                </SelectItem>
                <SelectItem value="medium" className={WIZ_ITEM}>
                  Medium — typical residential
                </SelectItem>
                <SelectItem value="high" className={WIZ_ITEM}>
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
            className="rounded-none bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 transition-colors focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-500/20 resize-none text-sm"
          />
        </FieldShell>
      </div>
    </div>
  );
}

function JobMeasurements({ job, values, setField }) {
  const Icon = TRADE_ICON[job.trade] || Box;

  // Live area / volume summary when the job uses length + width inputs
  const hasAreaInputs =
    job.fields.some((f) => f.key === "length_m") &&
    job.fields.some((f) => f.key === "width_m");
  const L = parseFloat(values.length_m);
  const W = parseFloat(values.width_m);
  const depthMm = parseFloat(
    values.depth_mm ?? values.thickness_mm ?? values.target_depth_mm
  );
  const area =
    Number.isFinite(L) && Number.isFinite(W) && L > 0 && W > 0 ? L * W : null;
  const volume =
    area != null && Number.isFinite(depthMm) && depthMm > 0
      ? (area * depthMm) / 1000
      : null;

  return (
    <div
      data-testid={`measurements-${job.id}`}
      className={WIZ_CARD}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 sm:px-8 py-4">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">
            {job.trade}
          </span>
          <span className="text-zinc-700">/</span>
          <span className="font-display uppercase text-lg tracking-tight text-zinc-100">
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

        {hasAreaInputs && (
          <div
            data-testid={`measure-summary-${job.id}`}
            className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950 px-5 py-4"
          >
            <div>
              <div className="text-xs font-mono text-zinc-500">TOTAL AREA:</div>
              <div className="mt-1 text-lg font-bold text-white">
                {area != null ? `${area.toFixed(1)} m²` : "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-zinc-500">ESTIMATED VOLUME:</div>
              <div className="mt-1 text-lg font-bold text-yellow-500">
                {volume != null ? `${volume.toFixed(1)} m³` : "—"}
              </div>
            </div>
          </div>
        )}
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
            className={WIZ_TRIGGER}
          >
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className={`${WIZ_CONTENT} max-h-72`}>
            {field.options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className={WIZ_ITEM}
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
      <div className="flex items-center justify-between border border-zinc-800 px-4 h-12 bg-zinc-950">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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
        placeholder={readOnly ? "Auto" : field.placeholder ?? (field.default != null ? String(field.default) : "")}
        className={`h-12 rounded-none border-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-yellow-500/20 focus-visible:border-yellow-500 font-mono ${
          readOnly
            ? "bg-zinc-950 text-yellow-500 cursor-not-allowed"
            : "bg-zinc-950 text-zinc-100 placeholder:text-zinc-600"
        }`}
      />
    </FieldShell>
  );
}

/* ============================================================
   Step 3 — AI quote output
   ============================================================ */
function Step3({
  loading,
  error,
  quote,
  selectedJobs,
  customer,
  onReset,
  onRetry,
  onSave,
  onGenerateFinal,
  saving,
  saved,
  editItems,
  updateEditItem,
  markupPct,
  setMarkupPct,
  computed,
}) {
  return (
    <div className="space-y-6">
      {(loading || error) && (
        <div className="relative rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-black overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="relative p-6 sm:p-10">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-yellow-500" strokeWidth={2} />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                  terrainpro://terminal
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-yellow-500">
                {loading ? "ANALYZING" : error ? "ERROR" : "IDLE"}
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
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>computing</span>
                    <span className="caret" />
                  </div>
                  <Line delay={1.6}>
                    <span className="text-neutral-500">
                      // this usually takes 20–40 seconds — hang tight, don't refresh
                    </span>
                  </Line>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300 flex gap-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={onRetry}
                    data-testid="wiz-retry"
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-yellow-500 text-black font-bold uppercase tracking-[0.15em] text-xs btn-industrial"
                  >
                    <Sparkles className="w-4 h-4" /> Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {quote && !loading && (
        <EditableQuoteBreakdown
          quote={quote}
          customer={customer}
          items={editItems}
          updateItem={updateEditItem}
          markupPct={markupPct}
          setMarkupPct={setMarkupPct}
          computed={computed}
          onReset={onReset}
          onSave={onSave}
          onGenerateFinal={onGenerateFinal}
          saving={saving}
          saved={saved}
        />
      )}
    </div>
  );
}

const MINI_INPUT =
  "h-9 w-full rounded-none bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono px-2 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

function EditableLineRow({ item, updateItem }) {
  const total = (parseFloat(item.qty) || 0) * (parseFloat(item.unit_cost) || 0);
  return (
    <div
      data-testid={`wiz-line-${item.key}`}
      className="grid grid-cols-12 gap-2 px-3 py-3 items-center hover:bg-zinc-900/40 transition-colors"
    >
      <div className="col-span-12 sm:col-span-5">
        <div className="text-sm text-zinc-200">{item.label}</div>
        {item.detail && (
          <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">{item.detail}</div>
        )}
      </div>
      <div className="col-span-4 sm:col-span-2">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            step="any"
            value={item.qty}
            onChange={(e) => updateItem(item.key, "qty", e.target.value)}
            data-testid={`wiz-qty-${item.key}`}
            className={MINI_INPUT}
          />
          {item.unit && (
            <span className="font-mono text-[10px] uppercase text-zinc-500 shrink-0">{item.unit}</span>
          )}
        </div>
      </div>
      <div className="col-span-4 sm:col-span-2">
        <div className="flex items-center">
          <span className="font-mono text-xs text-zinc-500 pr-1">$</span>
          <input
            type="number"
            min="0"
            step="any"
            value={item.unit_cost}
            onChange={(e) => updateItem(item.key, "unit_cost", e.target.value)}
            data-testid={`wiz-rate-${item.key}`}
            className={MINI_INPUT}
          />
        </div>
      </div>
      <div
        data-testid={`wiz-linetotal-${item.key}`}
        className="col-span-4 sm:col-span-3 text-right font-mono text-sm text-yellow-500 font-semibold"
      >
        {currency(total)}
      </div>
    </div>
  );
}

function TierSection({ title, icon: Icon, total, items, updateItem, empty }) {
  return (
    <div className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
          <span className="font-display uppercase text-base tracking-tight text-white">{title}</span>
        </div>
        <span className="font-mono text-sm text-yellow-500">{currency(total)}</span>
      </div>
      {items.length > 0 && (
        <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-2 bg-zinc-950/60 border-b border-zinc-800 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          <span className="col-span-5">Item</span>
          <span className="col-span-2">Qty</span>
          <span className="col-span-2">Rate</span>
          <span className="col-span-3 text-right">Total</span>
        </div>
      )}
      <div className="divide-y divide-zinc-800/70">
        {items.map((it) => (
          <EditableLineRow key={it.key} item={it} updateItem={updateItem} />
        ))}
      </div>
      {items.length === 0 && (
        <div className="px-5 py-6 text-center text-xs text-zinc-500">{empty}</div>
      )}
    </div>
  );
}

function TotalLine({ label, value, testid }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-400">{label}</span>
      <span data-testid={testid} className="font-mono text-zinc-100">{value}</span>
    </div>
  );
}

function LiveTotals({ computed, markupPct }) {
  return (
    <div data-testid="wiz-live-totals" className="rounded-lg border-2 border-yellow-500 bg-zinc-950 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">Live Totals</span>
      </div>
      <div className="space-y-2.5">
        <TotalLine label="Subtotal" value={currency(computed.subtotal)} testid="total-subtotal" />
        <TotalLine label={`Markup (${parseFloat(markupPct) || 0}%)`} value={currency(computed.markupAmt)} testid="total-markup" />
        <TotalLine label="GST (10%)" value={currency(computed.gst)} testid="total-gst" />
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-800 flex items-end justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400">Total AUD</span>
        <span data-testid="total-final" className="font-display text-3xl text-yellow-500 font-black tracking-tight leading-none">
          {currency(computed.total)}
        </span>
      </div>
    </div>
  );
}

function EditableQuoteBreakdown({
  quote,
  customer,
  items,
  updateItem,
  markupPct,
  setMarkupPct,
  computed,
  onReset,
  onSave,
  onGenerateFinal,
  saving,
  saved,
}) {
  return (
    <motion.div
      key="quote"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-testid="wiz-quote-readout"
      className="space-y-6"
    >
      {/* Summary */}
      <div className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500">
          Quote {quote.id?.slice(0, 8)} · {customer.full_name || "Customer"}
        </div>
        <p className="mt-3 text-sm text-neutral-300 leading-relaxed">{quote.summary}</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          Everything below is editable — adjust quantities, rates and your margin to fine-tune the quote.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT — editable tiers */}
        <div className="lg:col-span-8 space-y-6">
          <TierSection
            title="Material Costs"
            icon={Box}
            total={computed.materialsTotal}
            items={computed.materials}
            updateItem={updateItem}
            empty="No material line items in this quote."
          />
          <TierSection
            title="Labour & Earthmoving"
            icon={HardHat}
            total={computed.labourTotal}
            items={computed.labour}
            updateItem={updateItem}
            empty="No labour or machinery line items in this quote."
          />

          {/* Margin & Markup */}
          <div className="rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Percent className="w-4 h-4 text-yellow-500" strokeWidth={1.8} />
                <span className="font-display uppercase text-base tracking-tight text-white">Margin &amp; Markup</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={markupPct}
                  onChange={(e) => setMarkupPct(e.target.value)}
                  data-testid="wiz-markup-input"
                  className="h-9 w-16 rounded-none bg-zinc-950 border border-zinc-800 text-yellow-500 text-sm font-mono px-2 text-right focus:border-yellow-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-yellow-500 font-bold">%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={parseFloat(markupPct) || 0}
              onChange={(e) => setMarkupPct(e.target.value)}
              data-testid="wiz-markup-slider"
              className="w-full accent-yellow-500 cursor-pointer"
            />
            <div className="flex justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              <span>0%</span>
              <span className="text-zinc-400">Applied across all totals</span>
              <span>50%</span>
            </div>
          </div>

          {quote.assumptions?.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
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

          <NearbySuppliers customer={customer} />
        </div>

        {/* RIGHT — live totals + actions (sticky on desktop) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
          <LiveTotals computed={computed} markupPct={markupPct} />

          <button
            type="button"
            onClick={onSave}
            disabled={saving || saved}
            data-testid="wiz-save-quote"
            className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 border border-neutral-700 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 font-semibold uppercase tracking-[0.15em] text-xs transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Draft Saved" : "Save Draft / Re-Calculate"}
          </button>

          <button
            type="button"
            onClick={onGenerateFinal}
            data-testid="wiz-generate-final"
            className="w-full inline-flex items-center justify-center gap-2 h-14 px-6 bg-yellow-500 text-black font-black uppercase tracking-[0.15em] text-xs btn-industrial"
          >
            Generate Final Client Quote <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={onReset}
            data-testid="wiz-reset"
            className="w-full inline-flex items-center justify-center gap-2 h-10 text-neutral-500 hover:text-neutral-200 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Start a new quote
          </button>
        </aside>
      </div>

      {/* Mobile sticky total bar */}
      <div className="h-24 lg:hidden" aria-hidden />
      <div
        data-testid="sticky-total-banner"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t-2 border-yellow-500 bg-black/95 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400">
              Total incl. GST
            </div>
            <div data-testid="sticky-total" className="font-display text-2xl text-yellow-500 font-black tracking-tight leading-none">
              {currency(computed.total)}
            </div>
          </div>
          <button
            type="button"
            onClick={onGenerateFinal}
            data-testid="wiz-generate-final-mobile"
            className="shrink-0 inline-flex items-center justify-center gap-2 h-12 px-5 bg-yellow-500 text-black font-black uppercase tracking-[0.14em] text-xs btn-industrial"
          >
            Generate <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
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
  selectedCount = null,
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
      ) : selectedCount != null ? (
        <span
          data-testid="wiz-footer-count"
          className="inline-flex items-center justify-center bg-yellow-500 text-black px-3 h-12 sm:h-auto sm:py-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
        >
          {selectedCount} Selected
        </span>
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

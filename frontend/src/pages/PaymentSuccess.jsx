import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MAX_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 2000;

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [state, setState] = useState({ phase: "polling", message: "Confirming your payment..." });
  const [planName, setPlanName] = useState(null);
  const attempts = useRef(0);
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setState({ phase: "error", message: "Missing payment session ID." });
      return;
    }

    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      attempts.current += 1;
      try {
        const { data } = await axios.get(`${API}/payments/status/${sessionId}`);
        if (data.plan_name) setPlanName(data.plan_name);
        if (data.payment_status === "paid") {
          await refresh();
          setState({ phase: "success", message: "Payment successful." });
          return;
        }
        if (data.status === "expired") {
          setState({ phase: "error", message: "Payment session expired. Please try again." });
          return;
        }
        if (attempts.current >= MAX_ATTEMPTS) {
          setState({ phase: "timeout", message: "Still processing. We'll email you when it's confirmed." });
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err) {
        setState({
          phase: "error",
          message: err?.response?.data?.detail || "Couldn't verify payment status.",
        });
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, refresh]);

  return (
    <div
      data-testid="payment-success-page"
      className="relative min-h-screen bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center px-5 py-16 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />

      <div className="relative w-full max-w-lg rounded-lg border border-zinc-800 border-l-2 border-l-yellow-500 bg-zinc-950 p-8 sm:p-10 text-center">
        {state.phase === "polling" && (
          <>
            <div className="inline-grid place-items-center w-14 h-14 bg-zinc-900 border border-zinc-800 mb-6">
              <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
            </div>
            <h1 className="font-display uppercase text-3xl tracking-tight">Confirming payment</h1>
            <p className="mt-3 text-sm text-neutral-400">{state.message}</p>
          </>
        )}

        {state.phase === "success" && (
          <>
            <div className="inline-grid place-items-center w-14 h-14 bg-green-500/10 border border-green-500/30 mb-6">
              <CheckCircle2 className="w-7 h-7 text-green-400" />
            </div>
            <h1 className="font-display uppercase text-3xl tracking-tight">
              You're <span className="text-yellow-500">in.</span>
            </h1>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
              {planName ? (
                <>
                  <span className="text-yellow-500 font-semibold">{planName}</span> plan activated. Unlimited AI quotes unlocked.
                </>
              ) : (
                <>Subscription activated. Unlimited AI quotes unlocked.</>
              )}
            </p>
            <button
              type="button"
              data-testid="payment-success-continue"
              onClick={() => navigate("/dashboard", { replace: true })}
              className="mt-8 inline-flex items-center justify-center gap-2 h-12 px-8 bg-yellow-500 text-black font-black uppercase tracking-[0.18em] text-sm btn-industrial"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {(state.phase === "error" || state.phase === "timeout") && (
          <>
            <div className="inline-grid place-items-center w-14 h-14 bg-red-500/10 border border-red-500/30 mb-6">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h1 className="font-display uppercase text-3xl tracking-tight">
              {state.phase === "timeout" ? "Still processing" : "Payment issue"}
            </h1>
            <p className="mt-3 text-sm text-neutral-400">{state.message}</p>
            <Link
              to="/dashboard"
              data-testid="payment-success-back"
              className="mt-8 inline-flex items-center justify-center gap-2 h-12 px-8 border border-neutral-700 text-neutral-200 hover:border-yellow-500 hover:text-yellow-500 font-black uppercase tracking-[0.18em] text-xs transition-colors"
            >
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Directory from "@/pages/Directory";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Welcome from "@/pages/Welcome";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

// Codex dashboard + quote builder (self-contained under src/codex)
import CodexLayout from "@/codex/components/Layout";
import CodexDashboard from "@/codex/pages/MobileDashboard";
import QuoteBuilder from "@/codex/pages/QuoteBuilder";
import Pipeline from "@/codex/pages/Pipeline";
import Jobs from "@/codex/pages/Jobs";
import More from "@/codex/pages/More";
import Clients from "@/codex/pages/Clients";
import Settings from "@/codex/pages/Settings";
import AICostReview from "@/codex/pages/AICostReview";

// Render a Codex page inside Codex's Layout, behind auth.
const codex = (node) => (
  <ProtectedRoute>
    <CodexLayout>{node}</CodexLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" theme="dark" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />

            {/* Codex experience — dashboard + quote builder + its nav */}
            <Route path="/dashboard" element={codex(<CodexDashboard />)} />
            <Route path="/quote" element={codex(<QuoteBuilder />)} />
            <Route path="/new-quote" element={codex(<QuoteBuilder />)} />
            <Route path="/quotes" element={codex(<Pipeline />)} />
            <Route path="/jobs" element={codex(<Jobs />)} />
            <Route path="/more" element={codex(<More />)} />
            <Route path="/subgrade" element={codex(<AICostReview />)} />
            <Route path="/settings" element={codex(<Settings />)} />
            <Route path="/clients" element={codex(<Clients />)} />

            <Route
              path="/directory"
              element={
                <ProtectedRoute>
                  <Directory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

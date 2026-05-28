import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn } from "@clerk/clerk-react";
import { deDE } from "@clerk/localizations";
import { DashboardLayout } from "./components/layout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import ScanPage from "./pages/ScanPage";
import FormsPage from "./pages/FormsPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import InvoicesPage from "./pages/InvoicesPage";
import SettingsPage from "./pages/SettingsPage";
import ClientPortalLogin from "./pages/ClientPortalLogin";
import ClientPortalDashboard from "./pages/ClientPortalDashboard";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider 
      publishableKey={CLERK_KEY} 
      localization={deDE}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      navigate={(to) => navigate(to)}
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/sign-in/*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            {window.self !== window.top && (
              <div className="max-w-md w-full mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">
                <strong>Hinweis:</strong> Login funktioniert in der Vorschau (iFrame) möglicherweise nicht. 
                Bitte klicke oben rechts auf "Open in New Tab" (oder dieses Fenster in einem neuen Tab öffnen), um dich einzuloggen.
              </div>
            )}
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
          </div>
        } />
        <Route path="/sign-up/*" element={
           <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            {window.self !== window.top && (
              <div className="max-w-md w-full mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">
                <strong>Hinweis:</strong> Registrierung funktioniert in der Vorschau (iFrame) möglicherweise nicht. 
                Bitte klicke oben rechts auf "Open in New Tab" (oder dieses Fenster in einem neuen Tab öffnen), um dich zu registrieren.
              </div>
            )}
            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
          </div>
        } />

        {/* Client Portal Routes */}
        <Route path="/portal/login" element={<ClientPortalLogin />} />
        <Route path="/portal/:clientId" element={<ClientPortalDashboard />} />

        {/* Protected Routes (Agency) */}
        <Route element={
          <>
            <SignedIn>
              <DashboardLayout />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/form-builder" element={<FormBuilderPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </ClerkProvider>
  );
}

export default function App() {
  const isInvalidKey = !CLERK_KEY || CLERK_KEY === "pk_test_..." || CLERK_KEY.includes("cGxhY2Vob2xkZXI") || CLERK_KEY.length < 20;

  if (isInvalidKey) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portal/login" element={<ClientPortalLogin />} />
          <Route path="/portal/:clientId" element={<ClientPortalDashboard />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
              <div className="bg-white p-8 max-w-lg w-full rounded-xl border border-slate-200 shadow-sm space-y-6">
                <h1 className="text-2xl font-bold text-slate-900 border-b pb-4 border-slate-100">🔧 Setup Erforderlich</h1>
                <p className="text-slate-600">
                  Um das Agentur-Dashboard zu öffnen, füge bitte deinen <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> in die Umgebungsvariablen <code className="bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-800">.env</code> ein.
                </p>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm">
                  BehördenHub Pro verwendet Clerk für Authentifizierung und Mandantenfähigkeit (Organizations). Ohne API-Key kannst du nur die Landingpage und das Klienten-Portal im Vorschau-Modus ansehen.
                </div>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}


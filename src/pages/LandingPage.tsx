import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">BehördenHub <span className="text-blue-500 text-xs font-medium uppercase border border-blue-500 px-1 rounded">Pro</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/portal/login"><Button variant="ghost" className="text-slate-500 hover:text-slate-900 hidden md:inline-flex">Klienten-Portal</Button></Link>
          <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
          <Link to="/sign-in"><Button variant="ghost" className="font-medium">Login</Button></Link>
          <Link to="/sign-up"><Button className="bg-blue-600 hover:bg-blue-700 font-medium">Agentur starten</Button></Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto py-24">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
          Das All-in-One <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SaaS</span> für<br /> 
          Sozialberatung & Services
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          Verwalte Klienten, scanne Dokumente per KI, generiere automatisch Behördenformulare und wickle Rechnungen DSGVO-konform ab.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-base px-8 h-12 md:h-14 shadow-lg shadow-blue-500/20">
              Kostenlos testen
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 text-base px-8 h-12 md:h-14 hover:bg-slate-100 text-slate-700 bg-white shadow-sm">
            Demo ansehen
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-left w-full">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center rounded-xl mb-6 text-2xl">🤖</div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Gemini 3 OCR</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Scanne Ausweise, Bescheide und Verträge mit dem iPad. Alle Stammdaten werden per KI fehlerfrei extrahiert.</p>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center rounded-xl mb-6 text-2xl">⚡</div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">150+ Formulare</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Generiere Bürgergeld-, WBS- und Kindergeld-Anträge automatisiert mit den ausgelesenen Klientendaten.</p>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center rounded-xl mb-6 text-2xl">🛡️</div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">DSGVO Multi-Tenant</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Höchste Rechtssicherheit für Agenturen. Isolierte Datensätze, Audit-Logs, Einwilligungs-Management.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-white">
        <p>&copy; 2026 BehördenHub Pro. DSGVO konform gehostet in DE.</p>
      </footer>
    </div>
  );
}

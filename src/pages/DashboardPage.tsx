import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader className="p-0 space-y-0 pb-1">
            <CardTitle className="text-sm text-slate-500 font-normal">Aktive Klienten</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex items-end justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900">128</h3>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded">+4 diesen Monat</span>
          </CardContent>
        </Card>
        
        <Card className="p-5 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader className="p-0 space-y-0 pb-1">
            <CardTitle className="text-sm text-slate-500 font-normal">Formulare generiert</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex items-end justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900">342</h3>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded">+19% ggü. Vormonat</span>
          </CardContent>
        </Card>

        <Card className="p-5 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader className="p-0 space-y-0 pb-1">
            <CardTitle className="text-sm text-slate-500 font-normal">Umsatz (Dieser Monat)</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex items-end justify-between mt-1">
            <h3 className="text-2xl font-bold text-slate-900">€4,250.00</h3>
            <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded">+12% ggü. Vormonat</span>
          </CardContent>
        </Card>

        <Card className="p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex-1">
            <p className="text-slate-500 text-sm mb-1">Behörden-Erfolgsquote</p>
            <h3 className="text-lg font-bold text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              98.2%
            </h3>
          </div>
          <div className="text-xs text-slate-400 border-l pl-4">
            Fehlerfreie <br/>Anträge
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
          <Card className="rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Letzte Aktivitäten</h3>
              <button className="text-xs text-blue-600 font-semibold">Vollständige Historie</button>
            </div>
            <CardContent className="p-0 flex-1">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Zeitpunkt</th>
                    <th className="px-6 py-3">Aktivität</th>
                    <th className="px-6 py-3">Klient</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="text-sm">
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">Vor {i * 15} Min</td>
                      <td className="px-6 py-4 font-medium text-slate-900">Bürgergeld Formular generiert</td>
                      <td className="px-6 py-4 italic text-slate-600">Mustermann, Max</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          <Card className="rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Audit & Compliance Log</h3>
              <p className="text-xs text-slate-500 font-medium">DSGVO-konformes Protokoll der aktuellen Sitzung.</p>
            </div>
            <CardContent className="p-4">
               <div className="rounded-md border p-4 bg-slate-50 font-mono text-xs text-slate-600 h-[260px] overflow-y-auto space-y-1">
                 <div><span className="text-green-600">[SUCCESS]</span> Auth token verified for Tenant ID: t_8923a</div>
                 <div><span className="text-blue-600">[LOG]</span> RLS Database context initiated</div>
                 <div><span className="text-blue-600">[LOG]</span> Searched client list (Query: 'Müller')</div>
                 <div><span className="text-amber-600">[ACTION]</span> Downloaded AV-Vertrag Signed</div>
                 <div><span className="text-green-600">[SUCCESS]</span> OCR Scan Complete via Gemini 3 (ID Card)</div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

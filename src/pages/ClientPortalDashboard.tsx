import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignaturePad } from "@/components/SignaturePad";
import { toast } from "sonner";

export default function ClientPortalDashboard() {
  const [isSignOpen, setIsSignOpen] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const handleSaveSignature = (data: string) => {
    // In a real scenario, we send this data URL to our backend to embed in the document
    console.log("Signature saved:", data.substring(0, 50) + "...");
    toast.success("Unterschrift erfolgreich gespeichert");
    setIsSigned(true);
    setIsSignOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">Sozialberatung Berlin-Mitte</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Klienten-Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-600 hidden md:inline">Hallo, <strong>Max Mustermann</strong></span>
          <Button variant="outline" size="sm">Abmelden</Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Ihre Dokumente & Anträge</h1>
          <p className="text-slate-500">Laden Sie fehlende Dokumente hoch oder unterschreiben Sie Vollmachten digital.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Ausstehende Aufgaben (2)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {!isSigned && (
                  <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">Vollmacht unterschreiben</h4>
                      <p className="text-sm text-slate-500">Bitte leisten Sie eine digitale Unterschrift für die Vertretung beim Jobcenter.</p>
                    </div>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                      onClick={() => setIsSignOpen(true)}
                    >
                      Jetzt signieren
                    </Button>
                  </div>
                )}
                
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-900">Mietvertrag hochladen</h4>
                    <p className="text-sm text-slate-500">Benötigt für den WBS-Antrag.</p>
                  </div>
                  <Button variant="outline" className="whitespace-nowrap">
                    <UploadCloud className="w-4 h-4 mr-2" /> Datei wählen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
             <CardHeader>
               <CardTitle className="text-base">Status</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                {isSigned && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vollmacht</p>
                      <p className="text-xs text-green-600">Unterschrieben (Ausstehend)</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bürgergeld Antrag</p>
                    <p className="text-xs text-green-600">Eingereicht (12.05.)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="animate-pulse w-2 h-2 bg-blue-600 rounded-full"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">WBS Antrag</p>
                    <p className="text-xs text-blue-600">In Bearbeitung</p>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Mitteilungen der Agentur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-800">
                "Hallo Herr Mustermann, wir haben Ihren Antrag vorbereitet. Bitte unterschreiben Sie die Vollmacht zeitnah, damit wir die Unterlagen rechtzeitig einreichen können. Bei Fragen melden Sie sich via WhatsApp."
              </p>
              <p className="text-xs text-slate-500 mt-2">— Marius Schmidt, Heute um 10:45 Uhr</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isSignOpen} onOpenChange={setIsSignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Digitale Unterschrift</DialogTitle>
            <DialogDescription>
              Bitte unterschreiben Sie im markierten Feld, um die Vollmacht rechtsgültig abzuschließen.
            </DialogDescription>
          </DialogHeader>
          
          <div className="pt-4">
            <SignaturePad 
              onSave={handleSaveSignature} 
              onCancel={() => setIsSignOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

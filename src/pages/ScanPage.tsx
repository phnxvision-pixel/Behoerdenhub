import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud, Check, Copy, Wand2, FileText, AlertCircle } from "lucide-react";

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        // Use our real Express endpoint running Gemini OCR
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentBase64: base64,
            documentType: 'Ausweis oder Bescheid'
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setResult(data.data);
        } else {
          console.error("OCR Failed:", data.error);
          alert("Fehler beim Scannen. Ist der API Key gesetzt?");
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
       console.error("Scan Error", error);
       setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dokumenten-Scan per KI</h1>
        <p className="text-slate-500">Ausweise, Bescheide oder Briefe fotografieren (z.B. per iPad) oder hochladen.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="col-span-1 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Dokument Hochladen</CardTitle>
            <CardDescription>
              Gemini 3 extrahiert alle relevanten Stammdaten.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 relative hover:bg-slate-100 transition-colors">
              <UploadCloud className="w-10 h-10 text-brand-500 mb-4" />
              <Label className="cursor-pointer text-center">
                <span className="text-brand-600 font-medium">Datei auswählen</span> oder hereinziehen
                <Input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
              </Label>
              {file && (
                <div className="mt-4 text-sm text-slate-500 font-medium flex items-center bg-white px-3 py-1 rounded-md shadow-sm border">
                  <FileText className="w-4 h-4 mr-2" />
                  {file.name}
                </div>
              )}
            </div>

            <Button 
              className="w-full h-12 text-md" 
              onClick={handleScan} 
              disabled={!file || isScanning}
            >
              {isScanning ? (
                <><span className="animate-spin mr-2">⚙️</span> Analysiere Dokument...</>
              ) : (
                <><Wand2 className="w-5 h-5 mr-2" /> KI Scan Starten</>
              )}
            </Button>
            
            <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm flex items-start border border-amber-200">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>
                <strong>DSGVO Hinweis:</strong> Das Dokument wird nach der Extraktion nicht dauerhaft auf den KI-Servern gespeichert.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-slate-900 text-slate-100 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Extrahierte Daten</CardTitle>
            <CardDescription className="text-slate-400">
              Prüfen und als neuen Klienten anlegen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isScanning && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <span className="animate-spin text-4xl mb-4">⚙️</span>
                <p>Gemini verarbeitet das Dokument...</p>
              </div>
            )}
            
            {!isScanning && !result && (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center px-4">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Hier erscheinen die ausgelesenen Daten. Wähle links ein Dokument und starte den Scan.</p>
              </div>
            )}

            {!isScanning && result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-slate-400 text-xs">Vorname</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white" defaultValue={result.firstName} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-400 text-xs">Nachname</Label>
                    <Input className="bg-slate-800 border-slate-700 text-white" defaultValue={result.lastName} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Geburtsdatum</Label>
                  <Input className="bg-slate-800 border-slate-700 text-white" defaultValue={result.dateOfBirth} />
                </div>

                <div className="space-y-1">
                  <Label className="text-slate-400 text-xs">Adresse</Label>
                  <Input className="bg-slate-800 border-slate-700 text-white" defaultValue={result.address} />
                </div>

                <div className="bg-slate-800 p-4 rounded-lg mt-6 border border-slate-700">
                  <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Check className="w-4 h-4 mr-2" /> Als Klient speichern
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

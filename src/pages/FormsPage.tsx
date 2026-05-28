import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import { PdfPreviewModal } from "@/components/PdfPreviewModal";
import jsPDF from "jspdf";

export default function FormsPage() {
  const forms = [
    { title: "Bürgergeld (HA I)", desc: "Hauptantrag auf Bürgergeld nach dem SGB II.", category: "Jobcenter" },
    { title: "WBS Antrag (Berlin)", desc: "Antrag auf Erteilung eines Wohnberechtigungsscheins.", category: "Wohnamt" },
    { title: "Kindergeld Antrag", desc: "Antrag auf Kindergeld (KG1).", category: "Familienkasse" },
    { title: "Gewerbeanmeldung", desc: "GewA 1 zur Anmeldung eines Gewerbes.", category: "Gewerbeamt" },
    { title: "Vollmacht (Standard)", desc: "Allgemeine Vertretungsvollmacht für die Agentur.", category: "Intern" },
  ];

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [loadingPdf, setLoadingPdf] = useState<number | null>(null);

  const generateDummyPDF = async (form: typeof forms[0], index: number) => {
    setLoadingPdf(index);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(form.title, 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Kategorie: ${form.category}`, 20, 40);
    doc.text(`Generiert am: ${new Date().toLocaleDateString('de-DE')}`, 130, 40);
    
    // Content Box
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(20, 50, 170, 220, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text("Dies ist ein automatisch generiertes Vorschau-Dokument.", 30, 70);
    doc.text(`Formular-ID: ${Math.random().toString(36).substring(7).toUpperCase()}`, 30, 85);
    
    const splitText = doc.splitTextToSize(form.desc, 150);
    doc.text(splitText, 30, 105);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("BehördenHub Pro - Vertrauliches Dokument", 20, 285);
    doc.text("Seite 1 von 1", 170, 285);

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    setPreviewUrl(url);
    setPreviewTitle(form.title);
    setLoadingPdf(null);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Formular-Bibliothek</h1>
        <p className="text-slate-500">150+ Behördenformulare zum automatischen Ausfüllen und Ansehen.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((f, i) => (
          <Card key={i} className="hover:border-blue-500 transition-colors cursor-pointer group rounded-xl border border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {f.category}
                </span>
                <FileText className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <CardTitle className="text-lg text-slate-900">{f.title}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-full text-sm font-medium hover:bg-slate-50"
                onClick={() => generateDummyPDF(f, i)}
                disabled={loadingPdf === i}
              >
                {loadingPdf === i ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-600" />
                ) : (
                  <Eye className="h-4 w-4 mr-2 text-slate-500 group-hover:text-blue-600 transition-colors" /> 
                )}
                Vorschau
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-slate-100 text-slate-500" onClick={() => generateDummyPDF(f, i)}>
                <Download className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <PdfPreviewModal 
        isOpen={previewOpen} 
        onOpenChange={setPreviewOpen} 
        pdfUrl={previewUrl}
        title={previewTitle}
      />
    </div>
  )
}

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, Download, Printer } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  title: string;
}

export function PdfPreviewModal({ isOpen, onOpenChange, pdfUrl, title }: PdfPreviewModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Reset page number when modal opens or url changes
  useEffect(() => {
    if (isOpen) {
      setPageNumber(1);
      setLoading(true);
    }
  }, [isOpen, pdfUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '_')}_Preview.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-100">
        <DialogHeader className="p-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-slate-800">{title}</DialogTitle>
              <DialogDescription>Dokumentenvorschau</DialogDescription>
            </div>
            <div className="flex items-center gap-2 mr-8">
              <Button variant="outline" size="sm" onClick={handleOpenNewTab}>
                <Printer className="w-4 h-4 mr-2" /> Drucken
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Herunterladen
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-slate-100 p-4 flex justify-center items-start">
          {pdfUrl ? (
            <div className="bg-white shadow-xl max-w-full overflow-hidden border border-slate-200">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center p-20 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                }
                error={
                  <div className="p-10 text-red-500 text-center">
                    Fehler beim Laden des PDFs. Bitte versuchen Sie es erneut.
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  width={Math.min(window.innerWidth * 0.8, 800)}
                  className="shadow-sm"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-400">
               Kein Dokument verfügbar
             </div>
          )}
        </div>

        {numPages > 1 && (
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-center gap-4 shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            >
              Vorherige
            </Button>
            <span className="text-sm text-slate-600 font-medium font-mono">
              Seite {pageNumber} von {numPages}
            </span>
            <Button 
              variant="outline"
              size="sm"
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            >
              Nächste
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

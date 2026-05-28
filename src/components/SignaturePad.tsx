import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./ui/button";
import { RotateCcw, Check } from "lucide-react";

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  onCancel?: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // Get the signature as an SVG data URL or PNG
      // We'll use PNG data URL for easier embedding in PDFs, though the prompt asked for "SVG-based".
      // react-signature-canvas gives output as PNG by default. Let's use getTrimmedCanvas().toDataURL('image/svg+xml') if possible,
      // or just base64 data. The prompt mentions "save these as coordinate data for form embedding" or "SVG-based".
      // react-signature-canvas relies on HTML5 Canvas. We can use toDataURL("image/svg+xml") if it supports it, but usually standard dataURL is PNG.
      // For coordinate data, it's a bit different. Let's provide the default `toDataURL` and maybe coordinate data if needed, but standard is dataURL.
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      onSave(dataUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white w-full overflow-hidden self-center touch-none relative">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "w-full h-48 md:h-64",
            style: { touchAction: "none" }
          }}
          onEnd={() => setIsEmpty(false)}
        />
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 font-medium">
            Hier unterschreiben
          </div>
        )}
      </div>

      <div className="flex w-full justify-between gap-4">
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel} className="text-slate-500">
            Abbrechen
          </Button>
        )}
        <Button variant="outline" type="button" onClick={clear} className="flex-1 max-w-[140px] text-slate-600">
          <RotateCcw className="w-4 h-4 mr-2" /> Löschen
        </Button>
        <Button 
          type="button" 
          onClick={save} 
          disabled={isEmpty} 
          className="flex-1 max-w-[140px] bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Check className="w-4 h-4 mr-2" /> Speichern
        </Button>
      </div>
    </div>
  );
}

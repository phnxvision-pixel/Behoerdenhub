import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, GripVertical, Trash2, FileJson, Save, Type, CheckSquare, AlignLeft, Calendar, Download, Eye, Library, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Search } from "lucide-react";
import { get, set } from "idb-keyval";


type FieldType = "text" | "textarea" | "checkbox" | "date" | "label";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
}

const AVAILABLE_FIELDS: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "text", label: "Textfeld", icon: <Type className="w-4 h-4" /> },
  { type: "textarea", label: "Textbereich", icon: <AlignLeft className="w-4 h-4" /> },
  { type: "checkbox", label: "Checkbox", icon: <CheckSquare className="w-4 h-4" /> },
  { type: "date", label: "Datum", icon: <Calendar className="w-4 h-4" /> },
  { type: "label", label: "Überschrift/Text", icon: <Type className="w-4 h-4" /> },
];

const TEMPLATES = [
  {
    name: "Bürgergeld-Erstantrag (HA)",
    category: "Jobcenter",
    fields: [
      { id: "t1_1", type: "text", label: "Vorname", required: true },
      { id: "t1_2", type: "text", label: "Nachname", required: true },
      { id: "t1_3", type: "date", label: "Geburtsdatum", required: true },
      { id: "t1_4", type: "text", label: "Sozialversicherungsnummer", required: false },
      { id: "t1_5", type: "label", label: "Angaben zur Bedarfsgemeinschaft" },
      { id: "t1_6", type: "text", label: "Anzahl weiterer Personen", required: true },
    ] as FormField[]
  },
  {
    name: "Wohnberechtigungsschein (WBS)",
    category: "Wohnen",
    fields: [
      { id: "t2_1", type: "text", label: "Vorname", required: true },
      { id: "t2_2", type: "text", label: "Nachname", required: true },
      { id: "t2_3", type: "textarea", label: "Aktuelle Anschrift", required: true },
      { id: "t2_4", type: "text", label: "Jährliches Bruttoeinkommen", required: true },
      { id: "t2_5", type: "checkbox", label: "Besonderer Wohnbedarf (z.B. Schwerbehinderung)" },
    ] as FormField[]
  }
];

export default function FormBuilderPage() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formName, setFormName] = useState("Neues Formular");
  const [activeTab, setActiveTab] = useState("builder");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [customTemplates, setCustomTemplates] = useState<{name: string, category: string, fields: FormField[]}[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadFromIndexedDB = async () => {
      try {
        // Load templates
        try {
          const doc: any = await get("custom_templates");
          if (doc && doc.templates) {
            setCustomTemplates(doc.templates);
          }
        } catch (err: any) {
           console.error("Error loading templates", err);
        }

        // Load draft
        try {
          const draft: any = await get("form_builder_draft");
          if (draft && draft.fields && draft.fields.length > 0) {
            setFields(draft.fields);
            setFormName(draft.name || "Neues Formular");
          }
        } catch (err: any) {
           console.error("Error loading draft", err);
        }
      } catch (e) {
        console.error("IDB load error", e);
      }
      setIsLoaded(true);
    };

    loadFromIndexedDB();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveDraft = async () => {
        try {
          await set("form_builder_draft", {
            name: formName,
            fields
          });
        } catch (e) {
          console.error("Save draft error", e);
        }
      };
      
      const timeout = setTimeout(saveDraft, 1000);
      return () => clearTimeout(timeout);
    }
  }, [formName, fields, isLoaded]);

  const syncWithSupabase = async () => {
    if (!isOnline) {
      toast.error("Keine Internetverbindung für die Synchronisation mit Supabase.");
      return;
    }
    
    setIsSyncing(true);
    toast.info("Synchronisiere Daten mit Supabase...");
    
    // Simulate network delay and Supabase API call
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Erfolgreich mit Supabase synchronisiert!");
    }, 1500);
  };

  const allTemplates = [...TEMPLATES, ...customTemplates];
  const filteredTemplates = allTemplates.filter(t => 
    t.name.toLowerCase().includes(templateSearch.toLowerCase()) || 
    t.category.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceDroppable = result.source.droppableId;
    const destDroppable = result.destination.droppableId;

    if (sourceDroppable === "toolbox" && destDroppable === "form-area") {
      // Add new field
      const fieldType = AVAILABLE_FIELDS[sourceIndex].type;
      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: fieldType,
        label: `Neues ${AVAILABLE_FIELDS[sourceIndex].label}`,
      };
      
      const newFields = Array.from(fields);
      newFields.splice(destinationIndex, 0, newField);
      setFields(newFields);
    } else if (sourceDroppable === "form-area" && destDroppable === "form-area") {
      // Reorder fields
      const newFields = Array.from(fields);
      const [reorderedItem] = newFields.splice(sourceIndex, 1);
      newFields.splice(destinationIndex, 0, reorderedItem);
      setFields(newFields);
    }
  };

  const addFieldDirectly = (type: FieldType) => {
    const defaultLabel = AVAILABLE_FIELDS.find(f => f.type === type)?.label || "Feld";
    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: type,
      label: `Neues ${defaultLabel}`,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = async () => {
    const schema = {
      name: formName,
      category: "Eigene Formulare",
      fields: fields
    };
    
    // In local custom templates speichern
    const updatedCustoms = customTemplates.filter(t => t.name !== formName);
    updatedCustoms.push(schema);
    
    setCustomTemplates(updatedCustoms);
    
    try {
      await set("custom_templates", {
        templates: updatedCustoms
      });
      
      toast.success("Formular erfolgreich gespeichert (offline verfügbar)");
      
      if (isOnline) {
        syncWithSupabase();
      }
    } catch (e) {
      console.error("Save template error", e);
      toast.error("Fehler beim Speichern des Formulars");
    }
  };

  const handleExportPDF = () => {
    if (fields.length === 0) {
      toast.error("Das Formular hat keine Felder.");
      return;
    }

    const doc = new jsPDF();
    let currentY = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(formName, 20, currentY);
    currentY += 15;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generiert: ${new Date().toLocaleDateString('de-DE')}`, 20, currentY);
    currentY += 15;

    // Fields
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // slate-700

    fields.forEach((field, index) => {
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${field.label}${field.required ? ' *' : ''}`, 20, currentY);
      currentY += 7;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184); // slate-400

      if (field.type === "text" || field.type === "date") {
        doc.setDrawColor(203, 213, 225);
        doc.rect(20, currentY, 170, 10, 'S');
        if (field.placeholder) {
          doc.text(field.placeholder, 23, currentY + 7);
        }
        currentY += 15;
      } else if (field.type === "textarea") {
        doc.setDrawColor(203, 213, 225);
        doc.rect(20, currentY, 170, 30, 'S');
        if (field.placeholder) {
           doc.text(field.placeholder, 23, currentY + 7);
        }
        currentY += 35;
      } else if (field.type === "checkbox") {
        doc.setDrawColor(203, 213, 225);
        doc.rect(20, currentY, 5, 5, 'S');
        currentY += 10;
      } else if (field.type === "label") {
         currentY += 5;
      }

      doc.setTextColor(51, 65, 85);
      currentY += 5;
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const handleExportJSON = () => {
    const schema = {
      name: formName,
      fields: fields
    };
    const jsonString = JSON.stringify(schema, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formName.toLowerCase().replace(/\\s+/g, '_')}_schema.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Formular-Builder</h2>
            {isOnline ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                <Wifi className="w-3.5 h-3.5" /> Online
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <WifiOff className="w-3.5 h-3.5" /> Offline Modus
              </div>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              className={`h-6 text-xs px-2 rounded-full border-slate-200 text-slate-600 transition-colors ${isSyncing ? "opacity-70" : "hover:bg-slate-100"}`}
              onClick={syncWithSupabase}
              disabled={isSyncing || !isOnline}
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} /> 
              {isSyncing ? "Sync..." : "Sync manuell"}
            </Button>
          </div>
          <p className="text-slate-500">Erstelle eigene Formulare und exportiere das JSON-Schema für die PDF-Generierung.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)} className="text-slate-600 bg-white hover:bg-slate-50">
            <Library className="w-4 h-4 mr-2" /> Vorlagen
          </Button>
          <Button variant="outline" onClick={() => setActiveTab(activeTab === "preview" ? "builder" : "preview")}>
            {activeTab === "preview" ? "Zum Builder" : <><Eye className="w-4 h-4 mr-2" /> Vorschau</>}
          </Button>
          <Button variant="outline" onClick={() => setActiveTab(activeTab === "json" ? "builder" : "json")}>
            {activeTab === "json" ? "Zum Builder" : <><FileJson className="w-4 h-4 mr-2" /> JSON ansehen</>}
          </Button>
          <Button variant="outline" onClick={handleExportJSON} className="text-slate-600 bg-white hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" /> JSON Export
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="text-slate-600 bg-white hover:bg-slate-50">
            <Download className="w-4 h-4 mr-2" /> Test PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Speichern
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Label htmlFor="formName" className="whitespace-nowrap font-medium">Formular Name:</Label>
        <Input 
          id="formName" 
          value={formName} 
          onChange={(e) => setFormName(e.target.value)} 
          className="max-w-md font-medium text-lg"
        />
      </div>

      {activeTab === "preview" ? (
        <Card className="flex-1 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>{formName}</CardTitle>
            <CardDescription>Vorschauansicht des generierten Formulars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm mx-auto">
              {fields.length === 0 ? (
                <div className="text-center text-slate-500 py-10">Keine Felder vorhanden.</div>
              ) : (
                fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    {field.type === "label" ? (
                      <h3 className="text-lg font-semibold text-slate-900 mt-6">{field.label}</h3>
                    ) : (
                      <Label className="text-sm font-medium text-slate-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                    )}
                    
                    {field.type === "text" && (
                      <Input placeholder={field.placeholder || ""} />
                    )}
                    {field.type === "textarea" && (
                      <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={field.placeholder || ""}
                      />
                    )}
                    {field.type === "date" && (
                      <Input type="date" placeholder={field.placeholder || ""} />
                    )}
                    {field.type === "checkbox" && (
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-slate-600">Option auswählen</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ) : activeTab === "json" ? (
        <Card className="flex-1 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>JSON Schema Definition</CardTitle>
            <CardDescription>Dieses Schema kann für die PDF-Automatisierung genutzt werden.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-950 text-slate-50 p-6 rounded-lg overflow-auto text-sm font-mono h-[500px]">
              {JSON.stringify({
                name: formName,
                fields: fields
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 items-start">
            {/* Toolbox */}
            <Card className="w-64 shrink-0 shadow-sm border-slate-200 sticky top-6">
              <CardHeader className="p-4 border-b border-slate-100">
                <CardTitle className="text-base font-semibold text-slate-800">Werkzeuge</CardTitle>
                <CardDescription className="text-xs">Ziehe Felder in das Formular</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Droppable droppableId="toolbox" isDropDisabled={true}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
                    >
                      {AVAILABLE_FIELDS.map((field, index) => (
                        <Draggable key={`tool-${field.type}`} draggableId={`tool-${field.type}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-3 p-3 border rounded-lg bg-white cursor-grab active:cursor-grabbing transition-colors ${
                                snapshot.isDragging ? "shadow-lg border-blue-500 ring-1 ring-blue-200" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                              }`}
                              onClick={() => addFieldDirectly(field.type)}
                            >
                              <div className="text-slate-500">{field.icon}</div>
                              <span className="text-sm font-medium text-slate-700">{field.label}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            {/* Form Canvas */}
            <Card className="flex-1 shadow-sm border-slate-200 min-h-[600px] bg-slate-50 relative">
              <Droppable droppableId="form-area">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-6 min-h-[600px] rounded-xl transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50/50 outline outline-2 outline-blue-200 outline-dashed" : ""
                    }`}
                  >
                    {fields.length === 0 ? (
                      <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl m-4 bg-white/50">
                        <Plus className="w-12 h-12 mb-4 text-slate-300" />
                        <p className="text-lg font-medium text-slate-500">Ziehe Elemente hierher</p>
                        <p className="text-sm mt-1">oder klicke auf ein Werkzeug in der Seitenleiste</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
                        <h1 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-4">{formName}</h1>
                        {fields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`group flex gap-4 p-4 border rounded-xl bg-white transition-all ${
                                  snapshot.isDragging ? "shadow-xl border-blue-500 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                }`}
                              >
                                <div 
                                  {...provided.dragHandleProps}
                                  className="mt-1 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500 transition-colors"
                                >
                                  <GripVertical className="w-5 h-5" />
                                </div>
                                
                                <div className="flex-1 space-y-4">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 space-y-1.5">
                                      <Label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Feld-Label</Label>
                                      <Input 
                                        value={field.label}
                                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                                        className="font-medium bg-slate-50 hover:bg-white focus:bg-white transition-colors"
                                      />
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => removeField(field.id)}
                                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  {(field.type === "text" || field.type === "textarea") && (
                                    <div className="space-y-1.5">
                                      <Label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Platzhalter</Label>
                                      <Input 
                                        value={field.placeholder || ""}
                                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                        className="text-sm bg-slate-50 hover:bg-white focus:bg-white transition-colors"
                                        placeholder="Optionaler Hilfstext..."
                                      />
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit">
                                    <input 
                                      type="checkbox" 
                                      id={`req-${field.id}`}
                                      checked={field.required || false}
                                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Label htmlFor={`req-${field.id}`} className="text-sm cursor-pointer text-slate-600">Pflichtfeld</Label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>
        </DragDropContext>
      )}

      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Formular-Vorlagen</DialogTitle>
            <DialogDescription>Wähle eine vordefinierte Vorlage aus, um sie in den Builder zu laden.</DialogDescription>
          </DialogHeader>
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <Input 
              type="text" 
              placeholder="Suchen nach Name oder Kategorie..." 
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Keine Vorlagen gefunden.
              </div>
            ) : (
              filteredTemplates.map((template, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors" 
                  onClick={() => {
                    setFormName(template.name);
                    setFields(template.fields.map(f => ({
                      ...f, 
                      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
                    })));
                    setIsTemplateModalOpen(false);
                    setActiveTab("builder");
                    toast.success(`Vorlage "${template.name}" geladen`);
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {template.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800">{template.name}</h4>
                    <p className="text-sm text-slate-500">{template.fields.length} Felder</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600">Laden</Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

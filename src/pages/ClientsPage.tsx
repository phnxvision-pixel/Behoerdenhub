import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MoreHorizontal } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Klienten</h1>
          <p className="text-slate-500">Verwalte alle Personen, Mandanten und Familien.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <Plus className="w-5 h-5 mr-2" /> Neuer Klient
        </Button>
      </div>

      <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
             <div className="relative w-72">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
               <input 
                 placeholder="Name oder Kundennummer suchen..." 
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-md text-sm outline-none focus:ring-2 focus:ring-brand-500"
               />
             </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stammdaten</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hinzugefügt</TableHead>
                <TableHead className="text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="font-medium text-slate-900">Max Mustermann {i}</div>
                    <div className="text-sm text-slate-500">ID: KND-{1000 + i}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">max.m@beispiel.de</div>
                    <div className="text-sm text-slate-500">+49 170 123456</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                      Aktiv
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">12.05.2026</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

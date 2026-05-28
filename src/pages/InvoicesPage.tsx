import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rechnungen</h1>
           <p className="text-slate-500">Kundenrechnungen und Bar-Quittungen verwalten.</p>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700">
          <Plus className="w-5 h-5 mr-2" /> Neue Rechnung
        </Button>
      </div>

      <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rechnungs-Nr.</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">RE-2026-{100 + i}</TableCell>
                  <TableCell>Max Mustermann {i}</TableCell>
                  <TableCell className="text-slate-500">12.05.2026</TableCell>
                  <TableCell>€ 49.00</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                      Bezahlt (Bar)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4 text-slate-500" />
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

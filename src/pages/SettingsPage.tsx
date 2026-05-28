import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationProfile } from "@clerk/clerk-react";
import { CreditCard, Shield, Building } from "lucide-react";

export default function SettingsPage() {
  const handleUpgrade = async (priceId: string) => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          tenantId: "t_placeholder", // Typically from Clerk useOrganization
          returnUrl: window.location.href,
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
      alert("Billing Server nicht erreichbar.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Einstellungen</h1>
        <p className="text-slate-500">Agenturprofil, Abrechnung und DSGVO-Optionen.</p>
      </div>

      <Tabs defaultValue="agency">
        <TabsList className="mb-4">
          <TabsTrigger value="agency"><Building className="w-4 h-4 mr-2" /> Agentur (Tenant)</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="w-4 h-4 mr-2" /> Abrechnung (Stripe)</TabsTrigger>
          <TabsTrigger value="privacy"><Shield className="w-4 h-4 mr-2" /> DSGVO & Rechtliches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agency">
           <Card className="rounded-xl border border-slate-200 shadow-sm">
             <CardContent className="pt-6">
               <OrganizationProfile />
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="col-span-1 rounded-xl border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Für Einzelunternehmer</CardDescription>
                <div className="text-3xl font-bold mt-4">49€<span className="text-sm text-slate-500 font-normal">/mo</span></div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" onClick={() => handleUpgrade('price_starter')}>Upgrade</Button>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 rounded-xl border border-brand-500 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">PRO</div>
              <CardHeader>
                <CardTitle>Pro Agency</CardTitle>
                <CardDescription>Bis zu 5 Mitarbeiter</CardDescription>
                <div className="text-3xl font-bold mt-4 text-brand-600">99€<span className="text-sm text-slate-500 font-normal">/mo</span></div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white" onClick={() => handleUpgrade('price_pro')}>Upgrade to Pro</Button>
              </CardContent>
            </Card>
            
             <Card className="col-span-1 rounded-xl border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Unbegrenzte Nutzer & White-Label</CardDescription>
                <div className="text-3xl font-bold mt-4">399€<span className="text-sm text-slate-500 font-normal">/mo</span></div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" onClick={() => handleUpgrade('price_enterprise')}>Kontaktieren</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy">
           <Card className="rounded-xl border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>DSGVO Dokumente generieren</CardTitle>
              <CardDescription>Aktivieren Sie diese Optionen, um automatisch AV-Verträge zu unterzeichnen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <Label>Datenschutzbeauftragter</Label>
                  <Input placeholder="Name des externen DSB (Optional)" className="mt-1" />
               </div>
               <Button className="mt-4" variant="outline">
                 <Shield className="w-4 h-4 mr-2" /> AV-Vertrag als PDF exportieren
               </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

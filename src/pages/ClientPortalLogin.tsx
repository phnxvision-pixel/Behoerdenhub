import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

export default function ClientPortalLogin() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">BehördenHub Pro</h1>
        <p className="text-sm text-slate-500">Klienten-Portal Login</p>
      </div>

      <Card className="w-full max-w-md rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Zugangscode eingeben</CardTitle>
          <CardDescription>
            Melden Sie sich mit dem Zugangscode an, den Sie von Ihrer Agentur erhalten haben.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ihr 6-stelliger Zugangscode</Label>
            <Input 
              placeholder="z.B. AX-8291" 
              className="text-center tracking-widest font-mono text-lg"
            />
          </div>
          
          <Link to="/portal/DEMO-CLIENT-123" className="block mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11">
              Zum Portal &rarr;
            </Button>
          </Link>

          <p className="text-xs text-center text-slate-500 mt-6">
            Dieses Portal wird betrieben von <br/>
            <strong>Sozialberatung Berlin-Mitte (Demo)</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

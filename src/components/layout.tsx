import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Building2, 
  Users, 
  FileText, 
  Scan, 
  Settings, 
  FileSpreadsheet,
  Menu,
  Receipt,
  LogOut
} from "lucide-react";
import { useAuth, UserButton, OrganizationSwitcher } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Building2 },
  { name: "Klienten", href: "/clients", icon: Users },
  { name: "Dokumenten-Scan", href: "/scan", icon: Scan },
  { name: "Formulare", href: "/forms", icon: FileText },
  { name: "Form-Builder", href: "/form-builder", icon: FileSpreadsheet },
  { name: "Rechnungen", href: "/invoices", icon: Receipt },
  { name: "Einstellungen", href: "/settings", icon: Settings },
];

export function DashboardLayout() {
  const { pathname } = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  
  if (isLoaded && !isSignedIn) {
    // If we've reached a protected route but aren't signed in, it usually handles itself via Clerk.
    // In our App.tsx we'll wrap protected routes.
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">BehördenHub <span className="text-blue-500 text-xs font-medium uppercase border border-blue-500 px-1 rounded">Pro</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? "bg-slate-900 text-white" 
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-sm">
           <OrganizationSwitcher 
             hidePersonal
             appearance={{
               elements: {
                 organizationSwitcherTrigger: "w-full justify-between items-center text-white bg-slate-900 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors",
                 organizationSwitcherTriggerIcon: "text-slate-400",
                 organizationPreviewTextContainer: "text-white",
               }
             }}
           />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex flex-col hidden md:flex">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aktueller Mandant</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">Sozialberatung Berlin-Mitte</span>
              </div>
            </div>
            <div className="md:hidden flex items-center font-bold text-slate-800">
              <Building2 className="w-5 h-5 mr-2" />
              BehördenHub Pro
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 text-xs font-medium border border-slate-200">
              <span className="text-slate-800 cursor-pointer">DE</span>
              <div className="w-px h-3 bg-slate-300"></div>
              <span className="text-slate-400 cursor-pointer hover:text-slate-600">EN</span>
              <span className="text-slate-400 cursor-pointer hover:text-slate-600">TR</span>
              <span className="text-slate-400 cursor-pointer hover:text-slate-600">AR</span>
            </div>
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">Profil</p>
                <p className="text-xs text-slate-500">Agentur-Konto</p>
              </div>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-slate-100" } }} />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto bg-slate-50">
          <main className="p-8 pb-16">
            <Outlet />
          </main>
          
          <footer className="px-8 py-3 bg-white border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
            <div className="flex gap-4">
              <span>Impressum</span>
              <span>Datenschutz</span>
              <span>AV-Vertrag</span>
              <span>Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Cloud-Region: Deutschland (Frankfurt) — DSGVO Konform</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

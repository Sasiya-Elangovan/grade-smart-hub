
import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();

  const NavLinks = () => (
    <>
      <Link to="/dashboard" className="font-medium hover:text-primary transition-colors">
        Dashboard
      </Link>
      <Link to="/assessments" className="font-medium hover:text-primary transition-colors">
        Assignments
      </Link>
      <Link to="/analytics" className="font-medium hover:text-primary transition-colors">
        Analytics
      </Link>
    </>
  );

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {!isMobile && toggleSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">GradeSmartAI</span>
          </Link>
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-6">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        )}
        
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" onClick={() => signOut()} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

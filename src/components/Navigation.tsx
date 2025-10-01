import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  FileText,
  Share2,
  BarChart3,
  LogOut,
  Menu,
  X,
  UserCheck,
  Search,
  Settings
} from 'lucide-react';
import { useMediKey } from '@/contexts/MediKeyContext';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { state, dispatch } = useMediKey();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
  };

  const patientMenuItems = [
    { id: 'profile', label: 'Profile', icon: Shield },
    { id: 'upload', label: 'Upload Records', icon: FileText },
    { id: 'records', label: 'My Records', icon: FileText },
    { id: 'share', label: 'Share Access', icon: Share2 },
    { id: 'history', label: 'History', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const clinicianMenuItems = [
    { id: 'profile', label: 'Profile', icon: Shield },
    { id: 'request', label: 'Request Access', icon: Search },
    { id: 'records', label: 'Patient Records', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = state.currentUser?.role === 'patient' ? patientMenuItems : clinicianMenuItems;

  const NavContent = () => (
    <>
      <div className="flex items-center space-x-4 mb-10">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg"></div>
          <div className="relative p-3 bg-primary rounded-xl">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h2 className="font-bold text-xl text-gradient">MediKey</h2>
          <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            {state.currentUser?.role === 'patient' ? 'Patient Portal' : 'Clinician Portal'}
          </p>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-12 rounded-xl transition-all duration-200 font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'hover:bg-muted/50'
              )}
              onClick={() => {
                onViewChange(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </div>

      <div className="border-t border-border/50 pt-6 space-y-4 mt-auto">
        <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
          {state.currentUser?.name && (
            <>
              <p className="text-xs font-medium text-muted-foreground mb-1">Account</p>
              <p className="text-sm font-bold mb-3">{state.currentUser.name}</p>
            </>
          )}
          <p className="text-xs font-medium text-muted-foreground mb-2">Your Key ID</p>
          <p className="text-xs font-mono break-all text-muted-foreground bg-background/50 p-2 rounded-lg">
            {state.currentUser?.publicKey?.substring(0, 20)}...
          </p>
          <Badge variant="secondary" className="mt-3 text-xs font-medium">
            {state.currentUser?.role}
          </Badge>
        </div>

        <Button
          variant="outline"
          className="w-full h-11 rounded-xl border-border/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="h-10 w-10 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-xl',
        'transform transition-transform duration-200 ease-in-out',
        'lg:transform-none',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full p-8 pb-6">
          <NavContent />
        </div>
      </div>
    </>
  );
}
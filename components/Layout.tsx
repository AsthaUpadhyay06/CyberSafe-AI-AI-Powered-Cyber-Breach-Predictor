import React from 'react';
import { LayoutDashboard, FileText, ShieldAlert, UploadCloud, Menu, X } from 'lucide-react';
import { TabView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'upload' as TabView, label: 'Upload Data', icon: UploadCloud },
    { id: 'dashboard' as TabView, label: 'Risk Dashboard', icon: LayoutDashboard },
    { id: 'actions' as TabView, label: 'Suggested Actions', icon: ShieldAlert },
    { id: 'reports' as TabView, label: 'Reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-cyber-900 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-cyber-800 border-r border-cyber-700">
        <div className="p-6 flex items-center space-x-2 border-b border-cyber-700">
          <div className="w-8 h-8 bg-cyber-accent rounded-md flex items-center justify-center">
            <ShieldAlert className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-wider">CyberSafe AI</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20'
                  : 'text-gray-400 hover:bg-cyber-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-cyber-700">
          <div className="text-xs text-gray-500 text-center">
            v1.0.0 | Secure Connection
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 w-full bg-cyber-800 border-b border-cyber-700 z-50 flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
            <ShieldAlert className="text-cyber-accent w-6 h-6" />
            <span className="font-bold text-white">CyberSafe AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-cyber-800 z-40 border-b border-cyber-700">
            <nav className="p-4 space-y-2">
            {navItems.map((item) => (
                <button
                key={item.id}
                onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    activeTab === item.id
                    ? 'bg-cyber-accent/10 text-cyber-accent'
                    : 'text-gray-400'
                }`}
                >
                <item.icon size={20} />
                <span>{item.label}</span>
                </button>
            ))}
            </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative p-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
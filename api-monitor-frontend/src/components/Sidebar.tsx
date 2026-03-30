import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Activity, AlertTriangle, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
        { icon: Activity, label: 'Monitors', to: '/monitors' },
        { icon: AlertTriangle, label: 'Incidents', to: '/incidents' },
    ];


    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-40 transform md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col h-screen w-64 bg-gray-900 text-gray-100 border-r border-gray-800",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between gap-3 hover:bg-gray-800/50 transition-colors">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <img src="/logo.svg" alt="API Pulse" className="w-8 h-8" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        API Pulse
                    </h1>
                </Link>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

        </div>
    );
};

export default Sidebar;

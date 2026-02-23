import { Globe, Clock, CheckCircle, XCircle, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Monitor {
    id: string;
    name: string;
    url: string;
    status: 'UP' | 'DOWN';
    isActive: boolean;
    lastChecked: string;
    latency: number;
}

interface MonitorCardProps {
    monitor: Monitor;
    onEdit: (monitor: Monitor) => void;
    onDelete: (id: string) => void;
}

const MonitorCard: React.FC<MonitorCardProps> = ({ monitor, onEdit, onDelete }) => {
    return (
        <div className={`bg-gray-900 rounded-xl p-6 border shadow-lg transition-all duration-300 relative group ${monitor.isActive ? 'border-gray-800 hover:border-indigo-500/30' : 'border-gray-800 opacity-60'}`}>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit(monitor);
                    }}
                    className="text-gray-600 hover:text-indigo-400 transition-colors"
                    title="Edit Monitor"
                >
                    <Pencil className="w-5 h-5" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (confirm('Are you sure you want to delete this monitor?')) onDelete(monitor.id);
                    }}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                    title="Delete Monitor"
                >
                    <XCircle className="w-5 h-5" />
                </button>
            </div>

            <Link to={`/monitors/${monitor.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-800 rounded-lg">
                            <Globe className={`w-5 h-5 ${monitor.isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-100 hover:text-indigo-400 transition-colors">{monitor.name}</h3>
                            <span className="text-xs text-blue-400 hover:underline truncate max-w-[150px] block">
                                {monitor.url}
                            </span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${!monitor.isActive
                        ? 'bg-gray-700 text-gray-400'
                        : monitor.status === 'UP'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                        {!monitor.isActive ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-gray-400" />
                                <span>PAUSED</span>
                            </>
                        ) : (
                            <>
                                {monitor.status === 'UP' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                <span>{monitor.status}</span>
                            </>
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{monitor.lastChecked || 'Pending'}</span>
                    </div>
                    <div className="font-mono text-xs">
                        {monitor.latency !== null ? `${monitor.latency}ms` : '-'}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MonitorCard;

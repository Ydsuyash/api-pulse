import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Activity, AlertTriangle, RefreshCcw } from 'lucide-react';
import { getPublicStatus } from '../services/api';

const StatusPage = () => {
    const [statusData, setStatusData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const { data } = await getPublicStatus();
            setStatusData(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch status', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Auto-refresh every 60s
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Operational': return 'bg-green-500';
            case 'Partial Outage': return 'bg-yellow-500';
            case 'Major Outage': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Activity className="w-8 h-8 text-indigo-500" />
                            <h1 className="text-2xl font-bold tracking-tight">System Status</h1>
                        </div>
                        {statusData && (
                            <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(statusData.systemStatus)} bg-opacity-10 border border-opacity-20 border-${getStatusColor(statusData.systemStatus).replace('bg-', '')}-500`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(statusData.systemStatus)}`}></span>
                                <span className={`font-medium ${getStatusColor(statusData.systemStatus).replace('bg-', 'text-')}-400`}>
                                    {statusData.systemStatus}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
                {/* Active Monitors */}
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-semibold text-gray-200">Current Status by Service</h2>
                        <button onClick={fetchStatus} className="text-sm text-gray-500 hover:text-gray-300 flex items-center space-x-1 transition-colors">
                            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            <span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Refresh'}</span>
                        </button>
                    </div>

                    {loading && !statusData ? (
                        <div className="py-12 text-center text-gray-500">Loading system status...</div>
                    ) : (
                        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden divide-y divide-gray-800">
                            {statusData?.monitors.map((monitor: any) => (
                                <div key={monitor.id} className="p-4 flex justify-between items-center hover:bg-gray-800/50 transition-colors">
                                    <div>
                                        <h3 className="font-medium text-gray-200">{monitor.name}</h3>
                                        {/* <p className="text-xs text-gray-500 mt-0.5">{monitor.url}</p> */}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {monitor.status === 'UP' ? (
                                            <>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span className="text-sm font-medium text-green-500">Operational</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-5 h-5 text-red-500" />
                                                <span className="text-sm font-medium text-red-500">Outage</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Incidents */}
                {statusData?.recentIncidents.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Past Incidents</h2>
                        <div className="space-y-4">
                            {statusData.recentIncidents.map((incident: any) => (
                                <div key={incident.id} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <AlertTriangle className={`w-5 h-5 ${incident.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'}`} />
                                                <h3 className="font-bold text-gray-200">{incident.monitor.name} Issue</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${incident.status === 'Resolved' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                                                    {incident.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3">
                                                {incident.description || 'No description provided.'}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(incident.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {incident.resolvedAt && (
                                        <div className="text-xs text-gray-500 mt-2 pl-7 border-l-2 border-gray-800">
                                            Resolved after {Math.round((new Date(incident.resolvedAt).getTime() - new Date(incident.createdAt).getTime()) / 60000)} minutes
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="text-center pt-8 border-t border-gray-900">
                    <p className="text-gray-600 text-sm">Powered by API Pulse</p>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;

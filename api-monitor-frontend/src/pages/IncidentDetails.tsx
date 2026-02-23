import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIncident, acknowledgeIncident } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, AlertTriangle, Shield, CheckCircle, XCircle, Activity, Clock } from 'lucide-react';

const IncidentDetails = () => {
    const { id } = useParams();
    const [incident, setIncident] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchIncident();
    }, [id]);

    const fetchIncident = async () => {
        try {
            const { data } = await getIncident(id!);
            setIncident(data);
        } catch (error) {
            toast.error('Failed to load incident details');
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async () => {
        if (!incident) return;
        setActionLoading(true);
        try {
            const { data } = await acknowledgeIncident(incident.id);
            setIncident((prev: any) => (prev ? { ...prev, status: data.status } : data));
            toast.success('Incident acknowledged');
        } catch (error) {
            toast.error('Failed to acknowledge incident');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-400">Loading details...</div>;
    if (!incident) return <div className="text-center py-10 text-gray-400">Incident not found</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Acknowledged': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const getUptimeColor = (percentage: number) => {
        if (percentage >= 99) return 'text-green-400';
        if (percentage >= 95) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-6">
            <Link to="/incidents" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Incidents
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                        Incident #{incident.id.substring(0, 8)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(incident.status)}`}>
                            {incident.status}
                        </span>
                    </h1>
                    <p className="text-gray-400 mt-2">Monitor: <span className="text-indigo-400">{incident.monitor?.name} ({incident.monitor?.url})</span></p>
                </div>

                {incident.status === 'Open' && (
                    <button
                        onClick={handleAcknowledge}
                        disabled={actionLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Shield className="w-4 h-4" />
                        {actionLoading ? 'Processing...' : 'Acknowledge'}
                    </button>
                )}
            </div>

            {/* Uptime Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Uptime (24h)</h3>
                    <div className={`text-3xl font-bold ${getUptimeColor(incident.history?.uptime24h || 0)}`}>
                        {incident.history?.uptime24h || 0}%
                    </div>
                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Uptime (7d)</h3>
                    <div className={`text-3xl font-bold ${getUptimeColor(incident.history?.uptime7d || 0)}`}>
                        {incident.history?.uptime7d || 0}%
                    </div>
                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Checks (24h)</h3>
                    <div className="text-3xl font-bold text-gray-200">
                        {incident.history?.totalChecks24h || 0}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-200">Incident Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-400">Severity</span>
                                <span className="text-red-400 font-medium flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" /> {incident.severity}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-400">Type</span>
                                <span className="text-gray-200">{incident.type}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span className="text-gray-400">Created At</span>
                                <span className="text-gray-200">{new Date(incident.createdAt).toLocaleString()}</span>
                            </div>
                            {incident.resolvedAt && (
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Resolved At</span>
                                    <span className="text-green-400">{new Date(incident.resolvedAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Description</h3>
                        <div className="bg-gray-950 p-4 rounded-lg font-mono text-sm text-red-300 border border-red-900/30 break-words">
                            {incident.description}
                        </div>
                    </div>
                </div>

                {/* Recent Checks Column */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-400" />
                                Recent Checks
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-800/50 text-gray-400 text-sm">
                                        <th className="px-6 py-3 font-medium">Time</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Latency</th>
                                        <th className="px-6 py-3 font-medium">Code</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {incident.history?.last10Checks?.map((check: any) => (
                                        <tr key={check.id} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {new Date(check.createdAt).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${check.status === 'UP'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {check.status === 'UP' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                                    {check.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300 flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-gray-500" />
                                                {check.latency}ms
                                            </td>
                                            <td className="px-6 py-4 text-sm text-mono text-gray-400">
                                                {check.statusCode || '-'}
                                            </td>
                                        </tr>
                                    )) || (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                    No check history available.
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncidentDetails;

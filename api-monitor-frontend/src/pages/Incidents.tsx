import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock } from 'lucide-react';
import { getIncidents } from '../services/api';
import toast from 'react-hot-toast';

const Incidents = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const { data } = await getIncidents();
                setIncidents(data);
            } catch (error) {
                console.error('Failed to fetch incidents', error);
                toast.error('Failed to load incidents');
            } finally {
                setLoading(false);
            }
        };

        fetchIncidents();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-400 py-10">Loading incidents...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Incidents</h1>
                    <p className="text-gray-400">Track and resolve infrastructure alerts.</p>
                </div>
                {/* Filter button - future implementation */}
                {/* <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors border border-gray-700">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button> */}
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-sm">
                                <th className="px-6 py-4 font-medium">Incident ID</th>
                                <th className="px-6 py-4 font-medium">Monitor</th>
                                <th className="px-6 py-4 font-medium">Severity</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Created At</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {incidents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        No incidents found.
                                    </td>
                                </tr>
                            ) : (
                                incidents.map((incident: any) => (
                                    <tr key={incident.id} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Link to={`/incidents/${incident.id}`} className="font-mono text-gray-300 text-sm hover:text-indigo-400 hover:underline transition-colors">
                                                    {incident.id.substring(0, 8)}
                                                </Link>
                                            </div>
                                            {/* <div className="text-xs text-gray-500 mt-1">{incident.description}</div> */}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-medium">{incident.monitor?.name || 'Unknown Monitor'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${incident.type === 'DOWN'
                                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {incident.type === 'DOWN' ? <AlertTriangle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                {incident.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!incident.resolvedAt
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'bg-green-500/10 text-green-400'
                                                }`}>
                                                {!incident.resolvedAt ? 'Open' : 'Resolved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(incident.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/incidents/${incident.id}`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Incidents;

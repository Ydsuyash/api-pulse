import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { getMonitor } from '../services/api';
import LineChartCard from '../components/LineChartCard';
import toast from 'react-hot-toast';

const MonitorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [monitor, setMonitor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonitor = async () => {
            try {
                if (id) {
                    const { data } = await getMonitor(id);
                    setMonitor(data);
                }
            } catch (error) {
                console.error('Failed to fetch monitor details', error);
                toast.error('Failed to load monitor details');
            } finally {
                setLoading(false);
            }
        };

        fetchMonitor();
    }, [id]);

    if (loading) {
        return <div className="text-gray-400 p-6">Loading monitor details...</div>;
    }

    if (!monitor) {
        return <div className="text-gray-400 p-6">Monitor not found.</div>;
    }

    // Mock history data for chart until backend implements history endpoint
    const responseTimeData = [
        { name: '12:00', value: 120 },
        { name: '12:05', value: 132 },
        { name: '12:10', value: 101 },
        { name: '12:15', value: 134 },
        { name: '12:20', value: 90 },
        { name: '12:25', value: 230 },
        { name: '12:30', value: 150 },
    ];

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/monitors')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Monitors
            </button>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-800 rounded-xl">
                            <Globe className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-100">{monitor.name}</h1>
                            <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                {monitor.url}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${monitor.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                            {monitor.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            <span>{monitor.isActive ? 'Active' : 'Paused'}</span>
                        </span>
                        <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300 flex items-center space-x-2 border border-gray-700">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{monitor.interval} interval</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-800">
                    <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">Status</div>
                        <div className="text-lg font-semibold text-gray-200">
                            {monitor.status || 'Unknown'}
                        </div>
                    </div>
                    <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">Last Checked</div>
                        <div className="text-lg font-semibold text-gray-200">
                            {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleString() : 'Never'}
                        </div>
                    </div>
                    <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">Recent Latency</div>
                        <div className="text-lg font-semibold text-gray-200 flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-indigo-400" />
                            {monitor.latency ? `${monitor.latency}ms` : '-'}
                        </div>
                    </div>
                </div>
            </div>

            <LineChartCard title="Response Time (Last Hour)" data={responseTimeData} color="#818cf8" />

            {/* Future: Add Incident History Table Here */}
        </div>
    );
};

export default MonitorDetails;

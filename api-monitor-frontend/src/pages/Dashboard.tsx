import { useEffect, useState } from 'react';
import { Activity, Server, AlertTriangle, Zap } from 'lucide-react';
import StatCard from '../components/StatCard';
import LineChartCard from '../components/LineChartCard';
import { getDashboardStats } from '../services/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMonitors: 0,
        activeIncidents: 0,
        uptime: '0%',
        avgLatency: '0ms'
    });
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();

    // Mock chart data for now as backend might not have history endpoints yet
    const chartData = [
        { name: 'Mon', value: 45 },
        { name: 'Tue', value: 52 },
        { name: 'Wed', value: 49 },
        { name: 'Thu', value: 46 },
        { name: 'Fri', value: 58 },
        { name: 'Sat', value: 42 },
        { name: 'Sun', value: 45 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
                // toast.error('Failed to load dashboard data'); // Optional: suppress to avoid noise on initial load
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        if (socket) {
            socket.on('monitor:update', (data: any) => {
                const message = `Monitor ${data.name} is ${data.status}`;
                if (data.status === 'DOWN') {
                    toast.error(message);
                } else if (data.status === 'UP') {
                    toast.success(message);
                }
                fetchStats(); // Refresh stats
            });

            return () => {
                socket.off('monitor:update');
            };
        }
    }, [socket]);

    const statCards = [
        { title: 'Total Monitors', value: stats.totalMonitors, icon: Server, trend: 'neutral', trendValue: '' },
        { title: 'Active Incidents', value: stats.activeIncidents, icon: AlertTriangle, trend: 'neutral', trendValue: '' },
        { title: 'Global Uptime', value: stats.uptime, icon: Activity, trend: 'neutral', trendValue: '' },
        { title: 'Avg Latency', value: stats.avgLatency, icon: Zap, trend: 'neutral', trendValue: '' },
    ];

    if (loading) {
        return <div className="p-6 text-gray-400">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
                <p className="text-gray-400">Overview of your infrastructure health.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    // @ts-ignore
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChartCard title="Average Response Time (Last 7 Days)" data={chartData} color="#818cf8" />
                <LineChartCard
                    title="Incident Volume (Last 7 Days)"
                    data={[
                        { name: 'Mon', value: 2 },
                        { name: 'Tue', value: 0 },
                        { name: 'Wed', value: 1 },
                        { name: 'Thu', value: 3 },
                        { name: 'Fri', value: 0 },
                        { name: 'Sat', value: 1 },
                        { name: 'Sun', value: 0 },
                    ]}
                    color="#f87171"
                />
            </div>

            {/* Recent Activity / Monitors Preview could go here */}
        </div>
    );
};

export default Dashboard;

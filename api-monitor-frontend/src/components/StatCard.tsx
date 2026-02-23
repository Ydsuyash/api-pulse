import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendValue }) => {
    return (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Icon className="w-5 h-5 text-indigo-400" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-gray-100">{value}</h2>
                {trend && trendValue && (
                    <span className={`text-sm font-medium px-2 py-1 rounded-md ${trend === 'up' ? 'bg-green-500/10 text-green-400' :
                            trend === 'down' ? 'bg-red-500/10 text-red-400' :
                                'bg-gray-500/10 text-gray-400'
                        }`}>
                        {trend === 'up' ? '+' : ''}{trendValue}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatCard;

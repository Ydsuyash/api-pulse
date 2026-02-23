import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DataPoint {
    name: string;
    value: number;
}

interface LineChartCardProps {
    title: string;
    data: DataPoint[];
    color?: string;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ title, data, color = "#6366f1" }) => {
    return (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg h-[350px]">
            <h3 className="text-gray-400 text-sm font-medium mb-6">{title}</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}ms`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                            itemStyle={{ color: '#f3f4f6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: '#111827', stroke: color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: color }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LineChartCard;

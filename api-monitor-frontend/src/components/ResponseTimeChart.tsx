import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ResponseTimeChartProps {
    data: {
        time: string;
        latency: number;
        status: string;
    }[];
}

const ResponseTimeChart = ({ data }: ResponseTimeChartProps) => {
    const formattedData = data.map((d) => ({
        ...d,
        time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return (
        <div className="h-64 w-full bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Response Time (Last 24h)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="time"
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        itemStyle={{ color: '#F3F4F6' }}
                        labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="#6366F1"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#6366F1' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ResponseTimeChart;

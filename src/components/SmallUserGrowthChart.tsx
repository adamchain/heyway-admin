import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserGrowthData {
    date: string;
    users: number;
    cumulative: number;
}

interface SmallUserGrowthChartProps {
    data: UserGrowthData[];
    loading?: boolean;
}

const SmallUserGrowthChart: React.FC<SmallUserGrowthChartProps> = ({ data, loading = false }) => {
    if (loading) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '120px'
            }}>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                    Loading...
                </div>
            </div>
        );
    }

    // Format data for better display
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }),
        cumulative: item.cumulative
    }));

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ marginBottom: '8px' }}>
                <h3 style={{ margin: '0 0 4px 0', color: '#2c3e50', fontSize: '14px' }}>User Growth (30 Days)</h3>
                <p style={{ margin: 0, color: '#7f8c8d', fontSize: '11px' }}>
                    Total: {data.length > 0 ? data[data.length - 1].cumulative : 0} users
                </p>
            </div>

            <ResponsiveContainer width="100%" height={80}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="1 1" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#7f8c8d"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        stroke="#7f8c8d"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#2c3e50',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            padding: '8px'
                        }}
                        labelStyle={{ color: '#ecf0f1', fontSize: '11px' }}
                        formatter={(value: any, name: string) => [
                            name === 'users' ? `${value} new` : `${value} total`,
                            name === 'users' ? 'Daily' : 'Cumulative'
                        ]}
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#3498db"
                        strokeWidth={2}
                        dot={false}
                        name="Total Users"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SmallUserGrowthChart;

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface UserGrowthData {
    date: string;
    users: number;
    cumulative: number;
}

interface UserGrowthChartProps {
    data: UserGrowthData[];
    loading?: boolean;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, loading = false }) => {
    if (loading) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px'
            }}>
                <div style={{ fontSize: '18px', color: '#7f8c8d' }}>
                    Loading user growth data...
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
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>User Growth by Day</h2>
                <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
                    Total users registered over the last 30 days
                </p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={formattedData}>
                    <defs>
                        <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3498db" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                    <XAxis
                        dataKey="date"
                        stroke="#7f8c8d"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#7f8c8d"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#2c3e50',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                        labelStyle={{ color: '#ecf0f1' }}
                        formatter={(value: any, name: string) => [
                            name === 'users' ? `${value} new users` : `${value} total users`,
                            name === 'users' ? 'Daily' : 'Cumulative'
                        ]}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#e74c3c"
                        fill="#e74c3c"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Daily Registrations"
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#3498db"
                        strokeWidth={3}
                        dot={{ fill: '#3498db', strokeWidth: 2, r: 4 }}
                        name="Total Users"
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                        {data.length > 0 ? data[data.length - 1].cumulative : 0}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Total Users</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                        {data.reduce((sum, item) => sum + item.users, 0)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>New This Month</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                        {data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.users, 0) / data.length) : 0}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Avg Daily</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                        {data.length > 7 ?
                            Math.round((data.slice(-7).reduce((sum, item) => sum + item.users, 0) / 7) * 30) :
                            0
                        }
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Monthly Projection</div>
                </div>
            </div>
        </div>
    );
};

export default UserGrowthChart;

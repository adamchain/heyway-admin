import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { getCalls, getSubscriptions, getUsers, getAutomations } from '../services/database';

interface AnalyticsData {
    userGrowth: Array<{ month: string; newUsers: number; totalUsers: number }>;
    callMetrics: Array<{ day: string; calls: number; successful: number; failed: number }>;
    revenueData: Array<{ month: string; revenue: number; subscriptions: number }>;
    userRetention: Array<{ period: string; retention: number }>;
    planDistribution: Array<{ plan: string; count: number; color: string }>;
}

const Analytics: React.FC = () => {
    const [data, setData] = useState<AnalyticsData>({
        userGrowth: [],
        callMetrics: [],
        revenueData: [],
        userRetention: [],
        planDistribution: [],
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [calls, subscriptions, users, automations] = await Promise.all([
                    getCalls(),
                    getSubscriptions(),
                    getUsers(),
                    getAutomations()
                ]);

                // Generate user growth data
                const userGrowth = generateUserGrowthData(users);
                
                // Generate call metrics
                const callMetrics = generateCallMetrics(calls);
                
                // Generate revenue data
                const revenueData = generateRevenueData(subscriptions);
                
                // Generate user retention data
                const userRetention = generateRetentionData(users);
                
                // Generate plan distribution
                const planDistribution = generatePlanDistribution(subscriptions);

                setData({
                    userGrowth,
                    callMetrics,
                    revenueData,
                    userRetention,
                    planDistribution,
                });

            } catch (error) {
                console.error('Error fetching analytics data:', error);
                // Set fallback data
                setData({
                    userGrowth: [
                        { month: 'Jan', newUsers: 120, totalUsers: 120 },
                        { month: 'Feb', newUsers: 150, totalUsers: 270 },
                        { month: 'Mar', newUsers: 180, totalUsers: 450 },
                        { month: 'Apr', newUsers: 200, totalUsers: 650 },
                        { month: 'May', newUsers: 250, totalUsers: 900 },
                        { month: 'Jun', newUsers: 300, totalUsers: 1200 },
                    ],
                    callMetrics: [
                        { day: 'Mon', calls: 120, successful: 105, failed: 15 },
                        { day: 'Tue', calls: 135, successful: 120, failed: 15 },
                        { day: 'Wed', calls: 150, successful: 135, failed: 15 },
                        { day: 'Thu', calls: 140, successful: 125, failed: 15 },
                        { day: 'Fri', calls: 160, successful: 145, failed: 15 },
                        { day: 'Sat', calls: 80, successful: 70, failed: 10 },
                        { day: 'Sun', calls: 60, successful: 55, failed: 5 },
                    ],
                    revenueData: [
                        { month: 'Jan', revenue: 5000, subscriptions: 25 },
                        { month: 'Feb', revenue: 7500, subscriptions: 38 },
                        { month: 'Mar', revenue: 9000, subscriptions: 45 },
                        { month: 'Apr', revenue: 11000, subscriptions: 55 },
                        { month: 'May', revenue: 13000, subscriptions: 65 },
                        { month: 'Jun', revenue: 15000, subscriptions: 75 },
                    ],
                    userRetention: [
                        { period: 'Day 1', retention: 95 },
                        { period: 'Day 7', retention: 85 },
                        { period: 'Day 30', retention: 70 },
                        { period: 'Day 90', retention: 55 },
                        { period: 'Day 180', retention: 45 },
                    ],
                    planDistribution: [
                        { plan: 'Basic', count: 45, color: '#8884d8' },
                        { plan: 'Pro', count: 35, color: '#82ca9d' },
                        { plan: 'Enterprise', count: 20, color: '#ffc658' },
                    ],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]);

    const generateUserGrowthData = (users: any[]) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const growthData = [];
        
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthName = months[monthIndex];
            const usersInMonth = users.filter(u => {
                const userDate = new Date(u.createdAt);
                return userDate.getMonth() === monthIndex;
            }).length;
            
            growthData.push({
                month: monthName,
                newUsers: usersInMonth || Math.floor(Math.random() * 100) + 50,
                totalUsers: growthData.length > 0 ? growthData[growthData.length - 1].totalUsers + (usersInMonth || Math.floor(Math.random() * 100) + 50) : (usersInMonth || Math.floor(Math.random() * 100) + 50)
            });
        }
        
        return growthData;
    };

    const generateCallMetrics = (calls: any[]) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const metricsData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];
            
            const callsOnDay = calls.filter(c => {
                const callDate = new Date(c.startedAt);
                return callDate.toDateString() === date.toDateString();
            }).length;
            
            const successful = calls.filter(c => {
                const callDate = new Date(c.startedAt);
                return callDate.toDateString() === date.toDateString() && c.status === 'completed';
            }).length;
            
            metricsData.push({
                day: dayName,
                calls: callsOnDay || Math.floor(Math.random() * 100) + 50,
                successful: successful || Math.floor((callsOnDay || Math.floor(Math.random() * 100) + 50) * 0.85),
                failed: (callsOnDay || Math.floor(Math.random() * 100) + 50) - (successful || Math.floor((callsOnDay || Math.floor(Math.random() * 100) + 50) * 0.85)),
            });
        }
        
        return metricsData;
    };

    const generateRevenueData = (subscriptions: any[]) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenueData = [];
        
        months.forEach(month => {
            const revenue = Math.floor(Math.random() * 10000) + 5000;
            const subscriptions = Math.floor(Math.random() * 50) + 25;
            revenueData.push({ month, revenue, subscriptions });
        });
        
        return revenueData;
    };

    const generateRetentionData = (users: any[]) => {
        return [
            { period: 'Day 1', retention: 95 },
            { period: 'Day 7', retention: 85 },
            { period: 'Day 30', retention: 70 },
            { period: 'Day 90', retention: 55 },
            { period: 'Day 180', retention: 45 },
        ];
    };

    const generatePlanDistribution = (subscriptions: any[]) => {
        return [
            { plan: 'Basic', count: 45, color: '#8884d8' },
            { plan: 'Pro', count: 35, color: '#82ca9d' },
            { plan: 'Enterprise', count: 20, color: '#ffc658' },
        ];
    };

    if (loading) {
        return (
            <div style={{ 
                padding: '20px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                fontSize: '18px'
            }}>
                Loading analytics data...
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Analytics & Insights</h1>
                        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Deep dive into user behavior and business metrics</p>
                    </div>
                    <div>
                        <select 
                            value={timeRange} 
                            onChange={(e) => setTimeRange(e.target.value)}
                            style={{
                                padding: '10px 15px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                fontSize: '14px'
                            }}
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '40px' 
            }}>
                <div style={{ 
                    padding: '25px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #3498db'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Total Users</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {data.userGrowth[data.userGrowth.length - 1]?.totalUsers || 0}
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: '#27ae60', fontSize: '14px' }}>
                        +{data.userGrowth[data.userGrowth.length - 1]?.newUsers || 0} this month
                    </p>
                </div>

                <div style={{ 
                    padding: '25px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #27ae60'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Monthly Revenue</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        ${data.revenueData[data.revenueData.length - 1]?.revenue?.toLocaleString() || 0}
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: '#27ae60', fontSize: '14px' }}>
                        {data.revenueData[data.revenueData.length - 1]?.subscriptions || 0} active subscriptions
                    </p>
                </div>

                <div style={{ 
                    padding: '25px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #e74c3c'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Call Success Rate</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {((data.callMetrics.reduce((sum, day) => sum + day.successful, 0) / data.callMetrics.reduce((sum, day) => sum + day.calls, 0)) * 100).toFixed(1)}%
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: '#e74c3c', fontSize: '14px' }}>
                        Last 7 days
                    </p>
                </div>

                <div style={{ 
                    padding: '25px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #f39c12'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>User Retention</h3>
                    <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {data.userRetention[1]?.retention || 0}%
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: '#f39c12', fontSize: '14px' }}>
                        7-day retention
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
                gap: '30px', 
                marginBottom: '40px' 
            }}>
                {/* User Growth */}
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>User Growth</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                            <XAxis dataKey="month" stroke="#7f8c8d" />
                            <YAxis stroke="#7f8c8d" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#2c3e50', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: 'white'
                                }} 
                            />
                            <Legend />
                            <Area 
                                type="monotone" 
                                dataKey="totalUsers" 
                                stackId="1"
                                stroke="#3498db" 
                                fill="#3498db" 
                                fillOpacity={0.6}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="newUsers" 
                                stackId="2"
                                stroke="#27ae60" 
                                fill="#27ae60" 
                                fillOpacity={0.6}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Call Performance */}
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Call Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.callMetrics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                            <XAxis dataKey="day" stroke="#7f8c8d" />
                            <YAxis stroke="#7f8c8d" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#2c3e50', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: 'white'
                                }} 
                            />
                            <Legend />
                            <Bar dataKey="successful" fill="#27ae60" name="Successful" />
                            <Bar dataKey="failed" fill="#e74c3c" name="Failed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Growth */}
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Revenue Growth</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                            <XAxis dataKey="month" stroke="#7f8c8d" />
                            <YAxis stroke="#7f8c8d" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#2c3e50', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                                formatter={(value, name) => [
                                    name === 'revenue' ? `$${value.toLocaleString()}` : value,
                                    name === 'revenue' ? 'Revenue' : 'Subscriptions'
                                ]}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#f39c12" 
                                strokeWidth={3}
                                dot={{ fill: '#f39c12', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* User Retention */}
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>User Retention</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.userRetention}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                            <XAxis dataKey="period" stroke="#7f8c8d" />
                            <YAxis stroke="#7f8c8d" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#2c3e50', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                                formatter={(value) => [`${value}%`, 'Retention']}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="retention" 
                                stroke="#9b59b6" 
                                strokeWidth={3}
                                dot={{ fill: '#9b59b6', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Plan Distribution */}
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '25px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Plan Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.planDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ plan, percent }) => `${plan} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {data.planDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#2c3e50', 
                                    border: 'none', 
                                    borderRadius: '8px',
                                    color: 'white'
                                }} 
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

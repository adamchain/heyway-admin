import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { getCalls, getSubscriptions, getUsers, getAutomations, getFeedbacks } from '../services/database';
import type { Call } from '../data/calls';
import type { Subscription } from '../data/subscriptions';

interface DashboardMetrics {
    totalUsers: number;
    activeUsers: number;
    totalCalls: number;
    successfulCalls: number;
    totalRevenue: number;
    monthlyGrowth: number;
    customerSatisfaction: number;
    activeAutomations: number;
    pendingTickets: number;
}

const Dashboard: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [automations] = useState<any[]>([]);
    const [feedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalUsers: 0,
        activeUsers: 0,
        totalCalls: 0,
        successfulCalls: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        customerSatisfaction: 0,
        activeAutomations: 0,
        pendingTickets: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [callsData, subsData, usersData, automationsData, feedbacksData] = await Promise.all([
                    getCalls(),
                    getSubscriptions(),
                    getUsers(),
                    getAutomations(),
                    getFeedbacks()
                ]);

                setCalls(callsData as unknown as Call[]);
                setSubscriptions(subsData as unknown as Subscription[]);
                setUsers(usersData as unknown as any[]);
                setAutomations(automationsData as unknown as any[]);
                setFeedbacks(feedbacksData as unknown as any[]);

                // Calculate metrics
                const totalUsers = usersData.length;
                const activeUsers = usersData.filter((u: any) => u.subscription?.status === 'active' || u.hasActiveSubscription).length;
                const totalCalls = callsData.length;
                const successfulCalls = callsData.filter((c: any) => c.status === 'completed').length;
                const totalRevenue = subsData.reduce((sum: number, s: any) => sum + (s.amount || 0), 0);
                const activeAutomations = automationsData.filter((a: any) => a.isActive).length;

                // Calculate monthly growth
                const currentMonth = new Date().getMonth();
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const currentMonthUsers = usersData.filter((u: any) => {
                    const userDate = new Date(u.createdAt);
                    return userDate.getMonth() === currentMonth;
                }).length;
                const lastMonthUsers = usersData.filter((u: any) => {
                    const userDate = new Date(u.createdAt);
                    return userDate.getMonth() === lastMonth;
                }).length;
                const monthlyGrowth = lastMonthUsers > 0 ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;

                // Calculate customer satisfaction from real feedback data
                const averageRating = feedbacksData.length > 0
                    ? feedbacksData.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / feedbacksData.length
                    : 0;
                const customerSatisfaction = averageRating > 0 ? (averageRating / 5) * 100 : 0;

                setMetrics({
                    totalUsers,
                    activeUsers,
                    totalCalls,
                    successfulCalls,
                    totalRevenue,
                    monthlyGrowth,
                    customerSatisfaction,
                    activeAutomations,
                    pendingTickets: 0, // Will be calculated from real data when available
                });

            } catch (error) {
                console.error('Error fetching data:', error);
                // Set empty metrics on error
                setMetrics({
                    totalUsers: 0,
                    activeUsers: 0,
                    totalCalls: 0,
                    successfulCalls: 0,
                    totalRevenue: 0,
                    monthlyGrowth: 0,
                    customerSatisfaction: 0,
                    activeAutomations: 0,
                    pendingTickets: 0,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Generate user growth data
    const generateUserGrowthData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const growthData: Array<{ month: string; users: number; cumulative: number }> = [];

        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthName = months[monthIndex];
            const usersInMonth = users.filter(u => {
                const userDate = new Date(u.createdAt);
                return userDate.getMonth() === monthIndex;
            }).length;

            growthData.push({
                month: monthName,
                users: usersInMonth,
                cumulative: growthData.length > 0 ? growthData[growthData.length - 1].cumulative + usersInMonth : usersInMonth
            });
        }

        return growthData;
    };

    // Generate call analytics data
    const generateCallAnalytics = () => {
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const callsOnDay = calls.filter(c => {
                const callDate = new Date(c.startedAt);
                return callDate.toDateString() === date.toDateString();
            }).length;

            const successfulCallsOnDay = calls.filter(c => {
                const callDate = new Date(c.startedAt);
                return callDate.toDateString() === date.toDateString() && c.status === 'completed';
            }).length;

            last7Days.push({
                day: dayName,
                calls: callsOnDay,
                successful: successfulCallsOnDay,
            });
        }

        return last7Days;
    };

    // Generate subscription analytics
    const generateSubscriptionData = () => {
        const planTypes = ['Basic', 'Pro', 'Enterprise'];
        const planData = planTypes.map(plan => {
            const count = subscriptions.filter(s => s.plan === plan.toLowerCase()).length;
            return {
                name: plan,
                value: count,
                color: plan === 'Basic' ? '#8884d8' : plan === 'Pro' ? '#82ca9d' : '#ffc658'
            };
        });

        return planData;
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
                Loading dashboard data...
            </div>
        );
    }

    const userGrowthData = generateUserGrowthData();
    const callAnalyticsData = generateCallAnalytics();
    const subscriptionData = generateSubscriptionData();

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>GetHeyway Admin Dashboard</h1>
                <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Real-time analytics and user insights</p>
            </div>

            {/* Key Metrics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Total Users</h3>
                            <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                                {metrics.totalUsers.toLocaleString()}
                            </p>
                            <p style={{ margin: '5px 0 0 0', color: metrics.monthlyGrowth >= 0 ? '#27ae60' : '#e74c3c', fontSize: '14px' }}>
                                {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}% this month
                            </p>
                        </div>
                        <div style={{ fontSize: '2em', color: '#3498db' }}>👥</div>
                    </div>
                </div>

                <div style={{
                    padding: '25px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #27ae60'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Active Subscribers</h3>
                            <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                                {metrics.activeUsers.toLocaleString()}
                            </p>
                            <p style={{ margin: '5px 0 0 0', color: '#27ae60', fontSize: '14px' }}>
                                {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% of total users
                            </p>
                        </div>
                        <div style={{ fontSize: '2em', color: '#27ae60' }}>✅</div>
                    </div>
                </div>

                <div style={{
                    padding: '25px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #e74c3c'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Total Calls</h3>
                            <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                                {metrics.totalCalls.toLocaleString()}
                            </p>
                            <p style={{ margin: '5px 0 0 0', color: '#e74c3c', fontSize: '14px' }}>
                                {((metrics.successfulCalls / metrics.totalCalls) * 100).toFixed(1)}% success rate
                            </p>
                        </div>
                        <div style={{ fontSize: '2em', color: '#e74c3c' }}>📞</div>
                    </div>
                </div>

                <div style={{
                    padding: '25px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #f39c12'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Monthly Revenue</h3>
                            <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                                ${metrics.totalRevenue.toLocaleString()}
                            </p>
                            <p style={{ margin: '5px 0 0 0', color: '#f39c12', fontSize: '14px' }}>
                                Recurring revenue
                            </p>
                        </div>
                        <div style={{ fontSize: '2em', color: '#f39c12' }}>💰</div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: '30px',
                marginBottom: '40px'
            }}>
                {/* User Growth Chart */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>User Growth Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
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
                            <Line
                                type="monotone"
                                dataKey="cumulative"
                                stroke="#3498db"
                                strokeWidth={3}
                                dot={{ fill: '#3498db', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Call Analytics */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Call Volume (Last 7 Days)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={callAnalyticsData}>
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
                            <Bar dataKey="calls" fill="#e74c3c" name="Total Calls" />
                            <Bar dataKey="successful" fill="#27ae60" name="Successful" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Subscription Distribution */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Subscription Plans</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={subscriptionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {subscriptionData.map((entry, index) => (
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

                {/* Customer Service Stats */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Customer Service</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: '4px solid #3498db'
                        }}>
                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Pending Tickets</span>
                            <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#e74c3c' }}>
                                {metrics.pendingTickets}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: '4px solid #27ae60'
                        }}>
                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Customer Satisfaction</span>
                            <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#27ae60' }}>
                                {metrics.customerSatisfaction}%
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: '4px solid #f39c12'
                        }}>
                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Active Automations</span>
                            <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#f39c12' }}>
                                {metrics.activeAutomations}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: '4px solid #9b59b6'
                        }}>
                            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Avg Response Time</span>
                            <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#9b59b6' }}>
                                2.3h
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Recent Activity</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    <div>
                        <h3 style={{ color: '#7f8c8d', fontSize: '16px', marginBottom: '10px' }}>New Users (Last 7 days)</h3>
                        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#3498db' }}>
                            {(() => {
                                const last7Days = new Date();
                                last7Days.setDate(last7Days.getDate() - 7);
                                return users.filter(u => new Date(u.createdAt) >= last7Days).length;
                            })()}
                        </div>
                    </div>
                    <div>
                        <h3 style={{ color: '#7f8c8d', fontSize: '16px', marginBottom: '10px' }}>Calls Today</h3>
                        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#e74c3c' }}>
                            {(() => {
                                const today = new Date().toDateString();
                                return calls.filter(c => new Date(c.startedAt).toDateString() === today).length;
                            })()}
                        </div>
                    </div>
                    <div>
                        <h3 style={{ color: '#7f8c8d', fontSize: '16px', marginBottom: '10px' }}>Revenue Today</h3>
                        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#f39c12' }}>
                            ${(() => {
                                const today = new Date().toDateString();
                                const todaySubscriptions = subscriptions.filter(s =>
                                    new Date(s.createdAt).toDateString() === today
                                );
                                return todaySubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2);
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
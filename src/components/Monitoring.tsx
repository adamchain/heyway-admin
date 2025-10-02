import React, { useState, useEffect } from 'react';

interface SystemAlert {
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    resolved: boolean;
}

interface SystemMetrics {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    activeConnections: number;
    errorRate: number;
}

const Monitoring: React.FC = () => {
    const [alerts, setAlerts] = useState<SystemAlert[]>([]);
    const [metrics, setMetrics] = useState<SystemMetrics>({
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkLatency: 0,
        activeConnections: 0,
        errorRate: 0,
    });
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Simulate real-time monitoring data
        const interval = setInterval(() => {
            // Generate random metrics
            setMetrics({
                cpuUsage: Math.random() * 100,
                memoryUsage: Math.random() * 100,
                diskUsage: Math.random() * 100,
                networkLatency: Math.random() * 200,
                activeConnections: Math.floor(Math.random() * 1000) + 100,
                errorRate: Math.random() * 5,
            });

            // Simulate occasional alerts
            if (Math.random() < 0.1) { // 10% chance of new alert
                const alertTypes: SystemAlert['type'][] = ['warning', 'error', 'info'];
                const newAlert: SystemAlert = {
                    id: Date.now().toString(),
                    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
                    title: generateRandomAlertTitle(),
                    message: generateRandomAlertMessage(),
                    timestamp: new Date(),
                    resolved: false,
                };
                
                setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
            }

            // Simulate network status
            setIsOnline(Math.random() > 0.05); // 95% uptime
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const generateRandomAlertTitle = () => {
        const titles = [
            'High CPU Usage Detected',
            'Memory Usage Warning',
            'Database Connection Slow',
            'API Response Time High',
            'Disk Space Low',
            'Failed Authentication Attempts',
            'SSL Certificate Expiring',
            'Server Load High',
            'Network Latency Spike',
            'Error Rate Increased'
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    };

    const generateRandomAlertMessage = () => {
        const messages = [
            'CPU usage has exceeded 80% for the last 5 minutes.',
            'Memory usage is at 85% capacity.',
            'Database queries are taking longer than expected.',
            'API response times are above normal thresholds.',
            'Available disk space is below 10%.',
            'Multiple failed login attempts detected.',
            'SSL certificate expires in 30 days.',
            'Server load is above recommended levels.',
            'Network latency has increased significantly.',
            'Error rate has increased by 15% in the last hour.'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const resolveAlert = (alertId: string) => {
        setAlerts(prev => prev.map(alert => 
            alert.id === alertId ? { ...alert, resolved: true } : alert
        ));
    };

    const getAlertColor = (type: SystemAlert['type']) => {
        switch (type) {
            case 'error': return '#e74c3c';
            case 'warning': return '#f39c12';
            case 'info': return '#3498db';
            case 'success': return '#27ae60';
            default: return '#7f8c8d';
        }
    };

    const getMetricColor = (value: number, threshold: number) => {
        return value > threshold ? '#e74c3c' : value > threshold * 0.7 ? '#f39c12' : '#27ae60';
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>System Monitoring</h1>
                        <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Real-time system health and performance monitoring</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: isOnline ? '#27ae60' : '#e74c3c',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                animation: isOnline ? 'pulse 2s infinite' : 'none'
                            }} />
                            {isOnline ? 'Online' : 'Offline'}
                        </div>
                    </div>
                </div>
            </div>

            {/* System Metrics */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '30px' 
            }}>
                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${getMetricColor(metrics.cpuUsage, 80)}`
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>CPU Usage</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {metrics.cpuUsage.toFixed(1)}%
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${getMetricColor(metrics.memoryUsage, 85)}`
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Memory Usage</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {metrics.memoryUsage.toFixed(1)}%
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${getMetricColor(metrics.diskUsage, 90)}`
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Disk Usage</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {metrics.diskUsage.toFixed(1)}%
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${getMetricColor(metrics.networkLatency, 100)}`
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Network Latency</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {metrics.networkLatency.toFixed(0)}ms
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #3498db'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Active Connections</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {metrics.activeConnections}
                    </p>
                </div>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white',
                    borderRadius: '12px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${getMetricColor(metrics.errorRate, 2)}`
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>Error Rate</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: '#2c3e50' }}>
                        {metrics.errorRate.toFixed(2)}%
                    </p>
                </div>
            </div>

            {/* System Alerts */}
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #ecf0f1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0, color: '#2c3e50' }}>System Alerts</h2>
                        <div style={{ 
                            padding: '4px 12px',
                            backgroundColor: alerts.filter(a => !a.resolved).length > 0 ? '#e74c3c' : '#27ae60',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {alerts.filter(a => !a.resolved).length} Active
                        </div>
                    </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {alerts.length === 0 ? (
                        <div style={{ 
                            padding: '40px', 
                            textAlign: 'center', 
                            color: '#7f8c8d' 
                        }}>
                            No alerts at this time. System is running normally.
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <div
                                key={alert.id}
                                style={{
                                    padding: '20px',
                                    borderBottom: '1px solid #ecf0f1',
                                    backgroundColor: alert.resolved ? '#f8f9fa' : 'white',
                                    opacity: alert.resolved ? 0.6 : 1,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '15px'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: getAlertColor(alert.type),
                                            borderRadius: '50%'
                                        }} />
                                        <h4 style={{ 
                                            margin: 0, 
                                            color: '#2c3e50', 
                                            fontSize: '16px',
                                            textDecoration: alert.resolved ? 'line-through' : 'none'
                                        }}>
                                            {alert.title}
                                        </h4>
                                        <span style={{
                                            padding: '2px 8px',
                                            backgroundColor: getAlertColor(alert.type),
                                            color: 'white',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}>
                                            {alert.type}
                                        </span>
                                    </div>
                                    <p style={{ 
                                        margin: '0 0 8px 0', 
                                        color: '#7f8c8d', 
                                        fontSize: '14px',
                                        lineHeight: '1.4'
                                    }}>
                                        {alert.message}
                                    </p>
                                    <span style={{ 
                                        color: '#95a5a6', 
                                        fontSize: '12px' 
                                    }}>
                                        {alert.timestamp.toLocaleString()}
                                    </span>
                                </div>
                                {!alert.resolved && (
                                    <button
                                        onClick={() => resolveAlert(alert.id)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#27ae60',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Resolve
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.5; }
                        100% { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default Monitoring;

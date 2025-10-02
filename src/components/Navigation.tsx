import React from 'react';

interface NavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
    currentUser: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onLogout, currentUser }) => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'customer-service', label: 'Customer Service', icon: '🎧' },
        { id: 'analytics', label: 'Analytics', icon: '📈' },
        { id: 'monitoring', label: 'Monitoring', icon: '🔍' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <nav style={{
            backgroundColor: '#2c3e50',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 style={{
                        color: 'white',
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        GetHeyway Admin
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: activeTab === tab.id ? '#3498db' : 'transparent',
                                color: 'white',
                                border: '1px solid',
                                borderColor: activeTab === tab.id ? '#3498db' : '#34495e',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.id) {
                                    e.currentTarget.style.backgroundColor = '#34495e';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#3498db',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        {currentUser.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: 'white', fontSize: '14px' }}>{currentUser}</span>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '1px solid #e74c3c',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e74c3c';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;

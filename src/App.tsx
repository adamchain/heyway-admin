import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import CustomerService from './components/CustomerService';
import Analytics from './components/Analytics';
import Monitoring from './components/Monitoring';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('adminAuth');
    const user = localStorage.getItem('adminUser');
    
    if (authStatus === 'true' && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setCurrentUser('');
    setActiveTab('dashboard');
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserList />;
      case 'customer-service':
        return <CustomerService />;
      case 'analytics':
        return <Analytics />;
      case 'monitoring':
        return <Monitoring />;
      case 'settings':
        return (
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Settings</h1>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
            }}>
              <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                System settings and configuration options will be available here.
              </p>
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Coming Soon:</h3>
                <ul style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
                  <li>User permissions and roles</li>
                  <li>API configuration</li>
                  <li>Email templates</li>
                  <li>System notifications</li>
                  <li>Data export/import</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} currentUser={currentUser} />
      {renderActiveComponent()}
    </div>
  );
}

export default App;

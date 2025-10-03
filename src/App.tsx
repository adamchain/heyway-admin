import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import EnhancedUserList from './components/EnhancedUserList';
import CustomerService from './components/CustomerService';
import Analytics from './components/Analytics';
import Monitoring from './components/Monitoring';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('user-activity');
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
    setActiveTab('user-activity');
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'user-activity':
        return <EnhancedUserList />;
      default:
        return <EnhancedUserList />;
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

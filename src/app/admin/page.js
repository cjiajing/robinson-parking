'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Settings, Calendar, AlertTriangle, 
  Users, BarChart, Lock, Eye, EyeOff 
} from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Admin data
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([
    {
      id: 1,
      date: '2024-03-15',
      time: '22:00',
      duration: '4 hours',
      type: 'Monthly Service',
      description: 'Both lifts unavailable',
      confirmed: true
    }
  ]);
  
  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Monthly Maintenance Tonight',
      message: 'Both lifts will be unavailable from 10PM to 2AM',
      active: true
    }
  ]);
  
  const [stats, setStats] = useState({
    totalUsers: 47,
    activeToday: 23,
    avgWaitTime: '3.5 min',
    occupancyRate: '68%',
    reportedIssues: 2
  });

  const adminPassword = 'Robinson2024'; // Simple password for demo

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  // SAFELY check authentication
  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  const addMaintenance = () => {
    const newSchedule = {
      id: maintenanceSchedule.length + 1,
      date: '2024-03-20',
      time: '14:00',
      duration: '2 hours',
      type: 'Software Update',
      description: 'One lift at a time',
      confirmed: true
    };
    setMaintenanceSchedule([...maintenanceSchedule, newSchedule]);
  };

  const sendAlert = () => {
    const newAlert = {
      id: systemAlerts.length + 1,
      type: 'warning',
      title: 'System Notice',
      message: 'Lift B undergoing diagnostics. Minor delays expected.',
      active: true
    };
    setSystemAlerts([...systemAlerts, newAlert]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-parking-blue rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Robinson Suites Management</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full btn-primary py-3 text-lg"
          >
            Access Admin Panel
          </button>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800 text-center">
              For Robinson Suites management use only
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-4 h-4" />
            Back to User View
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-parking-blue rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Robinson Suites Management</p>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="status-card text-center">
          <div className="text-2xl font-bold text-parking-blue">{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">Registered Users</div>
        </div>
        <div className="status-card text-center">
          <div className="text-2xl font-bold text-parking-green">{stats.activeToday}</div>
          <div className="text-sm text-gray-600">Active Today</div>
        </div>
        <div className="status-card text-center">
          <div className="text-2xl font-bold text-parking-yellow">{stats.avgWaitTime}</div>
          <div className="text-sm text-gray-600">Avg Wait Time</div>
        </div>
        <div className="status-card text-center">
          <div className="text-2xl font-bold text-parking-red">{stats.reportedIssues}</div>
          <div className="text-sm text-gray-600">Open Issues</div>
        </div>
      </div>

      {/* Maintenance Management */}
      <div className="mb-8 status-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Maintenance Schedule</h2>
          </div>
          <button
            onClick={addMaintenance}
            className="px-3 py-1 bg-parking-blue text-white rounded-lg text-sm"
          >
            + Add
          </button>
        </div>

        <div className="space-y-4">
          {maintenanceSchedule.map((item) => (
            <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.type}</h3>
                  <p className="text-sm text-gray-600">{item.date} at {item.time}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm text-blue-600">Edit</button>
                  <button className="text-sm text-red-600">Delete</button>
                </div>
              </div>
              <p className="text-sm text-gray-700">{item.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  ⏰ {item.duration}
                </span>
                {item.confirmed && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                    Confirmed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="mb-8 status-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">System Alerts</h2>
          </div>
          <button
            onClick={sendAlert}
            className="px-3 py-1 bg-parking-blue text-white rounded-lg text-sm"
          >
            + New Alert
          </button>
        </div>

        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <div key={alert.id} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <h3 className="font-medium">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm text-gray-500">Edit</button>
                  <button className="text-sm text-red-600">Remove</button>
                </div>
              </div>
              {alert.active && (
                <div className="mt-2 text-xs text-green-600">● Active</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/security" className="status-card text-center hover:bg-gray-50">
          <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
          <div className="font-medium">Security Portal</div>
        </Link>
        <div className="status-card text-center hover:bg-gray-50 cursor-pointer">
          <BarChart className="w-8 h-8 mx-auto mb-2 text-gray-600" />
          <div className="font-medium">View Analytics</div>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="status-card">
        <h3 className="font-medium text-gray-900 mb-3">Admin Notes</h3>
        <textarea
          placeholder="Add internal notes or reminders..."
          className="w-full p-3 border border-gray-300 rounded-lg h-32"
        />
        <button className="w-full mt-3 btn-secondary py-2">
          Save Notes
        </button>
      </div>
    </div>
  );
}
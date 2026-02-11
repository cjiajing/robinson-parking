
'use client';

import { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, AlertTriangle, Calendar, 
  Car, Users, Clock, Phone
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [systemStatus, setSystemStatus] = useState('operational');
  const [liftA, setLiftA] = useState({ status: 'normal', queue: 0 });
  const [liftB, setLiftB] = useState({ status: 'normal', queue: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [userCode, setUserCode] = useState('');

  // Load user's code from localStorage - SAFELY
  useEffect(() => {
    const savedCode = localStorage.getItem('parkingCode');
    if (savedCode) setUserCode(savedCode);
  }, []);

  // Mock data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate random queue changes
      setLiftA(prev => ({ 
        ...prev, 
        queue: Math.max(0, prev.queue + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-SG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'bg-parking-green';
      case 'warning': return 'bg-parking-yellow';
      case 'error': return 'bg-parking-red';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'normal': return <Wifi className="w-6 h-6" />;
      case 'warning': return <AlertTriangle className="w-6 h-6" />;
      case 'error': return <WifiOff className="w-6 h-6" />;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Robinson Suites Carpark</h1>
        <p className="text-gray-600 text-sm">18 Robinson Road</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
            systemStatus === 'operational' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {systemStatus === 'operational' ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Operational</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">Issues Reported</span>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Updated: {formatTime(lastUpdated)}
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Monthly Maintenance</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Tonight 10:00 PM - 2:00 AM. Both lifts unavailable.
            </p>
            <Link href="/calendar" className="text-yellow-800 font-medium text-sm mt-2 inline-block">
              View schedule →
            </Link>
          </div>
        </div>
      </div>

      {/* Lift Status */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lift Status</h2>
        <div className="flex gap-4">
          {/* Lift A */}
          <div className="flex-1">
            <div className={`lift-indicator ${getStatusColor(liftA.status)}`}>
              <span className="text-lg">A</span>
              <span className="text-xs mt-1">{liftA.status === 'normal' ? 'Normal' : 'Issue'}</span>
            </div>
            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="font-medium">{liftA.queue} in queue</span>
              </div>
              {liftA.queue > 0 && (
                <div className="text-sm text-gray-500">
                  ~{liftA.queue * 3} min wait
                </div>
              )}
            </div>
          </div>

          {/* Lift B */}
          <div className="flex-1">
            <div className={`lift-indicator ${getStatusColor(liftB.status)}`}>
              <span className="text-lg">B</span>
              <span className="text-xs mt-1">{liftB.status === 'normal' ? 'Normal' : 'Issue'}</span>
            </div>
            <div className="text-center mt-2">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="font-medium">{liftB.queue} in queue</span>
              </div>
              {liftB.queue > 0 && (
                <div className="text-sm text-gray-500">
                  ~{liftB.queue * 3} min wait
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* My Code Display */}
      {userCode && (
        <div className="mb-6 status-card">
          <h3 className="font-medium text-gray-900 mb-2">Your Parking Code</h3>
          <div className="text-2xl font-mono font-bold text-center py-3 bg-gray-100 rounded-lg">
            {userCode}
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Enter this 4-digit code on the touchscreen
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/checkin" className="btn-primary flex flex-col items-center justify-center py-4">
            <Car className="w-6 h-6 mb-2" />
            <span>Check In Car</span>
          </Link>
          
          <Link href="/retrieve" className="btn-primary flex flex-col items-center justify-center py-4">
            <Users className="w-6 h-6 mb-2" />
            <span>Retrieve Car</span>
          </Link>
          
          <Link href="/issues" className="btn-secondary flex flex-col items-center justify-center py-4">
            <AlertTriangle className="w-6 h-6 mb-2" />
            <span>Report Issue</span>
          </Link>
          
          <Link href="/calendar" className="btn-secondary flex flex-col items-center justify-center py-4">
            <Calendar className="w-6 h-6 mb-2" />
            <span>Calendar</span>
          </Link>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="status-card">
        <h3 className="font-medium text-gray-900 mb-3">Emergency Contact</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">24/7 Hotline</p>
            <p className="font-mono font-bold text-lg">+65 8126 0005</p>
            <p className="text-xs text-gray-500">Glory Grace Pte Ltd</p>
          </div>
          <a 
            href="tel:+6581260005" 
            className="flex items-center gap-2 px-4 py-2 bg-parking-red text-white rounded-lg font-medium hover:bg-red-600"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center text-parking-blue">
            <div className="w-6 h-6 mb-1">🏠</div>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/checkin" className="flex flex-col items-center text-gray-600">
            <div className="w-6 h-6 mb-1">🚗</div>
            <span className="text-xs">Check In</span>
          </Link>
          <Link href="/retrieve" className="flex flex-col items-center text-gray-600">
            <div className="w-6 h-6 mb-1">👥</div>
            <span className="text-xs">Retrieve</span>
          </Link>
          <Link href="/issues" className="flex flex-col items-center text-gray-600">
            <div className="w-6 h-6 mb-1">⚠️</div>
            <span className="text-xs">Issues</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

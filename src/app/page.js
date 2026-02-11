'use client';

import { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, AlertTriangle, Calendar, 
  Car, Users, Clock, Phone, X
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [systemStatus, setSystemStatus] = useState('operational');
  const [liftA, setLiftA] = useState({ status: 'normal', queue: 0 });
  const [liftB, setLiftB] = useState({ status: 'normal', queue: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [userCode, setUserCode] = useState('');
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  
  // Consent state
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  // Check if user has accepted terms
  useEffect(() => {
    const accepted = localStorage.getItem('terms-accepted');
    if (accepted === 'true') {
      setHasAcceptedTerms(true);
    } else {
      setShowConsent(true);
    }

    const savedCode = localStorage.getItem('parkingCode');
    if (savedCode) setUserCode(savedCode);

    const savedAlerts = localStorage.getItem('activeAlerts');
    if (savedAlerts) {
      setActiveAlerts(JSON.parse(savedAlerts));
    }

    const savedDismissed = localStorage.getItem('dismissedAlerts');
    if (savedDismissed) {
      setDismissedAlerts(JSON.parse(savedDismissed));
    }

    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const acceptTerms = () => {
    localStorage.setItem('terms-accepted', 'true');
    setHasAcceptedTerms(true);
    setShowConsent(false);
  };

  const dismissAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setDismissedAlerts(prev => [...prev, alertId]);
    localStorage.setItem('dismissedAlerts', JSON.stringify([...dismissedAlerts, alertId]));
    localStorage.setItem('activeAlerts', JSON.stringify(activeAlerts.filter(alert => alert.id !== alertId)));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-SG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  // If showing consent, render consent modal
  if (showConsent) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-parking-blue" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Robinson Suites Parking
            </h1>
            <p className="text-gray-600">
              Please review and accept our terms to continue
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
            <p className="text-gray-700 mb-3">
              <span className="font-bold text-parking-blue">Important:</span> This is an unofficial community tool and is not affiliated with the building management.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Queue positions are voluntary and not guaranteed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>We collect anonymous usage data to improve the service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>You can delete your data at any time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">⚠</span>
                <span>Do not use this app in emergencies - call +65 8126 0005</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              href="/terms" 
              className="text-sm text-parking-blue hover:underline text-center"
            >
              Read Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-parking-blue hover:underline text-center mb-2"
            >
              Read Privacy Policy
            </Link>
            
            <button
              onClick={acceptTerms}
              className="w-full py-3 bg-parking-blue text-white rounded-xl font-semibold hover:bg-parking-blue/90 transition-colors"
            >
              I Understand & Accept
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-2">
              By accepting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main app content (only shown after consent)
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
        
        {/* Consent reminder - small badge */}
        <div className="mt-2 text-right">
          <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600">
            Legal ✓
          </Link>
        </div>
      </header>

      {/* Rest of your existing homepage content... */}
      {/* (Keep all your existing code from here) */}
      
      {/* Dynamic Alert Banners */}
      {activeAlerts.filter(alert => !dismissedAlerts.includes(alert.id)).map((alert) => (
        <div key={alert.id} className={`mb-4 rounded-xl p-4 border ${
          alert.priority === 'high' ? 'bg-red-50 border-red-200' :
          alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                alert.priority === 'high' ? 'text-red-600' :
                alert.priority === 'medium' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${
                    alert.priority === 'high' ? 'text-red-800' :
                    alert.priority === 'medium' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.title}
                  </h3>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-sm mt-1 ${
                  alert.priority === 'high' ? 'text-red-700' :
                  alert.priority === 'medium' ? 'text-yellow-700' :
                  'text-blue-700'
                }`}>
                  {alert.message}
                </p>
                {alert.date && (
                  <div className={`text-xs mt-2 ${
                    alert.priority === 'high' ? 'text-red-600' :
                    alert.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    Posted: {formatDate(alert.date)}
                  </div>
                )}
                {alert.type === 'maintenance' && (
                  <Link href="/calendar" className="inline-block mt-2 font-medium text-sm">
                    View schedule →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* No alerts message */}
      {activeAlerts.filter(alert => !dismissedAlerts.includes(alert.id)).length === 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5">✅</div>
            <div>
              <h3 className="font-medium text-green-800">All Systems Normal</h3>
              <p className="text-green-700 text-sm mt-1">
                No scheduled maintenance or issues reported.
              </p>
            </div>
          </div>
        </div>
      )}

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
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Queue counts update when users join/leave via the Retrieve page
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
            Enter this 4-digit code on the touchscreen to retrieve your car
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

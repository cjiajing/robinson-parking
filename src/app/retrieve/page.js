'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, AlertCircle } from 'lucide-react';

export default function RetrievePage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [queueA, setQueueA] = useState(2);
  const [queueB, setQueueB] = useState(0);
  const [userInQueue, setUserInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState({ A: 6, B: 0 });
  const [userCode, setUserCode] = useState('____'); // Default value

  // Load user's code from localStorage - SAFELY
  useEffect(() => {
    // This only runs in the browser
    const savedCode = localStorage.getItem('parkingCode');
    if (savedCode) setUserCode(savedCode);
  }, []);

  const joinQueue = (lift) => {
    if (lift === 'A') {
      const newPosition = queueA + 1;
      setQueueA(newPosition);
      setQueuePosition(newPosition);
      setSelectedLift('A');
    } else {
      const newPosition = queueB + 1;
      setQueueB(newPosition);
      setQueuePosition(newPosition);
      setSelectedLift('B');
    }
    setUserInQueue(true);
    
    // Auto-leave after 15 minutes
    setTimeout(() => {
      leaveQueue(lift);
    }, 15 * 60 * 1000);
  };

  const leaveQueue = (lift) => {
    if (lift === 'A' && queueA > 0) {
      setQueueA(prev => prev - 1);
    } else if (lift === 'B' && queueB > 0) {
      setQueueB(prev => prev - 1);
    }
    setUserInQueue(false);
    setQueuePosition(null);
  };

  // Update estimated times
  useEffect(() => {
    setEstimatedTime({
      A: queueA * 3,
      B: queueB * 3
    });
  }, [queueA, queueB]);

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      {/* Header */}
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Retrieve Car</h1>
        <p className="text-gray-600">Check queue and join virtual line</p>
      </header>

      {/* User's Code Display */}
      <div className="mb-6 status-card">
        <h3 className="font-medium text-gray-900 mb-2">Your Retrieval Code</h3>
        <div className="text-3xl font-mono font-bold text-center py-4 bg-gray-100 rounded-lg mb-3">
          {userCode}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Enter this on the touchscreen to retrieve your car
        </p>
      </div>

      {/* Lift Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Lift</h2>
        <div className="space-y-4">
          {/* Lift A Card */}
          <div className={`status-card ${selectedLift === 'A' ? 'ring-2 ring-parking-blue' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-parking-green rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-lg">Lift A</h3>
                  <p className="text-sm text-gray-600">Currently operational</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-700">
                  <Users className="w-4 h-4" />
                  <span className="font-bold">{queueA} waiting</span>
                </div>
                {queueA > 0 && (
                  <div className="text-sm text-gray-500">
                    ~{estimatedTime.A} minutes
                  </div>
                )}
              </div>
            </div>
            
            {userInQueue && selectedLift === 'A' ? (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">You're in queue</p>
                    <p className="text-sm text-blue-700">Position #{queuePosition}</p>
                  </div>
                  <button
                    onClick={() => leaveQueue('A')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                  >
                    Leave Queue
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => joinQueue('A')}
                className="w-full btn-primary py-3"
              >
                {queueA === 0 ? 'Join Queue (Available Now)' : 'Join Queue'}
              </button>
            )}
          </div>

          {/* Lift B Card */}
          <div className={`status-card ${selectedLift === 'B' ? 'ring-2 ring-parking-blue' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-parking-green rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  B
                </div>
                <div>
                  <h3 className="font-bold text-lg">Lift B</h3>
                  <p className="text-sm text-gray-600">Currently operational</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-700">
                  <Users className="w-4 h-4" />
                  <span className="font-bold">{queueB} waiting</span>
                </div>
                {queueB > 0 && (
                  <div className="text-sm text-gray-500">
                    ~{estimatedTime.B} minutes
                  </div>
                )}
              </div>
            </div>
            
            {userInQueue && selectedLift === 'B' ? (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">You're in queue</p>
                    <p className="text-sm text-blue-700">Position #{queuePosition}</p>
                  </div>
                  <button
                    onClick={() => leaveQueue('B')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                  >
                    Leave Queue
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => joinQueue('B')}
                className="w-full btn-primary py-3"
              >
                {queueB === 0 ? 'Join Queue (Available Now)' : 'Join Queue'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="status-card mb-8">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">How to Retrieve</h3>
        </div>
        <ol className="text-gray-700 space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="font-bold w-6">1.</span>
            <span>Join queue above when you arrive at the lifts</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">2.</span>
            <span>Go to the touchscreen and tap "RETRIEVE VEHICLE"</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">3.</span>
            <span>Enter your 4-digit code: <span className="font-mono font-bold">{userCode}</span></span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">4.</span>
            <span>System shows your pallet number</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">5.</span>
            <span>Wait for lift to deliver your car</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">6.</span>
            <span>Tap "Leave Queue" above when done</span>
          </li>
        </ol>
      </div>

      {/* Live Queue Display */}
      <div className="status-card">
        <h3 className="font-medium text-gray-900 mb-3">Live Queue Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-parking-green rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="font-medium">Lift A Queue</p>
                <p className="text-sm text-gray-600">{queueA} {queueA === 1 ? 'person' : 'people'} waiting</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{queueA}</div>
              <div className="text-sm text-gray-600">in line</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-parking-green rounded-lg flex items-center justify-center text-white font-bold">
                B
              </div>
              <div>
                <p className="font-medium">Lift B Queue</p>
                <p className="text-sm text-gray-600">{queueB} {queueB === 1 ? 'person' : 'people'} waiting</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{queueB}</div>
              <div className="text-sm text-gray-600">in line</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
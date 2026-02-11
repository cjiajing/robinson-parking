'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, Clock, Users, Bell } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Simple in-memory queue
let globalQueue = [];

export default function RetrieveCarPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [queuePosition, setQueuePosition] = useState(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user ID and load queue
  useEffect(() => {
    let storedId = localStorage.getItem('parking-user-id');
    if (!storedId) {
      storedId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('parking-user-id', storedId);
    }
    setUserId(storedId);
    
    // Load queue from localStorage
    const savedQueue = localStorage.getItem('parking-queue-data');
    if (savedQueue) {
      try {
        globalQueue = JSON.parse(savedQueue);
      } catch (e) {
        console.log('No saved queue');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Update queue info
  const updateQueueInfo = () => {
    if (!selectedLift) return;
    
    const liftQueue = globalQueue.filter(item => 
      item.lift === selectedLift && item.status === 'waiting'
    );
    
    setQueueLength(liftQueue.length);
    
    const userInQueue = liftQueue.find(item => item.userId === userId);
    if (userInQueue) {
      const position = liftQueue.findIndex(item => item.userId === userId) + 1;
      setQueuePosition(position);
      setIsInQueue(true);
    } else {
      setQueuePosition(null);
      setIsInQueue(false);
    }
    
    // Save to localStorage
    localStorage.setItem('parking-queue-data', JSON.stringify(globalQueue));
  };

  // Check for updates every 3 seconds
  useEffect(() => {
    updateQueueInfo();
    const interval = setInterval(updateQueueInfo, 3000);
    return () => clearInterval(interval);
  }, [selectedLift, userId]);

  const handleJoinQueue = () => {
    if (!selectedLift || !userId) return;
    
    // Remove if already in queue
    globalQueue = globalQueue.filter(item => 
      !(item.userId === userId && item.status === 'waiting')
    );
    
    // Add to queue
    globalQueue.push({
      userId,
      lift: selectedLift,
      status: 'waiting',
      joinedAt: new Date().toISOString()
    });
    
    updateQueueInfo();
    alert(`Joined queue for Lift ${selectedLift}`);
  };

  const handleLeaveQueue = () => {
    globalQueue = globalQueue.filter(item => 
      !(item.userId === userId && item.status === 'waiting')
    );
    updateQueueInfo();
    alert('Left the queue');
  };

  const handleCarRetrieved = () => {
    globalQueue = globalQueue.filter(item => 
      !(item.userId === userId && item.status === 'waiting')
    );
    updateQueueInfo();
    alert('Car retrieved!');
  };

  const calculateWaitTime = () => {
    if (!queuePosition) return 'N/A';
    const minutes = (queuePosition - 1) * 5;
    if (minutes === 0) return 'Ready now';
    if (minutes < 60) return `${minutes} minutes`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Retrieve Car</h1>
          <p className="text-gray-600">Loading...</p>
        </header>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Retrieve Car</h1>
        <p className="text-gray-600">Join queue to retrieve your vehicle</p>
      </header>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          1. Select Lift <span className="text-red-500">*</span>
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedLift('A')}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg ${
              selectedLift === 'A' 
                ? 'border-parking-blue bg-blue-50 text-parking-blue' 
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            Lift A
          </button>
          <button
            onClick={() => setSelectedLift('B')}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg ${
              selectedLift === 'B' 
                ? 'border-parking-blue bg-blue-50 text-parking-blue' 
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            Lift B
          </button>
        </div>
      </div>

      {selectedLift && (
        <div className="mb-8">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Current Queue</span>
              </div>
              <span className="text-2xl font-bold">{queueLength}</span>
            </div>
            <p className="text-sm text-gray-600">
              {queueLength === 0 
                ? 'No one in queue' 
                : `${queueLength} car${queueLength > 1 ? 's' : ''} waiting`
              }
            </p>
          </div>

          {isInQueue ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Your Position</span>
                </div>
                <span className="text-3xl font-bold text-green-700">#{queuePosition}</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Estimated wait: <strong>{calculateWaitTime()}</strong>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleLeaveQueue}
                  className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                >
                  Leave Queue
                </button>
                <button
                  onClick={handleCarRetrieved}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  Car Retrieved
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleJoinQueue}
              disabled={!selectedLift}
              className="w-full py-4 bg-parking-blue text-white rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Join Queue for Lift {selectedLift}
            </button>
          )}
        </div>
      )}

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Note</p>
            <p className="text-xs text-blue-600">
              Queue is saved to your browser. Other devices won't see updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

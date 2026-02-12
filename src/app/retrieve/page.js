'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, Clock, Users, Bell, Loader, MapPin, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function RetrieveCarPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [queuePosition, setQueuePosition] = useState(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [queueData, setQueueData] = useState([]);
  
  // Parking details from check-in
  const [parkingDetails, setParkingDetails] = useState(null);

  // Generate or get user ID and load parking details
  useEffect(() => {
    let storedId = localStorage.getItem('parking-user-id');
    if (!storedId) {
      storedId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('parking-user-id', storedId);
    }
    setUserId(storedId);
    
    // Load parking details from localStorage first (fast)
    const savedLift = localStorage.getItem('lastParkingLift');
    const savedCode = localStorage.getItem('parkingCode');
    const savedPallet = localStorage.getItem('lastParkingPallet');
    
    if (savedLift) {
      setSelectedLift(savedLift);
      setParkingDetails({
        lift: savedLift,
        code: savedCode || 'Not set',
        pallet: savedPallet || null,
        level: savedPallet ? Math.ceil(parseInt(savedPallet) / 8) : null
      });
    }
  }, []);

  // Load parking details from Supabase (more accurate)
  useEffect(() => {
    if (!userId) return;

    async function loadParkingDetails() {
      const { data, error } = await supabase
        .from('user_parking')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setParkingDetails({
          lift: data.lift,
          code: data.code,
          pallet: data.pallet,
          level: data.level
        });
        
        // Auto-select the lift from parking
        if (data.lift) {
          setSelectedLift(data.lift);
        }
      }
    }

    loadParkingDetails();
  }, [userId]);

  // Load queue data from Supabase
  const loadQueueData = async () => {
    if (!selectedLift) return;

    const { data, error } = await supabase
      .from('parking_queue')
      .select('*')
      .eq('lift', selectedLift)
      .eq('status', 'waiting')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading queue:', error);
      return;
    }

    setQueueData(data || []);
    setQueueLength(data?.length || 0);

    // Check if current user is in queue
    const userEntry = data?.find(item => item.user_id === userId);
    if (userEntry) {
      const position = data.findIndex(item => item.user_id === userId) + 1;
      setQueuePosition(position);
      setIsInQueue(true);
    } else {
      setQueuePosition(null);
      setIsInQueue(false);
    }
    
    setIsLoading(false);
  };

  // Initial load and real-time subscription
  useEffect(() => {
    if (!userId || !selectedLift) {
      setIsLoading(false);
      return;
    }

    loadQueueData();

    const channel = supabase
      .channel('queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_queue',
          filter: `lift=eq.${selectedLift}`
        },
        () => {
          loadQueueData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, selectedLift]);

  const handleJoinQueue = async () => {
    if (!selectedLift || !userId) return;

    const { data: existing } = await supabase
      .from('parking_queue')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'waiting')
      .maybeSingle();

    if (existing) {
      alert('You are already in the queue!');
      return;
    }

    const { error } = await supabase
      .from('parking_queue')
      .insert([
        {
          user_id: userId,
          lift: selectedLift,
          status: 'waiting'
        }
      ]);

    if (error) {
      console.error('Error joining queue:', error);
      alert('Failed to join queue. Please try again.');
    } else {
      alert(`✅ Joined queue for Lift ${selectedLift}`);
    }
  };

  const handleLeaveQueue = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('parking_queue')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'waiting');

    if (error) {
      console.error('Error leaving queue:', error);
      alert('Failed to leave queue.');
    } else {
      alert('Left the queue');
    }
  };

  const handleCarRetrieved = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('parking_queue')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'waiting');

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    } else {
      alert('✅ Car retrieved successfully!');
    }
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
        </header>
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-parking-blue mx-auto" />
          <p className="mt-2 text-gray-600">Loading your parking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-24">
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Retrieve Car</h1>
        <p className="text-gray-600">Join queue to retrieve your vehicle</p>
      </header>

      {/* Parking Details Card - Show where user parked */}
      {parkingDetails && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-parking-blue/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-parking-blue" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 mb-1">Your Parked Car</h2>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-gray-600">Lift:</span>{' '}
                  <span className="font-mono font-bold text-parking-blue">{parkingDetails.lift}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Code:</span>{' '}
                  <span className="font-mono font-bold">{parkingDetails.code}</span>
                </p>
                {parkingDetails.pallet && (
                  <p className="text-sm">
                    <span className="text-gray-600">Pallet:</span>{' '}
                    <span className="font-mono font-bold">#{parkingDetails.pallet}</span>
                    {parkingDetails.level && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Level {parkingDetails.level})
                      </span>
                    )}
                  </p>
                )}
              </div>
              <Link 
                href="/checkin" 
                className="inline-block mt-3 text-xs text-parking-blue hover:underline"
              >
                Update parking location →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Lift Selection - Auto-selected but can change */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            1. Select Lift <span className="text-red-500">*</span>
          </h2>
          {parkingDetails && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              Auto-selected from parking
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedLift('A')}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all ${
              selectedLift === 'A' 
                ? 'border-parking-blue bg-blue-50 text-parking-blue ring-2 ring-blue-200' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            Lift A
          </button>
          <button
            onClick={() => setSelectedLift('B')}
            className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all ${
              selectedLift === 'B' 
                ? 'border-parking-blue bg-blue-50 text-parking-blue ring-2 ring-blue-200' 
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            Lift B
          </button>
        </div>
        {parkingDetails && parkingDetails.lift !== selectedLift && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            You parked at Lift {parkingDetails.lift}. Are you sure?
          </p>
        )}
      </div>

      {/* Queue Info */}
      {selectedLift && (
        <div className="mb-8">
          {/* Queue Length Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Current Queue</span>
              </div>
              <span className="text-2xl font-bold text-parking-blue">{queueLength}</span>
            </div>
            <p className="text-sm text-gray-600">
              {queueLength === 0 
                ? '✨ No one in queue - you can retrieve immediately!' 
                : `${queueLength} car${queueLength > 1 ? 's' : ''} waiting`
              }
            </p>
          </div>

          {/* User's Queue Status */}
          {isInQueue ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Your Position</span>
                </div>
                <span className="text-3xl font-bold text-green-700">#{queuePosition}</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                {queuePosition === 1 
                  ? '🎯 You are next! Please proceed to the lift.'
                  : `Estimated wait: ${calculateWaitTime()}`
                }
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleLeaveQueue}
                  className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  Leave Queue
                </button>
                <button
                  onClick={handleCarRetrieved}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  ✓ Car Retrieved
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleJoinQueue}
              className="w-full py-4 bg-parking-blue text-white rounded-xl font-semibold text-lg hover:bg-parking-blue/90 transition-colors flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Join Queue for Lift {selectedLift}
            </button>
          )}
        </div>
      )}

      {/* Quick Reminder */}
      {!parkingDetails && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">No parking record found</p>
              <p className="text-xs text-yellow-700 mt-1">
                Have you checked in?{' '}
                <Link href="/checkin" className="font-medium underline">
                  Check in your car first
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Status */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Live Queue Updates</p>
            <p className="text-xs text-blue-600">
              Queue updates in real-time. Your position will refresh automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

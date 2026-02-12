'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Car, Clock, Users, Bell, Loader, 
  MapPin, Info, CheckCircle, HelpCircle, X, Crown 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function RetrieveCarPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [queuePosition, setQueuePosition] = useState(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [verifiedQueue, setVerifiedQueue] = useState(null);
  const [verifiedQueueTime, setVerifiedQueueTime] = useState(null);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [queueData, setQueueData] = useState([]);
  const [parkingDetails, setParkingDetails] = useState(null);
  
  // Queue verification state
  const [showPositionVerifier, setShowPositionVerifier] = useState(false);
  const [showManualVerifier, setShowManualVerifier] = useState(false);
  const [userVerificationCount, setUserVerificationCount] = useState(0);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [justJoinedLift, setJustJoinedLift] = useState('');

  // Generate or get user ID
  useEffect(() => {
    let storedId = localStorage.getItem('parking-user-id');
    if (!storedId) {
      storedId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('parking-user-id', storedId);
    }
    setUserId(storedId);
    
    // Load user's verification count
    const verifications = localStorage.getItem('user-verifications');
    if (verifications) {
      setUserVerificationCount(parseInt(verifications));
    }
    
    // Load parking details from localStorage
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

  // Load parking details from Supabase
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
        
        if (data.lift) {
          setSelectedLift(data.lift);
        }
      }
    }

    loadParkingDetails();
  }, [userId]);

  // Load queue data and verifications
  const loadQueueData = async () => {
    if (!selectedLift) return;

    // Load digital queue
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

    // Load recent verifications (last 10 minutes)
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: verifications, error: verifError } = await supabase
      .from('queue_verifications')
      .select('*')
      .eq('lift', selectedLift)
      .gte('created_at', tenMinsAgo)
      .order('created_at', { ascending: false });

    if (!verifError && verifications) {
      setRecentVerifications(verifications);
      
      // Calculate weighted average (more recent = higher weight)
      if (verifications.length > 0) {
        let totalWeight = 0;
        let weightedSum = 0;
        
        verifications.forEach((v, index) => {
          const weight = verifications.length - index;
          weightedSum += v.count * weight;
          totalWeight += weight;
        });
        
        const avgCount = Math.round(weightedSum / totalWeight);
        setVerifiedQueue(avgCount);
        setVerifiedQueueTime(new Date(verifications[0].created_at));
      } else {
        setVerifiedQueue(null);
        setVerifiedQueueTime(null);
      }
    }

    // Check if user is in queue
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

  // Real-time subscription
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
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'queue_verifications',
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

    // Check if already in queue
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

    // Join queue
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
      // Store which lift they joined
      setJustJoinedLift(selectedLift);
      // Show position verifier immediately
      setShowPositionVerifier(true);
    }
  };

  const handleVerifyPosition = async (position) => {
    setShowPositionVerifier(false);
    setJustJoinedLift('');
    
    try {
      console.log('=== VERIFY POSITION START ===');
      console.log('Requested position:', position);
      
      // Get current queue
      const { data: queueData } = await supabase
        .from('parking_queue')
        .select('*')
        .eq('lift', selectedLift)
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });
      
      console.log('Current queue length:', queueData.length);
      
      // CALCULATE TIMESTAMP BASED ON REALITY
      let targetTime;
      
      // CASE 1: Queue is empty
      if (queueData.length === 0) {
        // You're the first person - you ARE #1
        targetTime = new Date('2024-01-01T00:00:00Z');
        console.log('Queue empty, setting as #1');
      }
      // CASE 2: You want to be #1
      else if (position === 1) {
        targetTime = new Date('2024-01-01T00:00:00Z');
        console.log('Setting as #1');
      }
      // CASE 3: You want position beyond current queue length
      else if (position > queueData.length) {
        // You're actually at the end of the queue
        targetTime = new Date();
        console.log('Position > queue length, setting as last position');
      }
      // CASE 4: Normal case - insert at specific position
      else {
        // Get the person who should be ahead of you
        const personAhead = queueData[position - 2];
        if (personAhead) {
          targetTime = new Date(new Date(personAhead.created_at).getTime() + 1000);
          console.log(`Setting position #${position} (after ${personAhead.user_id.slice(-4)})`);
        } else {
          targetTime = new Date('2024-01-01T00:00:00Z');
          console.log('No person ahead, setting as #1');
        }
      }
      
      console.log('Target time:', targetTime.toISOString());
      
      // Update user's position
      const { error } = await supabase
        .from('parking_queue')
        .update({ 
          created_at: targetTime.toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'waiting');
      
      if (error) throw error;
      
      // Record verification
      await supabase.from('queue_verifications').insert([{
        lift: selectedLift,
        count: queueData.length + 1, // Actual queue length after you join
        user_id: userId,
        verified_position: Math.min(position, queueData.length + 1), // Can't exceed actual queue
        created_at: new Date().toISOString()
      }]);
      
      // Update helper count
      const newCount = (parseInt(localStorage.getItem('user-verifications') || '0')) + 1;
      localStorage.setItem('user-verifications', newCount.toString());
      setUserVerificationCount(newCount);
      
      // Show appropriate message
      if (queueData.length === 0) {
        alert(`✅ You are #1 in queue`);
      } else if (position > queueData.length) {
        alert(`✅ You are #${queueData.length + 1} in queue`);
      } else {
        alert(`✅ You are now #${position} in queue`);
      }
      
      // Reload queue
      loadQueueData();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update queue position: ' + error.message);
    }
  };

  const handleManualVerify = async (count) => {
    if (!selectedLift) return;
    
    const verification = {
      lift: selectedLift,
      count: count,
      user_id: userId,
      created_at: new Date().toISOString(),
      type: 'manual_verification'
    };
    
    const { error } = await supabase
      .from('queue_verifications')
      .insert([verification]);
      
    if (!error) {
      const newCount = userVerificationCount + 1;
      setUserVerificationCount(newCount);
      localStorage.setItem('user-verifications', newCount.toString());
      
      alert(`✅ Queue updated to ${count} people. Thanks for helping!`);
      setShowManualVerifier(false);
      loadQueueData();
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
      
      // Clear parking record
      localStorage.removeItem('parkingCode');
      localStorage.removeItem('lastParkingLift');
      localStorage.removeItem('lastParkingPallet');
      localStorage.removeItem('lastParkingTime');
      
      setParkingDetails(null);
      setSelectedLift('');
    }
  };

  const calculateWaitTime = (queueCount) => {
    if (!queueCount) return 'N/A';
    const minutes = (queueCount - (queuePosition || 0)) * 5;
    if (minutes <= 0) return 'Ready now';
    if (minutes < 60) return `${minutes} minutes`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
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
          <p className="mt-2 text-gray-600">Loading queue information...</p>
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
        <p className="text-gray-600">Join queue and verify your position to help others</p>
      </header>

      {/* Parking Details Card */}
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
            </div>
          </div>
        </div>
      )}

      {/* Lift Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Lift
          </h2>
          {userVerificationCount > 0 && (
            <div className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
              <Crown className="w-3 h-3" />
              <span>Helped {userVerificationCount} times</span>
            </div>
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
      </div>

      {selectedLift && (
        <>
          {/* Queue Comparison Cards */}
          <div className="mb-6">
            <div className="flex gap-3">
              {/* Digital Queue */}
              <div className="flex-1 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs text-blue-600 font-medium mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  DIGITAL QUEUE
                </p>
                <p className="text-3xl font-bold text-blue-700">{queueLength}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Joined via app
                </p>
              </div>
              
              {/* Verified Queue */}
              <div className="flex-1 bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs text-green-600 font-medium mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  VERIFIED QUEUE
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {verifiedQueue !== null ? verifiedQueue : '?'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {verifiedQueueTime 
                    ? `${formatTimeAgo(verifiedQueueTime)}`
                    : 'No reports'}
                </p>
              </div>
            </div>
            
            {recentVerifications.length > 0 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                🫶 {recentVerifications.length} people verified • Last {verifiedQueueTime ? formatTimeAgo(verifiedQueueTime) : 'N/A'}
              </p>
            )}
          </div>

          {/* Join Queue Button or Queue Status */}
          {isInQueue ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
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
                  : `Estimate: ${calculateWaitTime(verifiedQueue || queueLength)}`
                }
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
                  ✓ Car Retrieved
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleJoinQueue}
              className="w-full py-4 bg-parking-blue text-white rounded-xl font-semibold text-lg hover:bg-parking-blue/90 mb-4 flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Join Queue & Verify Position
            </button>
          )}

          {/* Manual Verification Button (for people already in queue) */}
          {!isInQueue && (
            <button
              onClick={() => setShowManualVerifier(true)}
              className="w-full py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mb-6 flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              I'm at the lift lobby • Update queue count
            </button>
          )}

          {/* No Parking Record Warning */}
          {!parkingDetails && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                ℹ️ No parking record found. 
                <Link href="/checkin" className="font-medium underline ml-1">
                  Check in your car first
                </Link>
              </p>
            </div>
          )}
        </>
      )}

      {/* Position Verifier Modal */}
      {showPositionVerifier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg text-center mb-2">
              What's your queue number?
            </h3>
            
            <p className="text-sm text-gray-600 text-center mb-4">
              Lift {selectedLift} • Tap your position
            </p>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1,2,3,4,5,6,7,8].map(num => (
                <button
                  key={num}
                  onClick={() => handleVerifyPosition(num)}
                  className="py-4 border-2 border-gray-200 rounded-xl hover:border-parking-blue hover:bg-blue-50 font-bold text-lg"
                >
                  #{num}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                setShowPositionVerifier(false);
                setJustJoinedLift('');
              }}
              className="w-full py-2 text-gray-500 text-sm"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Manual Verifier Modal */}
      {showManualVerifier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">How many people are waiting?</h3>
              <button
                onClick={() => setShowManualVerifier(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Lift {selectedLift} • Your update helps the community
            </p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <button
                  key={num}
                  onClick={() => handleManualVerify(num)}
                  className="py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                >
                  {num}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowManualVerifier(false)}
              className="w-full py-2 text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Real-time Status */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Community-Powered Queue</p>
            <p className="text-xs text-blue-600">
              Digital: {queueLength} • Verified: {verifiedQueue || '?'} • {recentVerifications.length} verifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

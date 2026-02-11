'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, AlertCircle, MapPin, Info, Car } from 'lucide-react';

export default function RetrievePage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [queueA, setQueueA] = useState(0);
  const [queueB, setQueueB] = useState(0);
  const [userInQueue, setUserInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState({ A: 0, B: 0 });
  const [userCode, setUserCode] = useState('____');
  const [userPallet, setUserPallet] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const [estimatedPalletTime, setEstimatedPalletTime] = useState({ min: 2, max: 4 });
  const [suggestedLift, setSuggestedLift] = useState(null);
  const [totalWaitTime, setTotalWaitTime] = useState({ A: 0, B: 0 });
  const [showTimeBreakdown, setShowTimeBreakdown] = useState(false);

  // Load user's data from localStorage
  useEffect(() => {
    // This only runs in the browser
    const savedCode = localStorage.getItem('parkingCode');
    if (savedCode) setUserCode(savedCode);
    
    const savedPallet = localStorage.getItem('lastParkingPallet');
    if (savedPallet) {
      setUserPallet(savedPallet);
      
      // Calculate level (1-7)
      const level = Math.ceil(parseInt(savedPallet) / 8);
      setUserLevel(level);
      
      // Calculate pallet-specific retrieval time
      // Base 2 minutes + 0.5 minutes per level above 1
      const baseTime = 2;
      const levelTime = (level - 1) * 0.5;
      const minTime = Math.round((baseTime + levelTime) * 10) / 10;
      const maxTime = Math.round((minTime + 1) * 10) / 10;
      setEstimatedPalletTime({ min: minTime, max: maxTime });
      
      // Suggest lift based on pallet pattern (odd = A, even = B)
      const palletNum = parseInt(savedPallet);
      setSuggestedLift(palletNum % 2 === 1 ? 'A' : 'B');
    }
  }, []);

  // Calculate total wait time (queue + pallet retrieval)
  useEffect(() => {
    const queueTimeA = queueA * 3; // 3 minutes per person in queue
    const queueTimeB = queueB * 3;
    
    const palletTime = estimatedPalletTime.min; // Use min estimate
    
    setTotalWaitTime({
      A: queueTimeA + palletTime,
      B: queueTimeB + palletTime
    });
    
    // Update lift estimated times (just queue times)
    setEstimatedTime({
      A: queueTimeA,
      B: queueTimeB
    });
  }, [queueA, queueB, estimatedPalletTime]);

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
    
    // Auto-leave after 20 minutes (extended for actual retrieval)
    setTimeout(() => {
      leaveQueue(lift);
    }, 20 * 60 * 1000);
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

  // Calculate smart suggestion
  const getSuggestedLift = () => {
    if (!suggestedLift) return null;
    
    const suggestedQueue = suggestedLift === 'A' ? queueA : queueB;
    const otherLift = suggestedLift === 'A' ? 'B' : 'A';
    const otherQueue = otherLift === 'A' ? queueA : queueB;
    
    // If suggested lift has 2+ more people than other, suggest switching
    if (suggestedQueue >= otherQueue + 2) {
      return {
        bestChoice: otherLift,
        reason: `Lift ${otherLift} has ${otherQueue} fewer people waiting`
      };
    }
    
    return {
      bestChoice: suggestedLift,
      reason: userPallet ? 
        `Your pallet ${userPallet} is typically served by Lift ${suggestedLift}` :
        'Based on typical lift pattern'
    };
  };

  const suggestion = getSuggestedLift();

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

      {/* User's Information Card */}
      <div className="mb-6 status-card">
        <h3 className="font-medium text-gray-900 mb-3">Your Parking Details</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Retrieval Code</div>
            <div className="text-2xl font-mono font-bold">{userCode}</div>
          </div>
          
          {userPallet ? (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" />
                Pallet Location
              </div>
              <div className="text-xl font-bold">#{userPallet}</div>
              <div className="text-xs text-gray-500">Level {userLevel}/7</div>
            </div>
          ) : (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Pallet</div>
              <div className="text-lg font-bold text-gray-400">Not recorded</div>
              <div className="text-xs text-gray-500">
                <Link href="/checkin" className="text-blue-600">Add pallet next time</Link>
              </div>
            </div>
          )}
        </div>

        {/* Estimated Retrieval Time */}
        {userPallet && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Estimated retrieval time</div>
                <div className="text-lg font-bold">
                  {estimatedPalletTime.min}-{estimatedPalletTime.max} minutes
                </div>
                <div className="text-xs text-gray-500">
                  Based on Level {userLevel} location
                </div>
              </div>
              <button
                onClick={() => setShowTimeBreakdown(!showTimeBreakdown)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            
            {showTimeBreakdown && (
              <div className="mt-2 pt-2 border-t border-yellow-200">
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Base time (ground):</span>
                    <span>2 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level {userLevel} adjustment:</span>
                    <span>+{(userLevel - 1) * 0.5} minutes</span>
                  </div>
                  <div className="flex justify-between font-bold mt-1">
                    <span>Total lift movement:</span>
                    <span>{estimatedPalletTime.min} minutes</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Plus queue time below
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Smart Suggestion */}
      {suggestion && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Car className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Smart Suggestion</h4>
              <p className="text-sm text-blue-800 mt-1">
                Consider <span className="font-bold">Lift {suggestion.bestChoice}</span>
              </p>
              <p className="text-xs text-blue-700 mt-1">{suggestion.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lift Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Lift</h2>
        <div className="space-y-4">
          {/* Lift A Card */}
          <div className={`status-card ${selectedLift === 'A' ? 'ring-2 ring-parking-blue' : ''} ${suggestion?.bestChoice === 'A' ? 'border-blue-300' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-parking-green rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  {suggestion?.bestChoice === 'A' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
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
                <div className="text-sm text-gray-500">
                  ~{estimatedTime.A} min queue
                </div>
                {userPallet && (
                  <div className="text-xs text-gray-600">
                    +{estimatedPalletTime.min} min retrieval
                  </div>
                )}
              </div>
            </div>
            
            {/* Total Wait Time */}
            <div className="mb-3 p-2 bg-gray-50 rounded text-center">
              <div className="text-sm text-gray-600">Total estimated wait</div>
              <div className="text-xl font-bold">{totalWaitTime.A.toFixed(1)} minutes</div>
            </div>
            
            {userInQueue && selectedLift === 'A' ? (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">You're in queue</p>
                    <p className="text-sm text-blue-700">Position #{queuePosition}</p>
                    <p className="text-xs text-blue-600">
                      Est. completion: {totalWaitTime.A.toFixed(1)} min
                    </p>
                  </div>
                  <button
                    onClick={() => leaveQueue('A')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 text-sm"
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
          <div className={`status-card ${selectedLift === 'B' ? 'ring-2 ring-parking-blue' : ''} ${suggestion?.bestChoice === 'B' ? 'border-blue-300' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-parking-green rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    B
                  </div>
                  {suggestion?.bestChoice === 'B' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
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
                <div className="text-sm text-gray-500">
                  ~{estimatedTime.B} min queue
                </div>
                {userPallet && (
                  <div className="text-xs text-gray-600">
                    +{estimatedPalletTime.min} min retrieval
                  </div>
                )}
              </div>
            </div>
            
            {/* Total Wait Time */}
            <div className="mb-3 p-2 bg-gray-50 rounded text-center">
              <div className="text-sm text-gray-600">Total estimated wait</div>
              <div className="text-xl font-bold">{totalWaitTime.B.toFixed(1)} minutes</div>
            </div>
            
            {userInQueue && selectedLift === 'B' ? (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">You're in queue</p>
                    <p className="text-sm text-blue-700">Position #{queuePosition}</p>
                    <p className="text-xs text-blue-600">
                      Est. completion: {totalWaitTime.B.toFixed(1)} min
                    </p>
                  </div>
                  <button
                    onClick={() => leaveQueue('B')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 text-sm"
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

      {/* Time Tracking Feature */}
      {userInQueue && (
        <div className="mb-6 status-card bg-green-50 border-green-200">
          <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Tracking Active
          </h3>
          <p className="text-sm text-green-800 mb-3">
            We're tracking your retrieval time to improve estimates for everyone.
            Please tap "Leave Queue" when you get your car.
          </p>
          <div className="text-xs text-green-700">
            <div className="flex justify-between">
              <span>Queue position:</span>
              <span className="font-bold">#{queuePosition}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated total wait:</span>
              <span className="font-bold">
                {selectedLift === 'A' ? totalWaitTime.A.toFixed(1) : totalWaitTime.B.toFixed(1)} minutes
              </span>
            </div>
          </div>
        </div>
      )}

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
            <span>Go to touchscreen and tap "RETRIEVE VEHICLE"</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">3.</span>
            <span>Enter code: <span className="font-mono font-bold">{userCode}</span></span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">4.</span>
            <span>System shows pallet {userPallet ? `#${userPallet}` : 'number'}</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">5.</span>
            <span>Wait for lift to deliver your car</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold w-6">6.</span>
            <span><strong>Important:</strong> Tap "Leave Queue" when done</span>
          </li>
        </ol>
        
        {userPallet && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your car on Level {userLevel} will take approximately{' '}
              {estimatedPalletTime.min} minutes for the lift to retrieve, plus queue time.
            </p>
          </div>
        )}
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
                <p className="text-sm text-gray-600">
                  {queueA} {queueA === 1 ? 'person' : 'people'} waiting
                </p>
                {queueA > 0 && (
                  <p className="text-xs text-gray-500">
                    ~{estimatedTime.A} min queue time
                  </p>
                )}
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
                <p className="text-sm text-gray-600">
                  {queueB} {queueB === 1 ? 'person' : 'people'} waiting
                </p>
                {queueB > 0 && (
                  <p className="text-xs text-gray-500">
                    ~{estimatedTime.B} min queue time
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{queueB}</div>
              <div className="text-sm text-gray-600">in line</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Queue time per person:</span>
              <span>~3 minutes</span>
            </div>
            {userPallet && (
              <div className="flex justify-between">
                <span>Pallet retrieval (Level {userLevel}):</span>
                <span>~{estimatedPalletTime.min} minutes</span>
              </div>
            )}
            <div className="flex justify-between font-medium mt-1">
              <span>Total = Queue + Retrieval</span>
              <span>Shown above</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

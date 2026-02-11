'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Bell, Info, MapPin } from 'lucide-react';

export default function CheckInPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [code, setCode] = useState('');
  const [palletNumber, setPalletNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showPalletInfo, setShowPalletInfo] = useState(false);

  // Calculate level from pallet (for display only)
  const calculateLevel = () => {
    if (!palletNumber || isNaN(palletNumber) || palletNumber < 1 || palletNumber > 56) {
      return null;
    }
    return Math.ceil(parseInt(palletNumber) / 8);
  };

  const level = calculateLevel();

  // Calculate estimated retrieval time based on level
  const calculateEstimatedTime = () => {
    if (!level) return { min: 2, max: 4 }; // Default if unknown
    
    const baseTime = 2; // Base 2 minutes for ground level
    const perLevel = 0.5; // +30 seconds per level
    
    const minTime = baseTime + ((level - 1) * perLevel);
    const maxTime = minTime + 1; // Add 1 minute variance
    
    return {
      min: Math.round(minTime * 10) / 10, // Keep 1 decimal
      max: Math.round(maxTime * 10) / 10
    };
  };

  const estimatedTime = calculateEstimatedTime();

  const handleSave = () => {
    if (code.length === 4 && selectedLift) {
      // Save to localStorage
      localStorage.setItem('parkingCode', code);
      localStorage.setItem('lastParkingLift', selectedLift);
      localStorage.setItem('lastParkingTime', new Date().toISOString());
      
      // Save pallet if provided
      if (palletNumber && parseInt(palletNumber) >= 1 && parseInt(palletNumber) <= 56) {
        localStorage.setItem('lastParkingPallet', palletNumber);
        
        // Also save estimated lift based on pallet pattern
        // Assuming alternating: odd = Lift A, even = Lift B
        const palletNum = parseInt(palletNumber);
        const estimatedLift = palletNum % 2 === 1 ? 'A' : 'B';
        localStorage.setItem('estimatedLiftFromPallet', estimatedLift);
      }
      
      setIsSaved(true);
      
      // Show success message
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
  };

  // Load previous pallet if exists
  useEffect(() => {
    const savedPallet = localStorage.getItem('lastParkingPallet');
    if (savedPallet) {
      setPalletNumber(savedPallet);
    }
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Check In Car</h1>
        <p className="text-gray-600">Record where you parked</p>
      </header>

      {/* Lift Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Lift</h2>
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
        <p className="text-sm text-gray-500 mt-2 text-center">
          If you don't know, you can skip this and enter pallet number below
        </p>
      </div>

      {/* Pallet Number Input */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Pallet Number (Optional)
          </h2>
          <button
            onClick={() => setShowPalletInfo(!showPalletInfo)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        
        {showPalletInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How to find your pallet:</strong>
              <br />
              1. After parking, check the display screen
              <br />
              2. Look for your license plate or 4-digit code
              <br />
              3. Note the pallet number shown (1-56)
              <br />
              4. Enter it here for better time estimates
            </p>
          </div>
        )}
        
        <p className="text-gray-600 mb-4 text-sm">
          Enter your pallet number (1-56) for accurate retrieval time estimates.
          This helps us calculate average wait times.
        </p>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Pallet 1-56 (7 levels × 8 pallets)</span>
          </div>
          
          <input
            type="number"
            min="1"
            max="56"
            value={palletNumber}
            onChange={(e) => {
              const val = e.target.value;
              // Allow empty or valid numbers 1-56
              if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 56)) {
                setPalletNumber(val);
              }
            }}
            placeholder="e.g., 12"
            className="w-full text-2xl font-mono text-center py-4 border-2 border-gray-300 rounded-xl focus:border-parking-blue focus:outline-none"
          />
          
          {/* Pallet Info Display */}
          {palletNumber && level && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Level</div>
                  <div className="text-xl font-bold">{level}/7</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Est. Retrieval</div>
                  <div className="text-xl font-bold">{estimatedTime.min}-{estimatedTime.max} min</div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm text-gray-500">
                {parseInt(palletNumber) % 2 === 1 ? 
                  'Likely Lift A (odd pallets)' : 
                  'Likely Lift B (even pallets)'
                }
              </div>
            </div>
          )}
          
          {/* Quick pallet buttons */}
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Common pallets by level:</p>
            <div className="flex flex-wrap gap-2">
              {[1, 9, 17, 25, 33, 41, 49].map((startPallet) => (
                <button
                  key={startPallet}
                  onClick={() => setPalletNumber(startPallet.toString())}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Level {Math.ceil(startPallet/8)}: {startPallet}-{startPallet+7}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Code Input */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          4-Digit Code (Required)
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Enter the last 4 digits of your license plate or any code you'll remember.
          Use this same code to retrieve your car.
        </p>
        
        <div className="relative">
          <input
            type="text"
            maxLength="4"
            pattern="\d*"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="1234"
            className="w-full text-3xl font-mono text-center py-4 border-2 border-gray-300 rounded-xl focus:border-parking-blue focus:outline-none"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1,2,3,4,5,6,7,8,9,'⌫',0,'Clear'].map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (num === '⌫') setCode(code.slice(0, -1));
                  else if (num === 'Clear') setCode('');
                  else if (code.length < 4) setCode(code + num);
                }}
                className="py-3 bg-gray-100 rounded-lg font-medium text-lg hover:bg-gray-200 active:bg-gray-300"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">Your code will be saved for:</div>
          <div className="font-mono font-bold text-lg">{code || '____'}</div>
        </div>
      </div>

      {/* Reminder Setting */}
      <div className="mb-8 status-card">
        <div className="flex items-center gap-3 mb-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Set Reminder</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Get reminded of your parking code when you usually leave.
        </p>
        <select className="w-full p-3 border border-gray-300 rounded-lg">
          <option>No reminder</option>
          <option>6:00 PM today</option>
          <option>7:00 PM today</option>
          <option>8:00 PM today</option>
          <option>Set custom time...</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!selectedLift || code.length !== 4}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {isSaved ? '✓ Saved Successfully!' : 'Confirm Parking'}
      </button>

      {/* Success Message */}
      {isSaved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-800 text-center">
            <div className="font-bold">Parking details saved!</div>
            <div className="text-sm mt-1">
              {palletNumber ? `Pallet ${palletNumber} (Level ${level})` : 'Pallet not recorded'}
              {' • '}
              Code: <span className="font-mono font-bold">{code}</span>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          How This Helps Everyone
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li className="flex gap-2">
            <span>•</span>
            <span><strong>Pallet tracking</strong> helps calculate accurate retrieval times</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span><strong>Level data</strong> shows if higher levels take longer</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span><strong>Future feature:</strong> Predict queue times based on car location</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span><strong>Anonymous data</strong> improves the system for all residents</span>
          </li>
        </ul>
        
        <div className="mt-4 pt-3 border-t border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">How to Retrieve:</h5>
          <ol className="text-blue-700 text-sm list-decimal list-inside space-y-1">
            <li>Go to the touchscreen near the lifts</li>
            <li>Tap "RETRIEVE VEHICLE"</li>
            <li>Enter your 4-digit code: <span className="font-mono font-bold">{code || '____'}</span></li>
            <li>System will show your pallet number</li>
            <li>Wait for lift to deliver your car</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

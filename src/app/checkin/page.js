'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Bell, Info, MapPin, Edit } from 'lucide-react';

export default function CheckInPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [code, setCode] = useState('');
  const [palletNumber, setPalletNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showPalletInfo, setShowPalletInfo] = useState(false);
  const [hasExistingParking, setHasExistingParking] = useState(false);

  // Load previous data if exists - SAFELY in useEffect
  useEffect(() => {
    // This only runs in the browser
    const savedCode = localStorage.getItem('parkingCode');
    const savedPallet = localStorage.getItem('lastParkingPallet');
    const savedLift = localStorage.getItem('lastParkingLift');
    
    if (savedCode) setCode(savedCode);
    if (savedPallet) setPalletNumber(savedPallet);
    if (savedLift) setSelectedLift(savedLift);
    
    // Check if user has existing parking data
    if (savedCode && savedLift) {
      setHasExistingParking(true);
    }
  }, []);

  const calculateLevel = () => {
    if (!palletNumber || isNaN(palletNumber) || palletNumber < 1 || palletNumber > 56) {
      return null;
    }
    return Math.ceil(parseInt(palletNumber) / 8);
  };

  const level = calculateLevel();

  const handleSave = () => {
    if (code.length === 4 && selectedLift) {
      // Save all data
      localStorage.setItem('parkingCode', code);
      localStorage.setItem('lastParkingLift', selectedLift);
      localStorage.setItem('lastParkingTime', new Date().toISOString());
      
      // Save pallet if provided
      if (palletNumber && parseInt(palletNumber) >= 1 && parseInt(palletNumber) <= 56) {
        localStorage.setItem('lastParkingPallet', palletNumber);
        
        // Also save estimated lift based on pallet pattern (for verification)
        const palletNum = parseInt(palletNumber);
        const estimatedLift = palletNum % 2 === 1 ? 'A' : 'B';
        localStorage.setItem('estimatedLiftFromPallet', estimatedLift);
      } else {
        // Remove pallet if cleared
        localStorage.removeItem('lastParkingPallet');
      }
      
      setIsSaved(true);
      setHasExistingParking(true);
      
      // Show success message
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
  };

  const handleUpdatePalletOnly = () => {
    if (palletNumber && parseInt(palletNumber) >= 1 && parseInt(palletNumber) <= 56) {
      localStorage.setItem('lastParkingPallet', palletNumber);
      
      // Update estimated lift
      const palletNum = parseInt(palletNumber);
      const estimatedLift = palletNum % 2 === 1 ? 'A' : 'B';
      localStorage.setItem('estimatedLiftFromPallet', estimatedLift);
      
      alert(`✅ Pallet updated to #${palletNumber} (Level ${level})`);
    } else if (palletNumber === '') {
      localStorage.removeItem('lastParkingPallet');
      alert('✅ Pallet number removed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {hasExistingParking ? 'Update Parking' : 'Check In Car'}
        </h1>
        <p className="text-gray-600">
          {hasExistingParking ? 'Update your parking details' : 'Record where you parked'}
        </p>
        
        {hasExistingParking && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              You have existing parking data. You can update your details.
            </p>
          </div>
        )}
      </header>

      {/* STEP 1: Lift Selection - REQUIRED */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          1. Select Lift <span className="text-red-500">*</span>
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          Which lift did you park your car in?
        </p>
        
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
        
        {/* Lift selection validation */}
        {!selectedLift && (
          <div className="mt-2 text-sm text-red-600">
            Please select a lift to continue
          </div>
        )}
        
        {/* Current selection display */}
        {selectedLift && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg text-center">
            <span className="text-green-800 font-medium">Selected: Lift {selectedLift}</span>
          </div>
        )}
      </div>

      {/* STEP 2: Code Input - REQUIRED */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          2. 4-Digit Code <span className="text-red-500">*</span>
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
          <div className="text-sm text-gray-600">Your retrieval code:</div>
          <div className="font-mono font-bold text-lg text-parking-blue">{code || '____'}</div>
          {code.length !== 4 && (
            <div className="text-sm text-red-600 mt-1">
              Please enter 4 digits
            </div>
          )}
        </div>
      </div>

      {/* STEP 3: Pallet Number Input - OPTIONAL */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            3. Pallet Number <span className="text-gray-500 text-sm">(Optional)</span>
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
              <strong>How to find/update your pallet:</strong>
              <br />
              1. After parking, check the display screen
              <br />
              2. Look for your license plate or 4-digit code
              <br />
              3. Note the pallet number shown (1-56)
              <br />
              4. You can update this later if you forgot
            </p>
          </div>
        )}
        
        <p className="text-gray-600 mb-4 text-sm">
          Enter your pallet number (1-56) for accurate retrieval time estimates.
          <span className="text-gray-500"> Optional but recommended.</span>
        </p>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Pallet 1-56 (7 levels × 8 pallets)</span>
          </div>
          
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="56"
              value={palletNumber}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 56)) {
                  setPalletNumber(val);
                }
              }}
              placeholder="e.g., 12"
              className="flex-1 text-2xl font-mono text-center py-4 border-2 border-gray-300 rounded-xl focus:border-parking-blue focus:outline-none"
            />
            
            {hasExistingParking && (
              <button
                onClick={handleUpdatePalletOnly}
                className="px-4 py-4 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 flex items-center gap-2"
                title="Update pallet only"
              >
                <Edit className="w-4 h-4" />
                Update
              </button>
            )}
          </div>
          
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
                  <div className="text-xl font-bold">
                    {2 + (level - 1) * 0.5}-{3 + (level - 1) * 0.5} min
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm">
                <span className={`font-medium ${
                  selectedLift && 
                  ((parseInt(palletNumber) % 2 === 1 && selectedLift === 'A') ||
                   (parseInt(palletNumber) % 2 === 0 && selectedLift === 'B'))
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}>
                  {parseInt(palletNumber) % 2 === 1 ? 
                    'Typically Lift A (odd pallets)' : 
                    'Typically Lift B (even pallets)'
                  }
                  {selectedLift && 
                    ((parseInt(palletNumber) % 2 === 1 && selectedLift !== 'A') ||
                     (parseInt(palletNumber) % 2 === 0 && selectedLift !== 'B'))
                    ? ' - Note: Different from your selected lift'
                    : ' - Matches your selection ✓'
                  }
                </span>
              </div>
            </div>
          )}
          
          {/* Quick pallet buttons */}
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Quick select by level:</p>
            <div className="flex flex-wrap gap-2">
              {[1, 9, 17, 25, 33, 41, 49].map((startPallet) => (
                <button
                  key={startPallet}
                  onClick={() => setPalletNumber(startPallet.toString())}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  L{Math.ceil(startPallet/8)}: {startPallet}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Setting */}
      <div className="mb-8 status-card">
        <div className="flex items-center gap-3 mb-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Set Reminder (Optional)</h3>
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

      {/* Save/Update Button */}
      <button
        onClick={handleSave}
        disabled={!selectedLift || code.length !== 4}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {hasExistingParking ? 'Update Parking' : 'Save Parking Details'}
      </button>

      {/* Success Message */}
      {isSaved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-800 text-center">
            <div className="font-bold">✓ Parking details saved!</div>
            <div className="text-sm mt-1">
              Lift: <span className="font-bold">{selectedLift}</span>
              {' • '}
              Code: <span className="font-mono font-bold">{code}</span>
              {palletNumber && ` • Pallet: ${palletNumber} (L${level})`}
            </div>
            <div className="text-xs text-green-700 mt-2">
              You can update pallet later if needed
            </div>
          </div>
        </div>
      )}

      {/* Update Instructions */}
      {hasExistingParking && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Need to update?</h4>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Change lift?</strong> Select different lift above</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Change code?</strong> Enter new 4-digit code</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Add/update pallet?</strong> Enter pallet number and click "Update" button</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Then click "Save Parking Details"</strong> to save all changes</span>
            </li>
          </ul>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Important Notes
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li className="flex gap-2">
            <span>1.</span>
            <span><strong>Lift is required</strong> - You must know which lift (A or B)</span>
          </li>
          <li className="flex gap-2">
            <span>2.</span>
            <span><strong>4-digit code is required</strong> - Use this to retrieve your car</span>
          </li>
          <li className="flex gap-2">
            <span>3.</span>
            <span><strong>Pallet is optional but helpful</strong> - Improves time estimates</span>
          </li>
          <li className="flex gap-2">
            <span>4.</span>
            <span><strong>You can update later</strong> - Return to add/update pallet number</span>
          </li>
        </ul>
        
        <div className="mt-4 pt-3 border-t border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">Retrieval Process:</h5>
          <ol className="text-blue-700 text-sm list-decimal list-inside space-y-1">
            <li>Go to touchscreen near lifts</li>
            <li>Tap "RETRIEVE VEHICLE"</li>
            <li>Enter your 4-digit code</li>
            <li>System shows your pallet number</li>
            <li>Wait for lift to deliver your car</li>
          </ol>
          <div className="mt-2 text-xs text-blue-600">
            Tip: If you forgot your pallet, the system will show it when you enter your code
          </div>
        </div>
      </div>
    </div>
  );
}

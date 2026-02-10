'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Bell } from 'lucide-react';

export default function CheckInPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [code, setCode] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (code.length === 4 && selectedLift) {
      localStorage.setItem('parkingCode', code);
      localStorage.setItem('lastParkingLift', selectedLift);
      localStorage.setItem('lastParkingTime', new Date().toISOString());
      setIsSaved(true);
      
      // Show success message
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
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
      </div>

      {/* Code Input */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          4-Digit Code (Optional)
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
        disabled={!selectedLift}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
      >
        <Save className="w-5 h-5" />
        {isSaved ? 'Saved Successfully!' : 'Confirm Parking'}
      </button>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">How to Retrieve:</h4>
        <ol className="text-blue-700 text-sm list-decimal list-inside space-y-1">
          <li>Go to the touchscreen near the lifts</li>
          <li>Tap "RETRIEVE VEHICLE"</li>
          <li>Enter your 4-digit code: <span className="font-mono font-bold">{code || '____'}</span></li>
          <li>System will show your pallet number</li>
          <li>Wait for lift to deliver your car</li>
        </ol>
      </div>
    </div>
  );
}
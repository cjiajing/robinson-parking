'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Bell, Info, MapPin, Edit } from 'lucide-react';

export default function CheckInPage() {
  // State only - no localStorage at top level
  const [selectedLift, setSelectedLift] = useState('');
  const [code, setCode] = useState('');
  const [palletNumber, setPalletNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showPalletInfo, setShowPalletInfo] = useState(false);
  const [hasExistingParking, setHasExistingParking] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [level, setLevel] = useState<number | null>(null);

  // Set client flag and load data
  useEffect(() => {
    setIsClient(true);
    
    // Now we can safely access localStorage
    const savedCode = localStorage.getItem('parkingCode');
    const savedPallet = localStorage.getItem('lastParkingPallet');
    const savedLift = localStorage.getItem('lastParkingLift');
    
    if (savedCode) setCode(savedCode);
    if (savedPallet) setPalletNumber(savedPallet);
    if (savedLift) setSelectedLift(savedLift);
    
    if (savedCode && savedLift) {
      setHasExistingParking(true);
    }
  }, []);

  // Calculate level in useEffect to avoid SSR issues
  useEffect(() => {
    if (!isClient || !palletNumber || isNaN(parseInt(palletNumber)) || parseInt(palletNumber) < 1 || parseInt(palletNumber) > 56) {
      setLevel(null);
      return;
    }
    
    const palletNum = parseInt(palletNumber);
    const calculatedLevel = Math.ceil(palletNum / 8);
    setLevel(calculatedLevel);
  }, [palletNumber, isClient]);

  const handleSave = () => {
    if (code.length === 4 && selectedLift && isClient) {
      // Save all data
      localStorage.setItem('parkingCode', code);
      localStorage.setItem('lastParkingLift', selectedLift);
      localStorage.setItem('lastParkingTime', new Date().toISOString());
      
      // Save pallet if provided
      if (palletNumber && parseInt(palletNumber) >= 1 && parseInt(palletNumber) <= 56) {
        localStorage.setItem('lastParkingPallet', palletNumber);
      } else {
        localStorage.removeItem('lastParkingPallet');
      }
      
      setIsSaved(true);
      setHasExistingParking(true);
      
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleUpdatePalletOnly = () => {
    if (isClient && palletNumber && parseInt(palletNumber) >= 1 && parseInt(palletNumber) <= 56) {
      localStorage.setItem('lastParkingPallet', palletNumber);
      alert(`✅ Pallet updated to #${palletNumber} ${level ? `(Level ${level})` : ''}`);
    } else if (isClient && palletNumber === '') {
      localStorage.removeItem('lastParkingPallet');
      alert('✅ Pallet number removed');
    }
  };

  // Don't render localStorage-dependent UI during SSR
  if (!isClient) {
    return (
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Check In Car</h1>
          <p className="text-gray-600">Loading...</p>
        </header>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parking-blue mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading parking form...</p>
        </div>
      </div>
    );
  }

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
      </header>

      {/* STEP 1: Lift Selection */}
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

      {/* STEP 2: Code Input */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          2. 4-Digit Code <span className="text-red-500">*</span>
        </h2>
        <div className="relative">
          <input
            type="text"
            maxLength={4}
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
                  else if (code.length < 4) setCode(code + num.toString());
                }}
                className="py-3 bg-gray-100 rounded-lg font-medium text-lg hover:bg-gray-200"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 3: Pallet Number */}
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
              Enter pallet number (1-56) for better time estimates
            </p>
          </div>
        )}
        
        <div className="relative">
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
                className="px-4 py-4 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300"
                title="Update pallet only"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!selectedLift || code.length !== 4}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {hasExistingParking ? 'Update Parking' : 'Save Parking Details'}
      </button>

      {/* Success Message */}
      {isSaved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-800 text-center">
            <div className="font-bold">✓ Parking details saved!</div>
          </div>
        </div>
      )}
    </div>
  );
}

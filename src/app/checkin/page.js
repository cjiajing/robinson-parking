'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Info, Edit, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function CheckInPage() {
  const [selectedLift, setSelectedLift] = useState('');
  const [code, setCode] = useState('');
  const [palletNumber, setPalletNumber] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showPalletInfo, setShowPalletInfo] = useState(false);
  const [hasExistingParking, setHasExistingParking] = useState(false);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [level, setLevel] = useState(null);
  const [parkingId, setParkingId] = useState(null);

  // Generate or get user ID
  useEffect(() => {
    let storedId = localStorage.getItem('parking-user-id');
    if (!storedId) {
      storedId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('parking-user-id', storedId);
    }
    setUserId(storedId);
  }, []);

  // Load existing parking from Supabase
  useEffect(() => {
    if (!userId) return;

    async function loadParking() {
      const { data, error } = await supabase
        .from('user_parking')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setSelectedLift(data.lift);
        setCode(data.code);
        setPalletNumber(data.pallet || '');
        setParkingId(data.id);
        setHasExistingParking(true);
        
        if (data.pallet) {
          const palletNum = parseInt(data.pallet);
          if (!isNaN(palletNum) && palletNum >= 1 && palletNum <= 56) {
            setLevel(Math.ceil(palletNum / 8));
          }
        }
      }
      
      setIsLoading(false);
    }

    loadParking();
  }, [userId]);

  // Calculate level when pallet changes
  useEffect(() => {
    if (!palletNumber || isNaN(parseInt(palletNumber)) || parseInt(palletNumber) < 1 || parseInt(palletNumber) > 56) {
      setLevel(null);
      return;
    }
    setLevel(Math.ceil(parseInt(palletNumber) / 8));
  }, [palletNumber]);

  const handleSave = async () => {
    if (code.length === 4 && selectedLift && userId) {
      
      const parkingData = {
        user_id: userId,
        lift: selectedLift,
        code: code,
        pallet: palletNumber || null,
        level: level,
        updated_at: new Date().toISOString()
      };

      let error;

      if (parkingId) {
        // Update existing
        ({ error } = await supabase
          .from('user_parking')
          .update(parkingData)
          .eq('id', parkingId));
      } else {
        // Insert new
        ({ error } = await supabase
          .from('user_parking')
          .insert([parkingData]));
      }

      if (!error) {
        setIsSaved(true);
        setHasExistingParking(true);
        
        // Also save to localStorage as backup
        localStorage.setItem('parkingCode', code);
        localStorage.setItem('lastParkingLift', selectedLift);
        if (palletNumber) localStorage.setItem('lastParkingPallet', palletNumber);
        localStorage.setItem('lastParkingTime', new Date().toISOString());
        
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        alert('Failed to save parking details');
        console.error(error);
      }
    }
  };

  const handleUpdatePalletOnly = async () => {
    if (!userId || !parkingId) return;
    
    const palletValue = palletNumber || null;
    
    const { error } = await supabase
      .from('user_parking')
      .update({ 
        pallet: palletValue,
        level: level,
        updated_at: new Date().toISOString()
      })
      .eq('id', parkingId);

    if (!error) {
      if (palletNumber) {
        localStorage.setItem('lastParkingPallet', palletNumber);
        alert(`✅ Pallet updated to #${palletNumber} ${level ? `(Level ${level})` : ''}`);
      } else {
        localStorage.removeItem('lastParkingPallet');
        alert('✅ Pallet number removed');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Check In Car</h1>
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

        {level && (
          <p className="mt-2 text-sm text-gray-600">
            Level {level} {palletNumber && `(Pallets ${(level-1)*8+1}-${level*8})`}
          </p>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!selectedLift || code.length !== 4}
        className="w-full bg-parking-blue text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {hasExistingParking ? 'Update Parking' : 'Save Parking Details'}
      </button>

      {/* Success Message */}
      {isSaved && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Parking saved!</p>
            <p className="text-sm text-green-600">
              Lift {selectedLift} • Code {code}
              {palletNumber && ` • Pallet ${palletNumber}`}
            </p>
          </div>
        </div>
      )}

      {/* Sync Status */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">✓ Cloud Sync</span> - Your parking spot is saved and will appear on all your devices
        </p>
      </div>
    </div>
  );
}

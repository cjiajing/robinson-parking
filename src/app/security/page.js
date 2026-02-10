'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Shield, Car, UserPlus, Search, 
  Eye, EyeOff, CheckCircle, XCircle 
} from 'lucide-react';

export default function SecurityPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Security data
  const [carsInSystem, setCarsInSystem] = useState([
    { id: 1, licensePlate: 'SGF1234A', lift: 'A', level: 3, pallet: 12, code: '1234', parkedSince: '08:30' },
    { id: 2, licensePlate: 'SKR5678B', lift: 'B', level: 2, pallet: 8, code: '5678', parkedSince: '09:15' },
    { id: 3, licensePlate: 'SJJ9101C', lift: 'A', level: 5, pallet: 3, code: '9101', parkedSince: '10:45' },
  ]);
  
  const [searchPlate, setSearchPlate] = useState('');
  const [newCar, setNewCar] = useState({
    licensePlate: '',
    lift: 'A',
    level: '1',
    pallet: '',
    code: ''
  });

  const securityPassword = 'Security2024'; // Simple password for demo

const handleLogin = () => {
    if (password === securityPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('securityAuthenticated', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  // SAFELY check authentication
  useEffect(() => {
    const auth = localStorage.getItem('securityAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('securityAuthenticated');
    setPassword('');
  };

  const addCarToSystem = () => {
    if (!newCar.licensePlate || !newCar.code) {
      alert('Please enter license plate and code');
      return;
    }

    const newCarEntry = {
      id: carsInSystem.length + 1,
      licensePlate: newCar.licensePlate.toUpperCase(),
      lift: newCar.lift,
      level: parseInt(newCar.level),
      pallet: parseInt(newCar.pallet) || 0,
      code: newCar.code,
      parkedSince: new Date().toLocaleTimeString('en-SG', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };

    setCarsInSystem([...carsInSystem, newCarEntry]);
    
    // Reset form
    setNewCar({
      licensePlate: '',
      lift: 'A',
      level: '1',
      pallet: '',
      code: ''
    });

    alert('Car added to system');
  };

  const removeCar = (id) => {
    setCarsInSystem(carsInSystem.filter(car => car.id !== id));
  };

  const filteredCars = carsInSystem.filter(car =>
    car.licensePlate.toLowerCase().includes(searchPlate.toLowerCase()) ||
    car.code.includes(searchPlate)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Security Portal</h1>
            <p className="text-gray-600 mt-2">Robinson Suites Security</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                placeholder="Enter security password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
          >
            Access Security Portal
          </button>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800 text-center">
              For Robinson Suites security personnel only
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-4 h-4" />
            Back to User View
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Security Portal</h1>
            <p className="text-gray-600">Vehicle Tracking & Management</p>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="mb-6 status-card">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-gray-600" />
          <h2 className="font-medium text-gray-900">Search Vehicles</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value)}
            placeholder="Search by license plate or code..."
            className="w-full p-3 border border-gray-300 rounded-lg pl-10"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Cars in System */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Cars in System ({carsInSystem.length})
          </h2>
          <div className="text-sm text-gray-500">
            {filteredCars.length} shown
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Car className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p>No cars found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCars.map((car) => (
              <div key={car.id} className="status-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-lg font-bold text-gray-900">
                        {car.licensePlate}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        car.lift === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Lift {car.lift}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Level {car.level} • Pallet {car.pallet || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Code: <span className="font-mono font-bold">{car.code}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeCar(car.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Parked at: {car.parkedSince}</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Car */}
      <div className="status-card">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Add New Vehicle</h2>
        </div>

        <div className="space-y-4">
          {/* License Plate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Plate
            </label>
            <input
              type="text"
              value={newCar.licensePlate}
              onChange={(e) => setNewCar({...newCar, licensePlate: e.target.value})}
              placeholder="e.g., SGF1234A"
              className="w-full p-3 border border-gray-300 rounded-lg uppercase"
            />
          </div>

          {/* Lift, Level, Pallet */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lift
              </label>
              <select
                value={newCar.lift}
                onChange={(e) => setNewCar({...newCar, lift: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="A">Lift A</option>
                <option value="B">Lift B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={newCar.level}
                onChange={(e) => setNewCar({...newCar, level: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {[1,2,3,4,5,6,7].map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pallet
              </label>
              <input
                type="number"
                value={newCar.pallet}
                onChange={(e) => setNewCar({...newCar, pallet: e.target.value})}
                placeholder="e.g., 12"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* 4-Digit Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4-Digit Code
            </label>
            <input
              type="text"
              maxLength="4"
              value={newCar.code}
              onChange={(e) => setNewCar({...newCar, code: e.target.value.replace(/\D/g, '')})}
              placeholder="1234"
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-2xl font-mono"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={addCarToSystem}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
          >
            Add Vehicle to System
          </button>
        </div>
      </div>

      {/* Security Notes */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
        <h3 className="font-medium text-yellow-900 mb-2">Security Notes</h3>
        <p className="text-sm text-yellow-800">
          • Use this portal to track vehicles in case of disputes
          <br />
          • Add vehicles when owners forget to check in
          <br />
          • Remove vehicles after they've been retrieved
          <br />
          • Contact management for any discrepancies
        </p>
      </div>
    </div>
  );
}
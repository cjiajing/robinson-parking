'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar as CalendarIcon, Bell, AlertTriangle } from 'lucide-react';

export default function CalendarPage() {
  const [maintenanceSchedule, setMaintenanceSchedule] = useState([
    {
      id: 1,
      date: '2024-03-15',
      time: '22:00 - 02:00',
      type: 'Monthly Service',
      description: 'Both lifts unavailable. No overnight parking.',
      status: 'upcoming',
      confirmed: true
    },
    {
      id: 2,
      date: '2024-03-22',
      time: '14:00 - 16:00',
      type: 'Software Update',
      description: 'One lift at a time. Expect delays.',
      status: 'upcoming',
      confirmed: true
    },
    {
      id: 3,
      date: '2024-04-12',
      time: '23:00 - 03:00',
      type: 'Monthly Service',
      description: 'Both lifts unavailable.',
      status: 'upcoming',
      confirmed: true
    }
  ]);

  const [reminders, setReminders] = useState({
    '24_hours': false,
    '1_hour': true,
    'when_starts': false,
    'when_resolved': true
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleReminder = (key) => {
    setReminders(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Schedule</h1>
        <p className="text-gray-600">Planned maintenance and outages</p>
      </header>

      {/* Current Status */}
      <div className="mb-6 status-card">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h2 className="font-semibold text-gray-900">Current Status</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Next Maintenance</p>
            <p className="font-bold text-lg">Tonight, 10:00 PM</p>
          </div>
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Scheduled
          </div>
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Maintenance</h2>
        
        {maintenanceSchedule.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p>No maintenance scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {maintenanceSchedule.map((item) => (
              <div key={item.id} className="status-card border-l-4 border-yellow-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">
                        {item.type}
                      </div>
                      {item.confirmed && (
                        <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Confirmed
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {formatDate(item.date)}
                    </h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-gray-100 rounded text-sm">
                      ⏰ {item.time}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    item.status === 'upcoming' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reminder Settings */}
      <div className="status-card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { key: '24_hours', label: '24 hours before maintenance' },
            { key: '1_hour', label: '1 hour before maintenance' },
            { key: 'when_starts', label: 'When maintenance starts' },
            { key: 'when_resolved', label: 'When system is back online' }
          ].map((reminder) => (
            <div key={reminder.key} className="flex items-center justify-between">
              <label className="text-gray-700 cursor-pointer flex-1">
                {reminder.label}
              </label>
              <button
                onClick={() => toggleReminder(reminder.key)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  reminders[reminder.key] ? 'bg-parking-blue' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  reminders[reminder.key] ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 btn-primary py-3">
          Save Notification Settings
        </button>
      </div>

      {/* Important Notes */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-medium text-blue-900 mb-2">Important Notes</h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li className="flex gap-2">
            <span>•</span>
            <span>During maintenance, both lifts will be unavailable</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>No overnight parking during maintenance hours</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Plan your parking accordingly to avoid inconvenience</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Updates will be posted here if schedule changes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
// Mock data for the app
export const systemData = {
  status: 'operational',
  lastUpdated: new Date(),
  occupancy: 65,
  totalSpots: 112,
  lifts: {
    A: { status: 'normal', queue: 2 },
    B: { status: 'normal', queue: 0 }
  },
  alerts: [
    {
      id: 1,
      type: 'maintenance',
      title: 'Monthly Maintenance',
      description: 'Tonight 10:00 PM - 2:00 AM. Both lifts unavailable.',
      date: '2024-03-15',
      time: '22:00 - 02:00'
    }
  ],
  maintenanceSchedule: [
    {
      id: 1,
      date: '2024-03-15',
      time: '22:00 - 02:00',
      type: 'Monthly Service',
      description: 'Both lifts unavailable',
      status: 'upcoming'
    },
    {
      id: 2,
      date: '2024-03-22',
      time: '14:00 - 16:00',
      type: 'Software Update',
      description: 'One lift at a time',
      status: 'upcoming'
    }
  ],
  reportedIssues: []
};

export const queueData = {
  liftA: [],
  liftB: []
};
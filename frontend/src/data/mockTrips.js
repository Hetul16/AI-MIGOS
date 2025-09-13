// Mock trip data for testing
export const mockTrips = [
  {
    id: 'trip_001',
    title: 'Golden Triangle Adventure',
    destination: 'Delhi - Agra - Jaipur',
    start_date: '2025-01-15',
    end_date: '2025-01-22',
    duration: '7 days',
    travelers: 2,
    status: 'confirmed',
    budget: {
      total: 150000,
      spent: 45000,
      currency: 'INR'
    },
    summary: {
      destination: 'Delhi - Agra - Jaipur',
      center: { lat: 28.6139, lng: 77.2090 },
      days: [
        {
          date: '2025-01-15',
          activities: [
            {
              id: 'act_001',
              title: 'Arrival in Delhi',
              type: 'transport',
              time: '10:00 AM',
              cost: 2000
            },
            {
              id: 'act_002',
              title: 'Red Fort Visit',
              type: 'attraction',
              time: '3:00 PM',
              cost: 500
            }
          ]
        }
      ]
    },
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z'
  },
  {
    id: 'trip_002',
    title: 'Beach Paradise Getaway',
    destination: 'Goa',
    start_date: '2025-02-10',
    end_date: '2025-02-15',
    duration: '5 days',
    travelers: 4,
    status: 'pending',
    budget: {
      total: 80000,
      spent: 0,
      currency: 'INR'
    },
    summary: {
      destination: 'Goa',
      center: { lat: 15.2993, lng: 74.1240 },
      days: []
    },
    created_at: '2025-01-02T14:30:00Z',
    updated_at: '2025-01-02T14:30:00Z'
  }
];

export default mockTrips;

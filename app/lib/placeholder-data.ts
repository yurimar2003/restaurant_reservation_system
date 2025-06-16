// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

// Sample and first data
const users = [
  {
    name: 'Admin',
    email: 'admin@restaurant.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Sample Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer'
  }
];

const dining_tables = [
  { number: 1, capacity: 2 },
  { number: 2, capacity: 4 },
  { number: 3, capacity: 6 },
  { number: 4, capacity: 8 }
];

const reservations = [
  {
    user_id: 2, // Sample customer ID
    table_id: 1, // Table 1
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '19:00',
    people: 2,
    status: 'confirmed'
  },
  {
    user_id: 2,
    table_id: 3,
    date: new Date(Date.now() + 2*86400000).toISOString().split('T')[0], // Day after tomorrow
    time: '20:30',
    people: 5,
    status: 'pending'
  }
];

export { users, dining_tables , reservations };

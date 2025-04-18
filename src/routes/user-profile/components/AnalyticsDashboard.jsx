import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/* -------------------------------------------------------------------------- */
/*                               Static mock data                             */
/* -------------------------------------------------------------------------- */

const bookingsTrend = [
  { month: 'Nov', bookings: 120 },
  { month: 'Dec', bookings: 145 },
  { month: 'Jan', bookings: 98 },
  { month: 'Feb', bookings: 165 },
  { month: 'Mar', bookings: 210 },
  { month: 'Apr', bookings: 190 },
];

const revenueTrend = [
  { month: 'Nov', revenue: 24000 },
  { month: 'Dec', revenue: 29000 },
  { month: 'Jan', revenue: 18500 },
  { month: 'Feb', revenue: 31500 },
  { month: 'Mar', revenue: 40200 },
  { month: 'Apr', revenue: 36500 },
];

const hotelOccupancy = [
  { name: 'Marriott', occupancy: 80 },
  { name: 'Hilton', occupancy: 65 },
  { name: 'Hyatt', occupancy: 75 },
  { name: 'Four Seasons', occupancy: 55 },
];

/* -------------------------------------------------------------------------- */
/*                               Color palette                                */
/* -------------------------------------------------------------------------- */
// Tailwind brand‑flavored palette
const BRAND_PRIMARY = '#2563eb'; // blue-600
const BRAND_ACCENT = '#0ea5e9';  // sky-500
const BRAND_PURPLE = '#7c3aed';  // violet-600
const BRAND_AMBER  = '#f59e0b';  // amber-500
const BRAND_ROSE   = '#f43f5e';  // rose-500

const PIE_COLORS = [BRAND_PURPLE, BRAND_ACCENT, BRAND_AMBER, BRAND_ROSE];

/* -------------------------------------------------------------------------- */
/*                              Dashboard layout                              */
/* -------------------------------------------------------------------------- */

const AnalyticsDashboard = () => {
  return (
    <div className="container mx-auto p-4 my-10 space-y-6 min-h-[530px]">
      <h1 className="text-2xl font-bold text-brand mb-2">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bookings line chart */}
        <div className="bg-white rounded-lg shadow p-4 w-full">
          <h2 className="text-lg font-semibold mb-4">Bookings – last 6 months</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={bookingsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke={BRAND_PRIMARY} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue bar chart */}
        <div className="bg-white rounded-lg shadow p-4 w-full">
          <h2 className="text-lg font-semibold mb-4">Revenue (€) – last 6 months</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(val) => `€${val.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill={BRAND_ACCENT} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Occupancy pie chart */}
      <div className="bg-white rounded-lg shadow p-4 w-full">
        <h2 className="text-lg font-semibold mb-4">Current Occupancy by Hotel</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={hotelOccupancy}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="occupancy"
              nameKey="name"
            >
              {hotelOccupancy.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `${val}%`} />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

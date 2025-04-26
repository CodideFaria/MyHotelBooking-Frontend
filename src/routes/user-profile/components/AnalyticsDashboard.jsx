import React, { useState, useEffect, useMemo } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Color palette
const BRAND_ACCENT = '#0ea5e9';  // sky-500
const BRAND_PURPLE = '#7c3aed';  // violet-600
const BRAND_AMBER  = '#f59e0b';  // amber-500
const BRAND_ROSE   = '#f43f5e';  // rose-500
const GREY_LIGHT   = '#e5e7eb';  // gray-200
const PIE_COLORS = [BRAND_PURPLE, BRAND_ACCENT, BRAND_AMBER, BRAND_ROSE];

// Month labels
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AnalyticsDashboard = () => {
  const [monthlyData,setMonthlyData]=useState([]);
  const [occupancyData,setOccupancyData]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const fetchAnalytics=async()=>{
      try{
        const resp=await networkAdapter.get('/api/analytics');
        if(resp.status==='success'){
          setMonthlyData(resp.data.monthly||[]);
          // transform occupancy:{occupied,total_rooms}
          if(Array.isArray(resp.data.occupancy)){
            const transformed = resp.data.occupancy.map(({name,occupancy})=>({
              name,
              occupied: occupancy.occupied,
              free: occupancy.total_rooms - occupancy.occupied
            }));
            setOccupancyData(transformed);
          }
        }
      }catch(err){console.error(err);}finally{setLoading(false);}    };
    fetchAnalytics();
  },[]);

  // hotel names for series
  const hotelNames = useMemo(()=>{
    const s=new Set();
    monthlyData.forEach(item=>Object.keys(item.reservations_count).forEach(h=>s.add(h)));
    return Array.from(s);
  },[monthlyData]);

  // bookings
  const bookingsSeries = useMemo(()=>monthlyData.map(item=>{
    const [,m]=item.month.split('-');
    const pt={month:MONTH_NAMES[+m-1]};
    hotelNames.forEach(h=>pt[h]=item.reservations_count[h]||0);
    return pt;
  }),[monthlyData,hotelNames]);

  // revenue
  const revenueSeries = useMemo(()=>monthlyData.map(item=>{
    const [,m]=item.month.split('-');
    const pt={month:MONTH_NAMES[+m-1]};
    hotelNames.forEach(h=>pt[h]=item.revenue[h]||0);
    return pt;
  }),[monthlyData,hotelNames]);

  // new users
  const newUsersSeries = useMemo(()=>monthlyData.map(item=>{
    const [,m]=item.month.split('-');
    return {month:MONTH_NAMES[+m-1], newUsers:item.new_users||0};
  }),[monthlyData]);

  // avg booking value
  const avgBookingSeries = useMemo(()=>monthlyData.map(item=>{
    const [,m]=item.month.split('-');
    const totalB=Object.values(item.reservations_count).reduce((a,v)=>a+v,0);
    const totalR=Object.values(item.revenue).reduce((a,v)=>a+v,0);
    const avg= totalB>0? totalR/totalB:0;
    return {month:MONTH_NAMES[+m-1], avgBookingValue:parseFloat(avg.toFixed(2))};
  }),[monthlyData]);

  if(loading) return <div className="text-center p-6">Loading analytics…</div>;

  return (
    <div className="container mx-auto p-4 my-10 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bookings */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Bookings – last 12 months</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bookingsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {hotelNames.map((h,i)=><Line key={h} dataKey={h} stroke={PIE_COLORS[i%PIE_COLORS.length]} strokeWidth={2}/>)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Revenue (€) – last 12 months</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={v=>`€${v}`} />
              <Legend />
              {hotelNames.map((h,i)=><Bar key={h} dataKey={h} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* New Users */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">New Users – last 12 months</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={newUsersSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="newUsers" stroke={BRAND_ACCENT} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Avg Booking Value */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Average Booking Value (€)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={avgBookingSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={v=>`€${v}`} />
              <Line type="monotone" dataKey="avgBookingValue" stroke={BRAND_PURPLE} strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Occupancy Stacked Bar */}
        <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
          <h2 className="font-semibold mb-4">Hotel Occupancy (Current)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={occupancyData} layout="vertical" margin={{ left:80 }}>
              <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={v=>`${v}`} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip formatter={(value, name) => [`${value}`, name === 'occupied' ? 'Occupied' : 'Free']} />
              <Legend />
              <Bar dataKey="free" stackId="a" fill={GREY_LIGHT} />
              <Bar dataKey="occupied" stackId="a" fill={BRAND_ACCENT} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

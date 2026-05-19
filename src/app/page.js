'use client';
import { useEffect, useState } from 'react';
import { BedDouble, Users, CreditCard, CalendarCheck, DoorOpen } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-pulse text-xl text-gray-500">Loading Dashboard...</div></div>;
  }

  const stats = [
    { name: 'Total Rooms', value: data?.totalRooms, icon: BedDouble, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Available Rooms', value: data?.availableRooms, icon: DoorOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Total Guests', value: data?.guests, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Total Bookings', value: data?.bookings, icon: CalendarCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Paid Revenue', value: `Rs ${data?.revenue?.toLocaleString() || 0}`, icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome to LuxeHotel Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass card-hover rounded-2xl p-6 flex items-center">
              <div className={`p-4 rounded-xl mr-4 ${stat.bg}`}>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

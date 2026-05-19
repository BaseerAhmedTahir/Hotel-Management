'use client';
import { useEffect, useState } from 'react';
import { BedDouble, Users, IndianRupee } from 'lucide-react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Available Rooms</h1>
        <p className="text-gray-500">Currently available rooms for booking based on vw_AvailableRooms</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-xl text-gray-500">Loading available rooms...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room, idx) => (
            <div key={idx} className="glass card-hover rounded-2xl overflow-hidden flex flex-col">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-400 p-6 flex flex-col justify-end text-white">
                <span className="text-sm font-medium opacity-80 uppercase tracking-wider">{room.TypeName}</span>
                <span className="text-3xl font-bold">Room {room.RoomNumber}</span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">Max {room.MaxOccupancy}</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <span className="text-sm border px-2 py-0.5 rounded-full border-gray-300 dark:border-gray-600">
                      Floor {room.FloorNo}
                    </span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Base Price / Night</p>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      Rs {room.BasePrice.toLocaleString()}
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full">
                    {room.Status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {rooms.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              No available rooms found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

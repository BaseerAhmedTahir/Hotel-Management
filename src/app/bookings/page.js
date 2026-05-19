'use client';
import { useEffect, useState } from 'react';
import { CalendarCheck, Plus, CheckCircle, LogOut, XCircle } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    GuestID: '', RoomID: '', CheckInDate: '', CheckOutDate: ''
  });
  
  // Data for dropdowns
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openCreateModal = () => {
    // Fetch guests and rooms
    Promise.all([
      fetch('/api/guests').then(res => res.json()),
      fetch('/api/rooms').then(res => res.json())
    ]).then(([guestsData, roomsData]) => {
      setGuests(Array.isArray(guestsData) ? guestsData : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setShowModal(true);
    });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        setFormData({ GuestID: '', RoomID: '', CheckInDate: '', CheckOutDate: '' });
        fetchBookings();
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating booking');
    }
  };

  const handleAction = async (action, BookingID) => {
    if (!confirm(`Are you sure you want to ${action} booking #${BookingID}?`)) return;
    try {
      const res = await fetch('/api/bookings/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, BookingID })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchBookings();
      } else {
        alert(data.error || `Failed to ${action}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error during ${action}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CheckedIn': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'CheckedOut': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bookings</h1>
          <p className="text-gray-500">Manage hotel reservations and stays</p>
        </div>
        <button onClick={openCreateModal} className="btn flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create Booking
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        {loading ? (
          <div className="animate-pulse flex justify-center py-12 text-gray-500">Loading bookings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Guest</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Dates</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4 font-medium">#{booking.BookingID}</td>
                    <td className="py-4 px-4">
                      <div>{booking.GuestName}</div>
                      <div className="text-xs text-gray-500">{booking.Phone}</div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <div>In: {new Date(booking.CheckInDate).toLocaleDateString()}</div>
                      <div>Out: {new Date(booking.CheckOutDate).toLocaleDateString()}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">Rs {booking.TotalAmount?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.Status)}`}>
                        {booking.Status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        {booking.Status === 'Confirmed' && (
                          <>
                            <button onClick={() => handleAction('checkin', booking.BookingID)} className="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors" title="Check In">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleAction('cancel', booking.BookingID)} className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors" title="Cancel">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {booking.Status === 'CheckedIn' && (
                          <button onClick={() => handleAction('checkout', booking.BookingID)} className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors" title="Check Out">
                            <LogOut className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-2xl p-6 sm:p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create Booking</h2>
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Guest</label>
                <select required value={formData.GuestID} onChange={e => setFormData({...formData, GuestID: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a guest...</option>
                  {guests.map(g => <option key={g.GuestID} value={g.GuestID}>{g.FullName} ({g.CNICOrPassport})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Room</label>
                <select required value={formData.RoomID} onChange={e => setFormData({...formData, RoomID: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a room...</option>
                  {rooms.map(r => <option key={r.RoomID} value={r.RoomID}>Room {r.RoomNumber} - {r.TypeName} (Rs {r.BasePrice})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check In</label>
                  <input required type="date" value={formData.CheckInDate} onChange={e => setFormData({...formData, CheckInDate: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check Out</label>
                  <input required type="date" value={formData.CheckOutDate} onChange={e => setFormData({...formData, CheckOutDate: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

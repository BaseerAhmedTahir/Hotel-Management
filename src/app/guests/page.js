'use client';
import { useEffect, useState } from 'react';
import { UserPlus, Search } from 'lucide-react';

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '', Email: '', Phone: '', CNICOrPassport: '', Address: ''
  });

  const fetchGuests = () => {
    setLoading(true);
    fetch('/api/guests')
      .then(res => res.json())
      .then(data => {
        setGuests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ FullName: '', Email: '', Phone: '', CNICOrPassport: '', Address: '' });
        fetchGuests();
      } else {
        alert('Failed to add guest');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding guest');
    }
  };

  const filteredGuests = guests.filter(g => 
    g.FullName?.toLowerCase().includes(search.toLowerCase()) || 
    g.CNICOrPassport?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Guest Management</h1>
          <p className="text-gray-500">View and manage hotel guests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn flex items-center">
          <UserPlus className="w-5 h-5 mr-2" />
          Add Guest
        </button>
      </div>

      <div className="glass rounded-2xl p-6 mb-8">
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none"
            placeholder="Search guests by name or CNIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="animate-pulse flex justify-center py-12 text-gray-500">Loading guests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">CNIC/Passport</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4 text-gray-500">#{guest.GuestID}</td>
                    <td className="py-4 px-4 font-medium">{guest.FullName}</td>
                    <td className="py-4 px-4">
                      <div className="text-sm">{guest.Phone}</div>
                      <div className="text-xs text-gray-500">{guest.Email}</div>
                    </td>
                    <td className="py-4 px-4">{guest.CNICOrPassport}</td>
                    <td className="py-4 px-4 text-sm max-w-xs truncate">{guest.Address}</td>
                  </tr>
                ))}
                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">No guests found</td>
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
            <h2 className="text-2xl font-bold mb-6">Add New Guest</h2>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required type="text" value={formData.FullName} onChange={e => setFormData({...formData, FullName: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" value={formData.Email} onChange={e => setFormData({...formData, Email: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input required type="text" value={formData.Phone} onChange={e => setFormData({...formData, Phone: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CNIC / Passport</label>
                <input required type="text" value={formData.CNICOrPassport} onChange={e => setFormData({...formData, CNICOrPassport: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" value={formData.Address} onChange={e => setFormData({...formData, Address: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn">Save Guest</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

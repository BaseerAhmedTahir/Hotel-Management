'use client';
import { useEffect, useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    BookingID: '', Amount: '', PaymentMethod: 'Card', PaymentStatus: 'Paid'
  });
  const [bookings, setBookings] = useState([]);

  const fetchPayments = () => {
    setLoading(true);
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openCreateModal = () => {
    // Fetch bookings to populate dropdown
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setShowModal(true);
      });
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        setFormData({ BookingID: '', Amount: '', PaymentMethod: 'Card', PaymentStatus: 'Paid' });
        fetchPayments();
      } else {
        alert(data.error || 'Failed to record payment');
      }
    } catch (err) {
      console.error(err);
      alert('Error recording payment');
    }
  };

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payments & Billing</h1>
          <p className="text-gray-500">Record and track guest payments</p>
        </div>
        <button onClick={openCreateModal} className="btn flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Record Payment
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        {loading ? (
          <div className="animate-pulse flex justify-center py-12 text-gray-500">Loading payments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Receipt ID</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Booking & Guest</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Amount Paid</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Method</th>
                  <th className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-500">#{payment.PaymentID}</td>
                    <td className="py-4 px-4">
                      <div>{payment.GuestName}</div>
                      <div className="text-xs text-blue-500 font-medium">Booking #{payment.BookingID}</div>
                    </td>
                    <td className="py-4 px-4 text-sm">{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">Rs {payment.Amount?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm">
                        <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                        {payment.PaymentMethod}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.PaymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {payment.PaymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">No payments recorded</td>
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
            <h2 className="text-2xl font-bold mb-6">Record New Payment</h2>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Booking</label>
                <select required value={formData.BookingID} onChange={e => {
                  const val = e.target.value;
                  const booking = bookings.find(b => b.BookingID == val);
                  setFormData({...formData, BookingID: val, Amount: booking ? booking.TotalAmount : ''});
                }} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a booking...</option>
                  {bookings.filter(b => b.Status !== 'Cancelled').map(b => (
                    <option key={b.BookingID} value={b.BookingID}>#{b.BookingID} - {b.GuestName} (Rs {b.TotalAmount})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (Rs)</label>
                <input required type="number" step="0.01" value={formData.Amount} onChange={e => setFormData({...formData, Amount: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Method</label>
                  <select required value={formData.PaymentMethod} onChange={e => setFormData({...formData, PaymentMethod: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select required value={formData.PaymentStatus} onChange={e => setFormData({...formData, PaymentStatus: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

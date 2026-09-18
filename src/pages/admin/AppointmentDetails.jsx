import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios'; // Make sure this path correctly points to your api/axios.js file

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Using central 'api' instance ensures interceptor attaches the token automatically
        const res = await api.get(`/admin/appointments/${id}`);
        setAppointment(res.data?.data || res.data);
      } catch (err) {
        console.error('Failed to load appointment details:', err);
        setError('Failed to load appointment details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) return <div className="p-8 text-white">Loading details...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!appointment) return <div className="p-8 text-white">Appointment not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <Link to="/admin/appointments" className="text-sm text-amber-500 hover:underline">
              &larr; Back to Appointments
            </Link>
            <h1 className="text-2xl font-bold mt-1">Appointment Record #{appointment?.id || id}</h1>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
            {appointment?.status || 'Pending'}
          </span>
        </div>

        {/* Client & Booking Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Contact Details */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-semibold text-amber-500 border-b border-slate-800 pb-2">
              Contact Information
            </h2>
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="font-medium text-slate-100">{appointment?.name || appointment?.user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="font-medium text-slate-100">{appointment?.email || appointment?.user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Phone Number</p>
              <p className="font-medium text-slate-100">{appointment?.phone || appointment?.user?.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Appointment Schedule */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-semibold text-amber-500 border-b border-slate-800 pb-2">
              Booking Schedule
            </h2>
            <div>
              <p className="text-xs text-slate-400">Preferred Date</p>
              <p className="font-medium text-slate-100">{appointment?.preferred_date || appointment?.date || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Preferred Time Slot</p>
              <p className="font-medium text-slate-100">{appointment?.preferred_time || appointment?.startTime || appointment?.time || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Submission Date</p>
              <p className="font-medium text-slate-100">
                {appointment?.created_at ? new Date(appointment.created_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Lead Notes & Message */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-3">
          <h2 className="text-lg font-semibold text-amber-500 border-b border-slate-800 pb-2">
            Client Message & Requirements
          </h2>
          <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {appointment?.notes || appointment?.message || 'No additional notes provided by client.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AppointmentDetails;
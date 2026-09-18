import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axois';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/appointments');
        setAppointments(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments list.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading appointments...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-10 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Manage Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-slate-400">No appointments scheduled.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-slate-100">{item?.name || item?.user?.name || 'Guest User'}</p>
                <p className="text-sm text-slate-400">
                  {item?.preferred_date || item?.date || 'No Date'} | {item?.status || 'Pending'}
                </p>
              </div>
              <Link
                to={`/admin/appointments/${item.id}`}
                className="px-4 py-2 text-xs bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
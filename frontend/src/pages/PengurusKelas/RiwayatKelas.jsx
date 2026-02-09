import React, { useState, useEffect } from 'react';
import attendanceService from '../../services/attendance';
import apiClient from '../../services/api';
import PageWrapper from '../../components/ui/PageWrapper';

const RiwayatKelas = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState('');

  // 1. Get User/Class Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get('me');
        const user = response.data;
        if (user.class_id) {
          setClassId(user.class_id);
          setClassName(user.class_name || 'Kelas Saya');
        } else if (user.student_profile?.class_id) {
          setClassId(user.student_profile.class_id);
          setClassName(user.class_name || 'Kelas Saya');
        }
      } catch (e) {
        console.error("Failed to get user info", e);
      }
    };
    fetchUserInfo();
  }, []);

  // 2. Fetch Attendance
  useEffect(() => {
    if (!classId) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await attendanceService.getClassAttendanceByDate(classId, selectedDate);
        const records = Array.isArray(response) ? response : (response.data || []);
        setAttendanceRecords(records);
      } catch (e) {
        console.error("Failed to fetch class attendance", e);
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId, selectedDate]);

  // Statistics
  const stats = {
    Hadir: attendanceRecords.filter(r => r.status === 'present').length,
    Sakit: attendanceRecords.filter(r => r.status === 'sick').length,
    Izin: attendanceRecords.filter(r => r.status === 'excused' || r.status === 'izin').length,
    Alpha: attendanceRecords.filter(r => r.status === 'absent').length,
    Terlambat: attendanceRecords.filter(r => r.status === 'late').length
  };

  return (
    <PageWrapper className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Kehadiran Kelas</h1>
        <p className="text-gray-500 mt-1">{className}</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Pilih Tanggal:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full md:w-auto">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold text-green-600 uppercase">Hadir</div>
              <div className="text-xl font-bold text-green-800">{stats.Hadir}</div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold text-purple-600 uppercase">Sakit</div>
              <div className="text-xl font-bold text-purple-800">{stats.Sakit}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold text-yellow-600 uppercase">Izin</div>
              <div className="text-xl font-bold text-yellow-800">{stats.Izin}</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold text-red-600 uppercase">Alpha</div>
              <div className="text-xl font-bold text-red-800">{stats.Alpha}</div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold text-orange-600 uppercase">Terlambat</div>
              <div className="text-xl font-bold text-orange-800">{stats.Terlambat}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Nama Siswa</th>
                  <th className="px-6 py-3">Mata Pelajaran</th>
                  <th className="px-6 py-3">Waktu</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center">Memuat data...</td></tr>
                ) : attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{record.student?.user?.name || record.user?.name || record.student_name || 'N/A'}</td>
                      <td className="px-6 py-4">{record.schedule?.subject_name || record.schedule?.subject?.name || record.subject_name || '-'}</td>
                      <td className="px-6 py-4 font-mono">{record.checked_in_at ? new Date(record.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${record.status === 'present' ? 'bg-green-100 text-green-800 border-green-200' :
                            record.status === 'sick' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            record.status === 'excused' || record.status === 'izin' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            record.status === 'late' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                          {record.status === 'present' ? 'Hadir' :
                           record.status === 'sick' ? 'Sakit' :
                           record.status === 'excused' ? 'Izin' :
                           record.status === 'izin' ? 'Izin' :
                           record.status === 'late' ? 'Terlambat' :
                           record.status === 'absent' ? 'Alpha' : record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{record.reason || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">Tidak ada data kehadiran pada tanggal ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RiwayatKelas;
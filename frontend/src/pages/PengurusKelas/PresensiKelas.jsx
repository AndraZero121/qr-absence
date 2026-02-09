import { useState, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaBook, FaTimes, FaQrcode } from 'react-icons/fa';
import QRCode from 'qrcode';
import PageWrapper from '../../components/ui/PageWrapper';

const scheduleData = [
  {
    id: 1,
    subject: 'Matematika',
    class: 'XII RPL 2',
    period: 'Jam ke 1 - 2',
    time: '07:00-08:30',
    qrData: 'MTK-XII-RPL2-001'
  },
  {
    id: 2,
    subject: 'MPKK',
    class: 'XII RPL 2',
    period: 'Jam ke 3 - 4',
    time: '08:30-10:00',
    qrData: 'MPKK-XII-RPL2-002'
  },
  {
    id: 3,
    subject: 'Bahasa Indonesia',
    class: 'XII RPL 2',
    period: 'Jam ke 5 - 6',
    time: '10:15-11:45',
    qrData: 'BIND-XII-RPL2-003'
  },
  {
    id: 4,
    subject: 'PAI',
    class: 'XII RPL 2',
    period: 'Jam ke 7 - 8',
    time: '12:30-14:00',
    qrData: 'PAI-XII-RPL2-004'
  },
  {
    id: 5,
    subject: 'PKDK',
    class: 'XII RPL 2',
    period: 'Jam ke 1 - 2',
    time: '07:00-08:30',
    qrData: 'PKDK-XII-RPL2-005'
  },
  {
    id: 6,
    subject: 'MPP',
    class: 'XII RPL 2',
    period: 'Jam ke 3 - 4',
    time: '08:30-10:00',
    qrData: 'MPP-XII-RPL2-006'
  },
  {
    id: 7,
    subject: 'Bahasa Inggris',
    class: 'XII RPL 2',
    period: 'Jam ke 5 - 6',
    time: '10:15-11:45',
    qrData: 'BING-XII-RPL2-007'
  },
  {
    id: 8,
    subject: 'Bahasa Jawa',
    class: 'XII RPL 2',
    period: 'Jam ke 7 - 8',
    time: '12:30-14:00',
    qrData: 'BJAWA-XII-RPL2-008'
  }
];

function PresensiKelas() {
  const [selectedQR, setSelectedQR] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Function to format date
    const formatDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Set initial date
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentDate(formatDate());

    // Update date every minute
    const interval = setInterval(() => {
      setCurrentDate(formatDate());
    }, 60000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, []);

  const generateQR = useCallback(async (text) => {
    try {
      const url = await QRCode.toDataURL(text, { width: 300, margin: 2 });
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (showQRModal && selectedQR) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateQR(selectedQR.qrData);
    }
  }, [showQRModal, selectedQR, generateQR]);

  /* generateQR moved */

  const handleQRClick = (schedule) => {
    setSelectedQR(schedule);
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedQR(null);
    setQrCodeUrl('');
  };

  return (
    <PageWrapper className="flex h-full bg-gray-50 overflow-hidden">
      {/* Right Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 relative z-0">
        {/* Date Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Pelajaran</h1>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-200">
            <FaCalendarAlt size={20} className="text-indigo-600" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {scheduleData.map((schedule) => (
            <div 
              key={schedule.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 group hover:border-indigo-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <FaBook size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-indigo-700 transition-colors">{schedule.subject}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{schedule.period}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                <div className="text-xs">
                  <p className="font-semibold text-gray-700">{schedule.class}</p>
                  <p className="text-gray-500 mt-0.5 font-mono">{schedule.time}</p>
                </div>
                <button
                  className="bg-gray-100 hover:bg-indigo-600 text-gray-600 hover:text-white p-2 rounded-lg transition-all duration-300 transform active:scale-95"
                  onClick={() => handleQRClick(schedule)}
                  title="Scan QR Code"
                >
                  <FaQrcode size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* QR Code Modal */}
      {showQRModal && selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeQRModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-start relative overflow-hidden">
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Scan Kode QR</h3>
                <p className="text-indigo-100 text-sm">Presensi {selectedQR.subject}</p>
              </div>
              <button 
                className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full relative z-10" 
                onClick={closeQRModal}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <div className="text-center mb-6">
                <h4 className="text-gray-800 font-bold text-lg">{selectedQR.subject}</h4>
                <p className="text-gray-500 text-sm mt-1">{selectedQR.class} • {selectedQR.time}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mb-6 relative group">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-gray-400 animate-pulse">
                    Generating...
                  </div>
                )}
                {/* Corner Accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-500 rounded-tl"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-500 rounded-tr"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-500 rounded-bl"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-500 rounded-br"></div>
              </div>
              
              <div className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg text-sm text-center w-full font-medium">
                Scan kode QR di atas untuk melakukan presensi kehadiran siswa.
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default PresensiKelas;
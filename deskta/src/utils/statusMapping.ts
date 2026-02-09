export const STATUS_BACKEND_TO_FRONTEND: Record<string, string> = {
    present: 'Hadir',
    late: 'Terlambat',
    excused: 'Izin',
    sick: 'Sakit',
    absent: 'Alpha',
    dinas: 'Dinas',
    izin: 'Izin'
};

export const STATUS_FRONTEND_TO_BACKEND: Record<string, string> = {
    'hadir': 'present',
    'terlambat': 'late',
    'izin': 'izin',
    'sakit': 'sick',
    'alpha': 'absent',
    'dinas': 'dinas',
    'pulang': 'izin',

    // Title Case variants
    'Hadir': 'present',
    'Terlambat': 'late',
    'Izin': 'izin',
    'Sakit': 'sick',
    'Alpha': 'absent',
    'Dinas': 'dinas',
    'Pulang': 'izin'
};

export const STATUS_COLORS_HEX: Record<string, string> = {
    present: '#1FA83D',
    late: '#FFA500',
    excused: '#ACA40D',
    sick: '#520C8F',
    absent: '#D90000',
    dinas: '#0000FF',
    izin: '#ACA40D'
};

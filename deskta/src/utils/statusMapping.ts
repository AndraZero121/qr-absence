export const STATUS_BACKEND_TO_FRONTEND: Record<string, string> = {
    present: 'Hadir',
    late: 'Terlambat',
    excused: 'Izin',
    sick: 'Sakit',
    absent: 'Alpha',
    dinas: 'Dinas',
    izin: 'Izin',
    pulang: 'Pulang',
    return: 'Pulang'
};

export const STATUS_FRONTEND_TO_BACKEND: Record<string, string> = {
    'hadir': 'present',
    'terlambat': 'late',
    'izin': 'izin',
    'sakit': 'sick',
    'alpha': 'absent',
    'dinas': 'dinas',
    'pulang': 'return',

    // Title Case variants
    'Hadir': 'present',
    'Terlambat': 'late',
    'Izin': 'izin',
    'Sakit': 'sick',
    'Alpha': 'absent',
    'Dinas': 'dinas',
    'Pulang': 'return'
};

export const STATUS_COLORS_HEX: Record<string, string> = {
    present: '#10B981',
    late: '#F59E0B',
    excused: '#3B82F6',
    sick: '#8B5CF6',
    absent: '#EF4444',
    dinas: '#6366F1',
    izin: '#3B82F6',
    pulang: '#F97316',
    return: '#F97316'
};

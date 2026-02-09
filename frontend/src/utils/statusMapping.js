export const STATUS_BACKEND_TO_FRONTEND = {
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

export const STATUS_FRONTEND_TO_BACKEND = {
    'hadir': 'present',
    'terlambat': 'late',
    'izin': 'izin',
    'sakit': 'sick',
    'alpha': 'absent',
    'dinas': 'dinas',
    'pulang': 'return',

    // Title Case variants just in case
    'Hadir': 'present',
    'Terlambat': 'late',
    'Izin': 'izin',
    'Sakit': 'sick',
    'Alpha': 'absent',
    'Dinas': 'dinas',
    'Pulang': 'return'
};

export const STATUS_COLORS = {
    present: 'status-hadir',
    late: 'status-terlambat',
    excused: 'status-izin',
    sick: 'status-sakit',
    absent: 'status-alpha',
    dinas: 'status-dinas',
    izin: 'status-izin',
    pulang: 'status-pulang',
    return: 'status-pulang'
};

export const STATUS_COLORS_HEX = {
    present: '#10B981',
    late: '#F59E0B',
    excused: '#3B82F6',
    sick: '#8B5CF6',
    absent: '#EF4444',
    dinas: '#6366F1',
    izin: '#3B82F6',
    pulang: '#F97316',
    return: '#F97316',
    // Indonesian keys for local components that might need them
    hadir: '#10B981',
    terlambat: '#F59E0B',
    sakit: '#8B5CF6',
    alpha: '#EF4444',
};

export const getStatusTheme = (status) => {
    const s = (status || 'absent').toLowerCase();
    const themes = {
        present: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
        late: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
        excused: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
        izin: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
        sick: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
        sakit: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
        absent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
        alpha: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
        dinas: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
        pulang: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
        return: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    };
    return themes[s] || themes.absent;
};

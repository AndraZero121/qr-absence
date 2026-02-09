# TODOFIX Comprehensive Implementation Plan

> **Project**: QR Absence System - UI/UX & Functionality Fixes  
> **Scope**: Frontend (Web) & Deskta (Desktop)  
> **Date**: February 10, 2026  
> **Status**: Planning Phase - DO NOT DIRECTLY EDIT CODEBASE

---

## 📋 Executive Summary

This document outlines a comprehensive plan to fix all UI/UX issues, functional gaps, and data integrity problems across both the **Web Frontend** (`frontend/`) and **Desktop Client** (`deskta/`) applications. The plan is organized by priority level and component area.

### Critical Issues Count
- 🔴 **High Priority**: 9 issues
- 🟡 **Medium Priority**: 8 issues  
- 🟢 **Low Priority**: 3 issues

---

## 🎯 Phase 1: Critical Data & Functionality Fixes (HIGH PRIORITY)

### 1.1 Fix DashboardSiswa.jsx - Mock Data Removal
**File**: `frontend/src/pages/Siswa/DashboardSiswa.jsx`
**Issue**: Uses `Math.random()` for monthly trend data generation
**Current Problem** (Line 283 area):
```javascript
// DUMMY DATA - NEEDS FIXING
const monthlyArray = data.monthly_summary?.map((item) => ({
  month: item.month,
  percentage: Math.round(Math.random() * 100), // ❌ RANDOM DATA
})) || [];
```

**Implementation Plan**:
1. Update API endpoint to return actual monthly percentages
2. Replace `Math.random()` with actual calculated data:
   ```javascript
   percentage: Math.round((item.present_count / item.total_count) * 100)
   ```
3. Add fallback for empty data state
4. Update chart component to handle loading states

**API Changes Required**:
- Backend should calculate monthly attendance percentages
- Include `present_count` and `total_count` in monthly_summary response

---

### 1.2 Fix DataSiswa.jsx - Missing Document Functions
**File**: `frontend/src/pages/Admin/DataSiswa.jsx`
**Issues**:
1. Missing `handleViewSurat` function
2. Broken "Download" button in preview modal

**Implementation Plan**:
1. Add document handling service integration
2. Implement `handleViewSurat` function:
   ```javascript
   const handleViewSurat = async (siswaId, documentType) => {
     try {
       const response = await api.get(`/students/${siswaId}/documents/${documentType}`);
       // Open document viewer modal
       setPreviewDocument(response.data);
       setShowPreviewModal(true);
     } catch (error) {
       showAlert('error', 'Gagal', 'Dokumen tidak ditemukan');
     }
   };
   ```
3. Fix download button to use proper file download logic
4. Add document preview modal component

---

### 1.3 Fix RiwayatKehadiran.jsx - Export Functions
**File**: `frontend/src/pages/WaliKelas/RiwayatKehadiran.jsx`
**Issue**: Export Excel/PDF buttons have no onClick handlers

**Implementation Plan**:
1. Add export service functions:
   ```javascript
   const handleExportExcel = async () => {
     const response = await api.get('/attendance/export/excel', {
       params: { class_id: selectedClass, date_range: dateRange },
       responseType: 'blob'
     });
     downloadFile(response.data, 'riwayat-kehadiran.xlsx');
   };

   const handleExportPDF = async () => {
     const response = await api.get('/attendance/export/pdf', {
       params: { class_id: selectedClass, date_range: dateRange },
       responseType: 'blob'
     });
     downloadFile(response.data, 'riwayat-kehadiran.pdf');
   };
   ```
2. Implement file download utility
3. Add loading states for export buttons
4. Handle export errors gracefully

---

### 1.4 Fix CSS/Contrast Crisis in Waka Pages
**Files**:
- `frontend/src/pages/Waka/JadwalSiswaShow.css` (0 bytes)
- `frontend/src/pages/Waka/DashboardWaka.css` (0 bytes)
- `frontend/src/pages/Waka/KehadiranGuruShow.css` (missing)

**Issue**: Empty CSS files causing text to be invisible on dark backgrounds

**Implementation Plan**:
1. Create proper CSS structure for each file:
   ```css
   /* DashboardWaka.css */
   .waka-container {
     background: linear-gradient(135deg, #001F3E 0%, #0C4A6E 100%);
     min-height: 100vh;
     padding: 24px;
   }

   .waka-card {
     background: rgba(255, 255, 255, 0.95);
     backdrop-filter: blur(10px);
     border-radius: 16px;
     padding: 24px;
     border: 1px solid rgba(255, 255, 255, 0.2);
     box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
   }

   .waka-text {
     color: #1F2937;
     font-weight: 600;
   }

   .waka-text-light {
     color: #F9FAFB;
     text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
   }
   ```
2. Implement glassmorphism design pattern
3. Ensure WCAG 2.1 AA contrast ratios (4.5:1 for normal text)
4. Add responsive breakpoints

---

### 1.5 Standardize PageWrapper Usage
**Files to Update**:
- `frontend/src/pages/Waka/JadwalSiswaShow.jsx`
- `frontend/src/pages/Waka/JadwalGuruShow.jsx`
- `frontend/src/pages/Waka/KehadiranGuruShow.jsx`
- `frontend/src/pages/Waka/KehadiranSiswaShow.jsx`

**Issue**: Missing PageWrapper breaks layout consistency and animations

**Implementation Plan**:
1. Import PageWrapper component:
   ```javascript
   import PageWrapper from '../../components/ui/PageWrapper';
   ```
2. Wrap page content:
   ```javascript
   return (
     <PageWrapper className="min-h-screen bg-gray-50">
       {/* Page content */}
     </PageWrapper>
   );
   ```
3. Ensure consistent padding and margins
4. Verify animation transitions work properly

---

### 1.6 Fix Deskta KehadiranSiswa - Data Fetching
**File**: `deskta/src/Pages/WakaStaff/KehadiranSiswa.tsx`
**Issue**: No data fetching implementation

**Implementation Plan**:
1. Add API service integration:
   ```typescript
   import { attendanceService } from '../../services/attendance';
   
   const [attendanceData, setAttendanceData] = useState([]);
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
     const fetchAttendance = async () => {
       try {
         const data = await attendanceService.getClassAttendance({
           class_id: selectedClass,
           date: selectedDate
         });
         setAttendanceData(data);
       } catch (error) {
         console.error('Failed to fetch attendance:', error);
       } finally {
         setLoading(false);
       }
     };
     
     fetchAttendance();
   }, [selectedClass, selectedDate]);
   ```
2. Create attendance service if not exists
3. Add proper TypeScript interfaces
4. Implement loading and error states

---

### 1.7 Fix Deskta KehadiranGuru - Dummy Data
**File**: `deskta/src/Pages/WakaStaff/KehadiranGuru.tsx`
**Issue**: Uses hardcoded dummy/mock data

**Implementation Plan**:
1. Replace dummy data with API calls:
   ```typescript
   // REMOVE:
   const dummyData = [
     { id: 1, name: 'Budi Santoso', status: 'Hadir', time: '07:00' },
     // ... dummy data
   ];
   
   // REPLACE WITH:
   const [teacherAttendance, setTeacherAttendance] = useState([]);
   
   useEffect(() => {
     fetchTeacherAttendance();
   }, [selectedDate]);
   ```
2. Create teacher attendance service
3. Add proper data transformation
4. Implement real-time updates if needed

---

### 1.8 Fix Deskta RekapKehadiranSiswa - No Data Fetch
**File**: `deskta/src/Pages/WakaStaff/RekapKehadiranSiswa.tsx`
**Issue**: Component exists but doesn't fetch actual data

**Implementation Plan**:
1. Add data fetching logic:
   ```typescript
   const fetchRecapData = async () => {
     setLoading(true);
     try {
       const response = await attendanceService.getAttendanceRecap({
         class_id: classId,
         start_date: dateRange.start,
         end_date: dateRange.end
       });
       setRecapData(response.data);
     } catch (error) {
       setError('Gagal memuat data rekap');
     } finally {
       setLoading(false);
     }
   };
   ```
2. Add date range selector component
3. Implement data aggregation logic
4. Add export functionality

---

### 1.9 Fix Role Naming Inconsistency
**Files Affected**:
- `deskta/src/services/auth.ts`
- `frontend/src/services/auth.js`
- Multiple role validation files

**Issue**: Backend sends `user_type: "Peserta Didik"` but Deskta checks for `role: "Siswa"`

**Implementation Plan**:
1. Create role mapping utility:
   ```typescript
   // utils/roleMapping.ts
   export const ROLE_MAPPING = {
     'Peserta Didik': 'Siswa',
     'Guru': 'Guru',
     'Wali Kelas': 'WaliKelas',
     'Admin': 'Admin',
     'Waka': 'WakaStaff'
   };

   export const normalizeRole = (backendRole: string): string => {
     return ROLE_MAPPING[backendRole] || backendRole;
   };
   ```
2. Update all role checks to use normalized roles
3. Fix login response handling in both apps
4. Update localStorage role storage to be consistent

---

## 🎯 Phase 2: Code Quality & Architecture (MEDIUM PRIORITY)

### 2.1 Create Centralized Status Mapping Utility
**New File**: `frontend/src/utils/statusMapping.js` & `deskta/src/utils/statusMapping.ts`

**Issue**: Status color/label mapping duplicated across multiple files

**Implementation Plan**:
1. Create unified status mapping:
   ```typescript
   export const STATUS_CONFIG = {
     present: { 
       label: 'Hadir', 
       color: '#10B981', 
       bgColor: '#D1FAE5',
       icon: 'CheckCircle'
     },
     late: { 
       label: 'Terlambat', 
       color: '#F59E0B', 
       bgColor: '#FEF3C7',
       icon: 'Clock'
     },
     excused: { 
       label: 'Izin', 
       color: '#3B82F6', 
       bgColor: '#DBEAFE',
       icon: 'Info'
     },
     sick: { 
       label: 'Sakit', 
       color: '#8B5CF6', 
       bgColor: '#EDE9FE',
       icon: 'Medical'
     },
     absent: { 
       label: 'Alpha', 
       color: '#EF4444', 
       bgColor: '#FEE2E2',
       icon: 'XCircle'
     },
     pulang: {
       label: 'Pulang',
       color: '#2F85EB',
       bgColor: '#DBEAFE',
       icon: 'ArrowRight'
     }
   };

   export const getStatusConfig = (status: string) => {
     return STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.absent;
   };
   ```
2. Replace all inline status mappings
3. Update components to use utility:
   ```typescript
   import { getStatusConfig } from '../utils/statusMapping';
   
   const config = getStatusConfig(attendance.status);
   return <Badge color={config.color}>{config.label}</Badge>;
   ```

---

### 2.2 Add Loading & Error States
**Files to Update**: All pages with data fetching

**Implementation Plan**:
1. Create reusable Loading component:
   ```typescript
   // components/Shared/Loading.tsx
   export const LoadingState = ({ message = 'Memuat data...' }) => (
     <div className="flex flex-col items-center justify-center py-20">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
       <p className="mt-4 text-gray-500 font-medium">{message}</p>
     </div>
   );
   ```
2. Create Error state component:
   ```typescript
   export const ErrorState = ({ message, onRetry }) => (
     <div className="flex flex-col items-center justify-center py-20">
       <div className="text-red-500 text-5xl mb-4">⚠️</div>
       <p className="text-gray-700 font-medium mb-4">{message}</p>
       {onRetry && (
         <button 
           onClick={onRetry}
           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
         >
           Coba Lagi
         </button>
       )}
     </div>
   );
   ```
3. Implement in all data-fetching pages:
   ```typescript
   if (loading) return <LoadingState message="Memuat data siswa..." />;
   if (error) return <ErrorState message={error} onRetry={fetchData} />;
   ```

---

### 2.3 Fix Import Feature in SiswaAdmin.tsx
**File**: `deskta/src/Pages/Admin/SiswaAdmin.tsx`
**Issue**: Import button only shows placeholder popup

**Implementation Plan**:
1. Create CSV/Excel parser component:
   ```typescript
   const handleImport = async (file: File) => {
     try {
       const formData = new FormData();
       formData.append('file', file);
       
       const response = await api.post('/students/import', formData, {
         headers: { 'Content-Type': 'multipart/form-data' }
       });
       
       showAlert('success', 'Berhasil', `${response.data.imported_count} siswa berhasil diimpor`);
       refreshData();
     } catch (error) {
       showAlert('error', 'Gagal', error.response?.data?.message || 'Gagal mengimpor data');
     }
   };
   ```
2. Add file validation (only .xlsx, .csv)
3. Show preview before import
4. Add progress indicator for large imports
5. Handle duplicate entries

---

### 2.4 Remove Demo Fallback Data
**Files**:
- `frontend/src/pages/Waka/DashboardWaka.jsx`
- `frontend/src/pages/Guru/DashboardGuru.jsx`
- `frontend/src/pages/WaliKelas/DashboardWakel.jsx`
- `deskta/src/Pages/WakaStaff/DashboardStaff.tsx`

**Issue**: Displays fake data when API fails

**Implementation Plan**:
1. Replace fallback data with error states:
   ```javascript
   // REMOVE:
   } catch (error) {
     // Fallback to demo data
     setStatistik({ hadir: 45, izin: 5, sakit: 3, alpha: 2, terlambat: 1 });
   }
   
   // REPLACE WITH:
   } catch (error) {
     console.error('Failed to fetch dashboard data:', error);
     setError('Gagal memuat data dashboard. Silakan coba lagi.');
     setStatistik({ hadir: 0, izin: 0, sakit: 0, alpha: 0, terlambat: 0 });
   }
   ```
2. Show user-friendly error messages
3. Add retry functionality
4. Log errors for debugging

---

### 2.5 Fix Math.random() in KehadiranSiswaWakel.tsx
**File**: `deskta/src/Pages/WaliKelas/KehadiranSiswaWakel.tsx`
**Issue**: Line 123 uses `Math.random()` for temp IDs

**Implementation Plan**:
1. Replace with deterministic ID generation:
   ```typescript
   // REMOVE:
   id: item.id?.toString() || `temp-${Math.random()}`,
   
   // REPLACE WITH:
   id: item.id?.toString() || `temp-${Date.now()}-${index}`,
   ```
2. Or use UUID library:
   ```typescript
   import { v4 as uuidv4 } from 'uuid';
   id: item.id?.toString() || uuidv4(),
   ```
3. Ensure uniqueness across re-renders

---

### 2.6 Fix Hardcoded API URL
**File**: `deskta/src/Pages/Guru/KehadiranSiswaGuru.tsx`
**Issue**: Uses `http://localhost:8000` directly

**Implementation Plan**:
1. Use centralized API configuration:
   ```typescript
   // services/api.ts
   export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
   
   // In component:
   import { API_BASE_URL } from '../../services/api';
   const response = await fetch(`${API_BASE_URL}/api/attendance/...`);
   ```
2. Ensure environment variables are properly configured
3. Update all hardcoded URLs across the codebase

---

### 2.7 Implement Race Condition Handling
**Files**:
- `frontend/src/pages/Siswa/DashboardSiswa.jsx`
- `deskta/src/Pages/WakaStaff/KehadiranSiswaGuru.tsx`
- `frontend/src/pages/Waka/KehadiranGuruIndex.jsx`
- `deskta/src/Pages/WaliKelas/DashboardWalliKelas.tsx`

**Implementation Plan**:
1. Use AbortController for fetch cancellation:
   ```typescript
   useEffect(() => {
     const controller = new AbortController();
     
     const fetchData = async () => {
       try {
         const response = await api.get('/endpoint', {
           signal: controller.signal
         });
         setData(response.data);
       } catch (error) {
         if (error.name === 'AbortError') return;
         setError(error.message);
       }
     };
     
     fetchData();
     
     return () => controller.abort();
   }, [dependency]);
   ```
2. Add loading state guards to prevent race conditions
3. Use React Query or SWR for better data synchronization (optional enhancement)

---

## 🎯 Phase 3: Polish & Consistency (LOW PRIORITY)

### 3.1 Standardize Logout & Storage Management
**Files**: All authentication-related files

**Issue**: Inconsistent logout methods between Web and Deskta

**Implementation Plan**:
1. Create unified auth utility:
   ```typescript
   // utils/auth.ts
   export const AUTH_KEYS = {
     TOKEN: 'auth_token',
     USER_DATA: 'user_data',
     USER_ROLE: 'user_role'
   };

   export const logout = (navigate?: Function) => {
     Object.values(AUTH_KEYS).forEach(key => {
       localStorage.removeItem(key);
       sessionStorage.removeItem(key);
     });
     
     if (navigate) {
       navigate('/');
     } else {
       window.location.href = '/';
     }
   };
   ```
2. Replace all logout implementations
3. Standardize storage key usage
4. Add cleanup for all auth-related data

---

### 3.2 Fix Weekend Scheduling
**Files**:
- Backend: `ScheduleController@normalizeDay`
- Frontend schedule components

**Issue**: No mapping for Saturday/Sunday (Sabtu/Minggu)

**Implementation Plan**:
1. Update day normalization:
   ```php
   // Backend
   private function normalizeDay($day) {
     $days = [
       'monday' => 1, 'senin' => 1,
       'tuesday' => 2, 'selasa' => 2,
       'wednesday' => 3, 'rabu' => 3,
       'thursday' => 4, 'kamis' => 4,
       'friday' => 5, 'jumat' => 5, 'jum\'at' => 5,
       'saturday' => 6, 'sabtu' => 6,
       'sunday' => 7, 'minggu' => 7,
     ];
     return $days[strtolower($day)] ?? null;
   }
   ```
2. Add weekend schedule support in UI
3. Handle weekend attendance scenarios
4. Add validation for weekend schedules

---

### 3.3 Add Proper API Error Handling
**Files**: All API service files

**Implementation Plan**:
1. Create error handler utility:
   ```typescript
   // utils/errorHandler.ts
   export const handleApiError = (error: any): string => {
     if (error.response) {
       // Server responded with error
       const status = error.response.status;
       const message = error.response.data?.message;
       
       switch (status) {
         case 401:
           return 'Sesi telah berakhir. Silakan login kembali.';
         case 403:
           return 'Anda tidak memiliki akses untuk melakukan ini.';
         case 404:
           return 'Data tidak ditemukan.';
         case 422:
           return message || 'Data yang dimasukkan tidak valid.';
         case 500:
           return 'Terjadi kesalahan server. Silakan coba lagi nanti.';
         default:
           return message || 'Terjadi kesalahan. Silakan coba lagi.';
       }
     } else if (error.request) {
       return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
     }
     return 'Terjadi kesalahan yang tidak diketahui.';
   };
   ```
2. Implement in all API calls
3. Show user-friendly error messages
4. Add error logging

---

## 📁 File Inventory

### Frontend (Web) Files to Modify
```
frontend/src/pages/
├── Siswa/
│   └── DashboardSiswa.jsx          # Fix Math.random() data
├── Admin/
│   └── DataSiswa.jsx               # Add document functions
├── WaliKelas/
│   ├── DashboardWakel.jsx          # Remove demo data
│   └── RiwayatKehadiran.jsx        # Add export handlers
├── Guru/
│   └── DashboardGuru.jsx           # Remove demo data
└── Waka/
    ├── DashboardWaka.jsx           # Remove demo data
    ├── JadwalSiswaShow.jsx         # Add PageWrapper + CSS
    ├── JadwalGuruShow.jsx          # Add PageWrapper + CSS
    ├── KehadiranGuruShow.jsx       # Add PageWrapper + CSS
    ├── KehadiranSiswaShow.jsx      # Add PageWrapper + CSS
    └── *.css                       # Create missing CSS files

frontend/src/utils/
├── statusMapping.js                # Centralize status mapping
├── errorHandler.js                 # Add error handling utility
└── auth.js                         # Standardize auth utilities
```

### Deskta (Desktop) Files to Modify
```
deskta/src/Pages/
├── Admin/
│   └── SiswaAdmin.tsx              # Fix import feature
├── WakaStaff/
│   ├── KehadiranSiswa.tsx          # Add data fetching
│   ├── KehadiranGuru.tsx           # Replace dummy data
│   ├── RekapKehadiranSiswa.tsx     # Add data fetching
│   └── DashboardStaff.tsx          # Remove demo data
├── WaliKelas/
│   ├── DashboardWalliKelas.tsx     # Add AbortController
│   └── KehadiranSiswaWakel.tsx     # Fix Math.random()
└── Guru/
    └── KehadiranSiswaGuru.tsx      # Fix hardcoded URL

deskta/src/utils/
├── statusMapping.ts                # Centralize status mapping
├── roleMapping.ts                  # Fix role consistency
├── errorHandler.ts                 # Add error handling
└── auth.ts                         # Standardize auth utilities
```

---

## 🚀 Implementation Order

### Week 1: Critical Fixes
1. ✅ Fix DashboardSiswa.jsx mock data
2. ✅ Fix DataSiswa.jsx document functions
3. ✅ Fix RiwayatKehadiran.jsx export buttons
4. ✅ Fix CSS/Contrast issues in Waka pages
5. ✅ Standardize PageWrapper usage

### Week 2: Deskta Data Integration
6. ✅ Fix KehadiranSiswa data fetching
7. ✅ Fix KehadiranGuru dummy data
8. ✅ Fix RekapKehadiranSiswa data fetching
9. ✅ Fix role naming inconsistency

### Week 3: Code Quality
10. ✅ Create status mapping utility
11. ✅ Add loading/error states
12. ✅ Fix import feature
13. ✅ Remove demo fallbacks
14. ✅ Fix Math.random() usage

### Week 4: Polish & Consistency
15. ✅ Fix hardcoded URLs
16. ✅ Implement race condition handling
17. ✅ Standardize logout/storage
18. ✅ Fix weekend scheduling
19. ✅ Add API error handling

---

## 📊 Success Criteria

### Functional Requirements
- [ ] All pages display real data from API (no Math.random())
- [ ] All buttons have functional onClick handlers
- [ ] Import/Export features work correctly
- [ ] Document viewing and downloading works
- [ ] No demo/fallback data shown to users
- [ ] All API calls use proper base URLs (no hardcoding)

### UI/UX Requirements
- [ ] All text is readable with proper contrast (WCAG AA)
- [ ] All pages use consistent PageWrapper
- [ ] Loading states shown during data fetch
- [ ] Error states shown with retry options
- [ ] Consistent styling across all pages
- [ ] Role names consistent between Web and Deskta

### Performance Requirements
- [ ] No race conditions in data fetching
- [ ] Proper cleanup on component unmount
- [ ] API calls cancelled when components unmount
- [ ] No memory leaks from intervals/timeouts

---

## 🐛 Known Issues Log

### Critical (Blocking)
- [x] DashboardSiswa uses Math.random() for trend data
- [x] DataSiswa missing document view/download functions
- [x] RiwayatKehadiran export buttons non-functional
- [x] Waka pages have empty CSS files (contrast issues)
- [x] Deskta KehadiranSiswa has no data fetching
- [x] Deskta KehadiranGuru uses dummy data
- [x] Deskta RekapKehadiranSiswa not fetching data

### High (Major)
- [x] Role naming mismatch causing session issues
- [x] Missing PageWrapper on several Waka pages
- [x] Demo data shown when API fails
- [x] Import feature placeholder only

### Medium (Minor)
- [x] Status mapping duplicated across files
- [x] Missing loading/error states
- [x] Math.random() used for temp IDs
- [x] Hardcoded localhost:8000 in some files

### Low (Nice to have)
- [x] Inconsistent logout methods
- [x] Weekend scheduling not supported
- [x] Error handling could be more user-friendly

---

## 📝 Notes

1. **Do NOT directly edit codebase** - This is a planning document only
2. **Test each fix** in isolation before moving to next
3. **Maintain backward compatibility** where possible
4. **Update documentation** as changes are made
5. **Consider mobile responsiveness** for all UI changes
6. **Verify TypeScript types** in Deskta when making changes

---

**Document Version**: 1.0  
**Last Updated**: February 10, 2026  
**Next Review**: After Phase 1 completion

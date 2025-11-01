import api from '@/lib/api';

export const attendanceService = {
  // Check-in for a shift
  checkIn: async (checkInData) => {
    const response = await api.post('/attendance/checkin', checkInData);
    return response.data;
  },

  // Check-out from attendance
  checkOut: async (checkOutData) => {
    const response = await api.post('/attendance/checkout', checkOutData);
    return response.data;
  },

  // Get current user's attendance records
  getMyAttendance: async (params = {}) => {
    const response = await api.get('/attendance/my', { params });
    return response.data;
  },

  // Get monthly summary for current user
  getMyMonthlySummary: async (month, year) => {
    const response = await api.get('/attendance/my', { 
      params: { month, year } 
    });
    return response.data;
  },

  // Get all attendance records (for managers/admins)
  getAllAttendance: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },

  // Export attendance data
  exportAttendance: async (month, year) => {
    const response = await api.get('/attendance/export', {
      params: { month, year },
      responseType: 'blob' // Important for file download
    });
    return response;
  },

  // Get today's check-in status
  getTodayStatus: async () => {
    const response = await api.get('/attendance/my?limit=1');
    if (response.data.success && response.data.data.length > 0) {
      const today = new Date().toDateString();
      const todayRecord = response.data.data.find(record => {
        const recordDate = new Date(record.checkInTime).toDateString();
        return recordDate === today;
      });
      return todayRecord;
    }
    return null;
  },

  // Update attendance notes
  updateNotes: async (attendanceId, notes) => {
    const response = await api.put(`/attendance/${attendanceId}`, { notes });
    return response.data;
  },

  // Get attendance by ID
  getAttendanceById: async (id) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  }
};

export default attendanceService;
const API_BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('edutrack_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  let data: any = {};
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `API request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth APIs
  async login(credentials: { email: string; password: string; role: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse<any>(res);
  },

  async signup(data: any) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Student APIs
  async getStudentProfile(id?: string) {
    const url = id ? `${API_BASE_URL}/students/profile/${id}` : `${API_BASE_URL}/students/profile`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  async updateStudentProfile(data: any) {
    const res = await fetch(`${API_BASE_URL}/students/profile`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async addAcademicRecord(data: any) {
    const res = await fetch(`${API_BASE_URL}/students/academic-records`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async addActivity(data: any) {
    const res = await fetch(`${API_BASE_URL}/students/activities`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  // Certificate APIs
  async uploadCertificate(formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/certificates/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    return handleResponse<any>(res);
  },

  async getMyCertificates() {
    const res = await fetch(`${API_BASE_URL}/certificates/my-certificates`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async getAllCertificates(status?: string, type?: string) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (type && type !== 'all') params.append('type', type);
    const res = await fetch(`${API_BASE_URL}/certificates/all?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async updateCertificateStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE_URL}/certificates/${id}/status`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse<any>(res);
  },

  // University APIs
  async getUniversityStudents(params?: { course?: string; year?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE_URL}/university/students?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async getUniversityAnalytics() {
    const res = await fetch(`${API_BASE_URL}/university/analytics`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async getUniversityReports() {
    const res = await fetch(`${API_BASE_URL}/university/reports`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  // Company APIs
  async searchCandidates(params?: { skills?: string; minGpa?: string; maxGpa?: string; course?: string; year?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE_URL}/company/students?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async getRecommendations(criteria: { requiredSkills: string[]; minGpa?: number; preferredCourse?: string }) {
    const res = await fetch(`${API_BASE_URL}/company/recommendations`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(criteria)
    });
    return handleResponse<any>(res);
  },

  async getCompanyAnalytics() {
    const res = await fetch(`${API_BASE_URL}/company/analytics`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  }
};

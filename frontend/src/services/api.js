import apiClient from './apiClient';

export const ContentApi = {
  getProducts: () => apiClient.get('/products'),
  getProductBySlug: (slug) => apiClient.get(`/products/${slug}`),
  getSolutions: () => apiClient.get('/solutions'),
  getServices: () => apiClient.get('/services'),
  getInsights: () => apiClient.get('/insights'),
  getCaseStudies: () => apiClient.get('/case-studies'),
  getCaseStudyBySlug: (slug) => apiClient.get(`/case-studies/${slug}`),
  getCompany: () => apiClient.get('/company'),
  getPartners: () => apiClient.get('/partners'),
  getMetrics: () => apiClient.get('/metrics'),
  getIntegrations: () => apiClient.get('/integrations'),
  getTestimonials: () => apiClient.get('/testimonials'),
  search: (query) => apiClient.get(`/search?q=${encodeURIComponent(query)}`),
};

export const BusinessApi = {
  getIndustries: () => apiClient.get('/industries'),
  getIndustryBySlug: (slug) => apiClient.get(`/industries/${slug}`),
  getCareers: () => apiClient.get('/careers'),
  getCareerById: (id) => apiClient.get(`/careers/${id}`),
};

export const ContactApi = {
  getContactInfo: () => apiClient.get('/contact'),
  submitInquiry: (payload) => apiClient.post('/contact/inquire', payload),
  scheduleAppointment: (payload) => apiClient.post('/contact/appointment', payload),
};

export const AssistantApi = {
  getContext: () => apiClient.get('/assistant/context'),
  getSuggestions: () => apiClient.get('/assistant/suggestions'),
};


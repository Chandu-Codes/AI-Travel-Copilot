import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into all outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travel_copilot_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const travelApi = {
  // Auth
  register: (payload: { name: string; email: string; password: string; travel_style?: string }) =>
    api.post('/auth/register', payload),
  login: (payload: { email: string; password: string }) => 
    api.post('/auth/login', payload),
  getProfile: (email?: string) => 
    api.get(email ? `/auth/me?email=${email}` : '/auth/me'),

  // Dashboard Dynamic Metrics
  getDashboardStats: () => api.get('/dashboard/stats'),

  // Bookings Tracker
  getBookings: () => api.get('/bookings'),
  createBooking: (payload: {
    booking_type: string;
    item_name: string;
    destination: string;
    amount_inr: number;
    details?: string;
    trip_id?: number;
    booking_date?: string;
  }) => api.post('/bookings', payload),
  cancelBooking: (id: number) => api.delete(`/bookings/${id}`),

  // Trips & Itineraries
  getTrips: () => api.get('/trips'),
  getTripById: (id: number | string) => api.get(`/trips/${id}`),
  planTrip: (payload: any) => api.post('/trips/plan', payload),
  deleteTrip: (id: number) => api.delete(`/trips/${id}`),

  // Destinations & Featured
  getFeaturedDestinations: () => api.get('/destinations/featured'),
  getDestinations: (params?: any) => api.get('/destinations', { params }),
  getRecommendations: (params?: any) => api.get('/recommendations', { params }),

  // Hotels
  getHotels: (params?: any) => api.get('/hotels', { params }),
  bookHotelAssist: (hotel_id: string) => api.post(`/hotels/book-assist?hotel_id=${hotel_id}`),

  // Flights
  searchFlights: (source = "Delhi", destination = "Goa", days_left = 15) => 
    api.get(`/flights/search?source_city=${encodeURIComponent(source)}&destination_city=${encodeURIComponent(destination)}&days_left=${days_left}`),
  predictFlight: (payload: any) => api.post('/flights/predict', payload),

  // Budget & Expenses
  optimizeBudget: (payload: any) => api.post('/budget/optimize', payload),
  getExpenses: () => api.get('/budget/expenses'),
  addExpense: (payload: any) => api.post('/budget/expenses', payload),
  deleteExpense: (id: number) => api.delete(`/budget/expenses/${id}`),

  // Disruptions
  getDisruptions: (destination?: string) => 
    api.get(destination ? `/disruptions?destination=${encodeURIComponent(destination)}` : '/disruptions'),
  checkFlightStatus: (flightNumber: string) => api.get(`/disruptions/check-flight?flight_number=${flightNumber}`),
  simulateRebooking: (flightNumber = "6E-204", destination = "Goa") => 
    api.post(`/disruptions/rebook-simulation?flight_number=${encodeURIComponent(flightNumber)}&destination=${encodeURIComponent(destination)}`),

  // Chat Copilot
  sendMessage: (message: string) => api.post('/chat', { message }),

  // Weather
  getWeather: (destination = "Goa") => api.get(`/weather?destination=${encodeURIComponent(destination)}`),
};

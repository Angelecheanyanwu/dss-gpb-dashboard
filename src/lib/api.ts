import axiosInstance from './axios';

// API Response Types
export interface RequestOTPResponse {
  message: string;
  success: boolean;
}

export interface LoginOTPResponse {
  success: boolean;
  message: string;
  access_token: string;
  accessToken?: string; // Legacy support
  user?: {
    email: string;
    name?: string;
    agency_id?: string;
    role?: string;
    [key: string]: any;
  };
}

// API Functions
export const requestOTP = async (email: string): Promise<RequestOTPResponse> => {
  const response = await axiosInstance.post<RequestOTPResponse>('/request-otp', {
    identifier: email,
  });
  return response.data;
};

export const verifyOTP = async (email: string, otp: string): Promise<LoginOTPResponse> => {
  const response = await axiosInstance.post<LoginOTPResponse>('/login-otp', {
    identifier: email,
    otp,
  });
  return response.data;
};

// Generic request helpers for future use
export const getRequest = async <T = any>(url: string, params?: any): Promise<T> => {
  const response = await axiosInstance.get<T>(url, { params });
  return response.data;
};

export const postRequest = async <T = any>(url: string, data?: any): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data);
  return response.data;
};

export const putRequest = async <T = any>(url: string, data?: any): Promise<T> => {
  const response = await axiosInstance.put<T>(url, data);
  return response.data;
};

export const deleteRequest = async <T = any>(url: string): Promise<T> => {
  const response = await axiosInstance.delete<T>(url);
  return response.data;
};

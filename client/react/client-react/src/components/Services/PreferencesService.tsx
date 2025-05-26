// services/preferences-service.ts
import api from "../api";

// קבוע לנתיב הבסיסי של ה-API
const API_URL = "https://smartchef-api.onrender.com/api/Preferences";

// הגדרת הטיפוסים
export interface Preference {
  id: number;
  userId: number;
  preferenceId: number;
}

export interface PreferenceType {
  id: number;
  name: string;
  displayName: string;
}

// פונקציה לקבלת ההעדפות של משתמש
export const getPreferences = async (userId: number): Promise<Preference[]> => {
  try {
    const response = await api.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// פונקציה לקבלת כל סוגי ההעדפות האפשריים
export const getPreferenceTypes = async (): Promise<PreferenceType[]> => {
  try {
    const response = await api.get(`${API_URL}/types`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// פונקציה לעדכון ההעדפות של משתמש
export const updateUserPreferences = async (userId: number, preferences: number[]): Promise<void> => {
  try {
    await api.post(`${API_URL}/${userId}`, { preferences });
  } catch (error) {
    throw error;
  }
};

// פונקציה להוספת העדפה בודדת
export const addUserPreference = async (userId: number, preferenceId: number): Promise<void> => {
  try {
    await api.post(`${API_URL}/${userId}/add`, { preferenceId });
  } catch (error) {
    throw error;
  }
};

// פונקציה להסרת העדפה בודדת
export const removeUserPreference = async (userId: number, preferenceId: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${userId}/${preferenceId}`);
  } catch (error) {
    throw error;
  }
};
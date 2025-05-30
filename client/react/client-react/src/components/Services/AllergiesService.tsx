// services/allergies-service.ts
import api from "../api";

// קבוע לנתיב הבסיסי של ה-API
const API_URL = "https://smartchef-api.onrender.com/api/Allergies";

// הגדרת הטיפוסים
export interface Allergy {
  id: number;
  userId: number;
  allergyId: number;
}

export interface AllergyType {
  id: number;
  name: string;
  displayName: string;
}

// פונקציה לקבלת האלרגיות של משתמש
export const getAllergies = async (userId: number): Promise<Allergy[]> => {
  try {
    const response = await api.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// פונקציה לקבלת כל סוגי האלרגיות האפשריים
export const getAllergyTypes = async (): Promise<AllergyType[]> => {
  try {
    const response = await api.get(`${API_URL}/types`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// פונקציה לעדכון האלרגיות של משתמש
export const updateUserAllergies = async (userId: number, allergies: number[]): Promise<void> => {
  try {
    await api.post(`${API_URL}/${userId}`, { allergies });
  } catch (error) {
    throw error;
  }
};

// פונקציה להוספת אלרגיה בודדת
export const addUserAllergy = async (userId: number, allergyId: number): Promise<void> => {
  try {
    await api.post(`${API_URL}/${userId}/add`, { allergyId });
  } catch (error) {
    throw error;
  }
};

// פונקציה להסרת אלרגיה בודדת
export const removeUserAllergy = async (userId: number, allergyId: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${userId}/${allergyId}`);
  } catch (error) {
    throw error;
  }
};
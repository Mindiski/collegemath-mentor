import { useState, useEffect } from 'react';

interface GuestData {
  quizResults: any[];
  exerciseProgress: Record<string, any>;
  achievements: string[];
  selectedLevel: string;
  lastActivity: string;
}

const GUEST_DATA_KEY = 'mathematica_guest_data';

export const useGuestData = () => {
  const [guestData, setGuestData] = useState<GuestData>({
    quizResults: [],
    exerciseProgress: {},
    achievements: [],
    selectedLevel: '',
    lastActivity: new Date().toISOString(),
  });

  useEffect(() => {
    const savedData = localStorage.getItem(GUEST_DATA_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setGuestData(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des données invité:', error);
      }
    }
  }, []);

  const saveGuestData = (data: Partial<GuestData>) => {
    const newData = {
      ...guestData,
      ...data,
      lastActivity: new Date().toISOString(),
    };
    setGuestData(newData);
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(newData));
  };

  const clearGuestData = () => {
    localStorage.removeItem(GUEST_DATA_KEY);
    setGuestData({
      quizResults: [],
      exerciseProgress: {},
      achievements: [],
      selectedLevel: '',
      lastActivity: new Date().toISOString(),
    });
  };

  const hasGuestData = () => {
    return guestData.quizResults.length > 0 || 
           Object.keys(guestData.exerciseProgress).length > 0 ||
           guestData.selectedLevel !== '';
  };

  return {
    guestData,
    saveGuestData,
    clearGuestData,
    hasGuestData,
  };
};
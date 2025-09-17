import { useState, useEffect } from 'react';

export interface GuestProgress {
  exercisesCompleted: number;
  lessonsViewed: number;
  quizResults: any[];
  selectedLevel: string;
  lastActivity: string;
}

export const useGuestData = () => {
  const [guestData, setGuestData] = useState<GuestProgress>({
    exercisesCompleted: 0,
    lessonsViewed: 0,
    quizResults: [],
    selectedLevel: '',
    lastActivity: new Date().toISOString(),
  });

  useEffect(() => {
    const savedData = localStorage.getItem('guestProgress');
    if (savedData) {
      setGuestData(JSON.parse(savedData));
    }
  }, []);

  const saveGuestData = (newData: Partial<GuestProgress>) => {
    const updatedData = {
      ...guestData,
      ...newData,
      lastActivity: new Date().toISOString(),
    };
    setGuestData(updatedData);
    localStorage.setItem('guestProgress', JSON.stringify(updatedData));
  };

  const clearGuestData = () => {
    localStorage.removeItem('guestProgress');
    setGuestData({
      exercisesCompleted: 0,
      lessonsViewed: 0,
      quizResults: [],
      selectedLevel: '',
      lastActivity: new Date().toISOString(),
    });
  };

  const hasActivity = () => {
    return guestData.exercisesCompleted > 0 || 
           guestData.lessonsViewed > 0 || 
           guestData.quizResults.length > 0;
  };

  return {
    guestData,
    saveGuestData,
    clearGuestData,
    hasActivity,
  };
};
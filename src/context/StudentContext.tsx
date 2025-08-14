// src/context/StudentContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentDetails } from '../types';

export type StudentPayment = StudentDetails & {
  txHash?: string;
  id: string;          // unique id (hash or timestamp)
  createdAt: number;   // for ordering
};

type Ctx = {
  students: StudentPayment[];
  addStudent: (s: StudentPayment) => void;
  clearAll: () => void;
};

const StudentContext = createContext<Ctx | undefined>(undefined);

const LS_KEY = 'aptosedu_students';

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<StudentPayment[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(students));
  }, [students]);

  const addStudent = (s: StudentPayment) => setStudents(prev => [...prev, s]);
  const clearAll = () => setStudents([]);

  return (
    <StudentContext.Provider value={{ students, addStudent, clearAll }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudents must be used within StudentProvider');
  return ctx;
};

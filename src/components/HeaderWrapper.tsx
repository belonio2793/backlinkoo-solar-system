import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';

export default function HeaderWrapper() {
  const location = useLocation();
  const path = location.pathname || '';

  // Hide global header on dashboard and admin routes to avoid duplicate headers
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    return null;
  }

  return <Header />;
}

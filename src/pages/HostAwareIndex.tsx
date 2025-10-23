import React from 'react';
import Index from './Index';

// Always render the SPA homepage immediately to avoid any initial blank state
export default function HostAwareIndex() {
  return <Index />;
}

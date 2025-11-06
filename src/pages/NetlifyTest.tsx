import React from 'react';
import NetlifyDomainsAPITest from '@/components/NetlifyDomainsAPITest';

export const NetlifyTest = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Netlify API Configuration Test
          </h1>
          <p className="text-gray-600">
            Testing the live environment setup with exact Netlify configuration
          </p>
        </div>
        
        <NetlifyDomainsAPITest />
      </div>
    </div>
  );
};

export default NetlifyTest;

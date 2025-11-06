import React from 'react';
import { BlogGenerationFixTest } from '@/components/BlogGenerationFixTest';

export default function BlogGenerationFixTestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blog Generation Error Fix
          </h1>
          <p className="text-gray-600">
            Fix the "null value violates not null constraint" error in blog generation
          </p>
        </div>
        
        <BlogGenerationFixTest />
      </div>
    </div>
  );
}

import React from 'react';
import { useParams } from 'react-router-dom';
import { BlogEditor } from '@/components/BlogEditor';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function BlogEditPage() {
  const { postId } = useParams<{ postId: string }>();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <BlogEditor postId={postId} mode="edit" />
      </div>
      <Footer />
    </>
  );
}

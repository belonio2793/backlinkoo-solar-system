import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Download, Shield, Zap, Lock, FileIcon, Image, Video, FileText, Smartphone, Award, TrendingUp, CheckCircle, ArrowRight, Globe } from 'lucide-react';
import '@/styles/tinyfast.css';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[name="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertPropertyMeta(property: string, content: string) {
  if (typeof document === 'undefined') return;
  const sel = `meta[property="${property}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSONLD(id: string, json: any) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`script[data-jsonld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('data-jsonld', id);
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

export default function TinyFast() {
  useEffect(() => {
    const title = 'TinyFast - Fast, Private File Compression for Mac | File Shrinker Tool';
    const description = 'TinyFast is a lightning-fast file compression tool for macOS that securely reduces file sizes for images, videos, and PDFs with 100% local processing. No cloud uploads, no privacy concerns.';
    const keywords = 'tinyfast, file compression, mac compressor, image compression, video compression, pdf reducer, fast file shrinker, local compression, private file compression, macos tool';

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('keywords', keywords);
    upsertMeta('viewport', 'width=device-width, initial-scale=1.0');
    upsertMeta('theme-color', '#ffffff');
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:type', 'website');
    upsertPropertyMeta('og:url', 'https://backlinkoo.com/tinyfast');
    upsertPropertyMeta('twitter:card', 'summary_large_image');
    upsertPropertyMeta('twitter:title', title);
    upsertPropertyMeta('twitter:description', description);
    upsertCanonical('https://backlinkoo.com/tinyfast');

    injectJSONLD('schema-org', {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'TinyFast',
      applicationCategory: 'Utilities',
      operatingSystem: 'macOS',
      description: description,
      url: 'https://backlinkoo.com/tinyfast',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '2847'
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="tinyfast-page bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="tinyfast-hero py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
              <p className="text-sm font-semibold text-blue-700">Fast File Compression for macOS</p>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              TinyFast: Compress Files Instantly
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              The revolutionary file compression tool that delivers blazing-fast speeds without sacrificing your privacy. Reduce file sizes across images, videos, and documents—all processed locally on your Mac.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">85%</div>
                <p className="text-sm text-slate-600 mt-2">Average Size Reduction</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">0.2s</div>
                <p className="text-sm text-slate-600 mt-2">Average Compression Time</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <p className="text-sm text-slate-600 mt-2">Private & Local Processing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is TinyFast Section */}
      <section className="tinyfast-what py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">What is TinyFast?</h2>
            
            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                TinyFast represents a breakthrough in file compression technology for macOS users who demand both speed and privacy. Unlike traditional file compression tools that rely on cloud services and external servers, TinyFast operates entirely on your local machine, ensuring that your sensitive files never leave your computer.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                In an era where data privacy has become increasingly important, TinyFast addresses a critical gap in the market. Whether you're a creative professional managing large media files, a business professional handling confidential documents, or simply someone who values personal data protection, TinyFast delivers the performance you need without the privacy trade-offs of traditional solutions.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                The application combines sophisticated compression algorithms with a native macOS interface, creating an experience that feels natural and intuitive to Mac users. No complex settings, no confusing options—just drag, drop, and watch your files shrink in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">100% Private Processing</h3>
                    <p className="text-slate-700">All file compression happens locally on your Mac. Files never touch external servers, cloud storage, or any third-party infrastructure.</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Lightning-Fast Performance</h3>
                    <p className="text-slate-700">Native macOS optimization delivers compression speeds that make other tools look outdated. Process entire batches in seconds.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="tinyfast-features py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-slate-900">Powerful Features That Deliver Results</h2>
            <p className="text-xl text-slate-600 text-center mb-16">TinyFast combines essential compression capabilities with a user experience that's refined and intentional.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Image,
                  title: 'Image Compression',
                  description: 'Reduce PNG, JPG, and GIF files while maintaining visual quality. Advanced algorithms intelligently compress images without noticeable quality loss.'
                },
                {
                  icon: Video,
                  title: 'Video Compression',
                  description: 'Shrink MP4, MOV, and other video formats with customizable quality settings. Perfect for sharing videos, archiving footage, or optimizing for streaming.'
                },
                {
                  icon: FileText,
                  title: 'PDF Optimization',
                  description: 'Compress PDF documents efficiently, reducing file size without affecting readability. Ideal for email attachments and digital distribution.'
                },
                {
                  icon: FileIcon,
                  title: 'Multi-Format Support',
                  description: 'Support for all common file types including archives, documents, and more. One tool handles everything your workflow requires.'
                },
                {
                  icon: Download,
                  title: 'Batch Processing',
                  description: 'Drag entire folders and process hundreds of files simultaneously. Save hours on file management and compression workflows.'
                },
                {
                  icon: Lock,
                  title: 'Smart Optimization',
                  description: 'Intelligent compression algorithms adapt to file type and content. Achieve optimal file sizes with sophisticated, automatic optimization.'
                }
              ].map((feature, idx) => (
                <Card key={idx} className="bg-slate-50 border border-slate-200 p-6">
                  <div className="flex items-start gap-4">
                    <feature.icon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
                      <p className="text-slate-700 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why TinyFast Section */}
      <section className="tinyfast-why py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-slate-900">Why Choose TinyFast?</h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Superior Speed Without Compromise</h3>
                  <p className="text-slate-700 leading-relaxed">
                    TinyFast's native macOS implementation eliminates the overhead of cloud uploads, API calls, and network latency. By processing everything locally on your machine, compression happens in seconds instead of minutes. This isn't just faster—it's a fundamentally different approach to file compression that respects your time.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Privacy That's Non-Negotiable</h3>
                  <p className="text-slate-700 leading-relaxed">
                    In a world of data breaches and privacy concerns, TinyFast puts you in complete control. Your files never leave your computer. There's no account required, no tracking, and no third-party access. This makes TinyFast ideal for handling confidential business documents, personal files, and sensitive media.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Intuitive Design Meets Power</h3>
                  <p className="text-slate-700 leading-relaxed">
                    TinyFast doesn't require a learning curve. The interface is clean, minimal, and focused on what matters: getting your files compressed. Yet beneath the simple surface lies sophisticated compression algorithms that deliver professional-grade results across multiple file formats.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">macOS Native Excellence</h3>
                  <p className="text-slate-700 leading-relaxed">
                    TinyFast is built from the ground up for macOS, not adapted from other platforms. It integrates seamlessly with the Mac experience, respects system preferences, and follows Apple's human interface guidelines. This results in an application that feels native and performs efficiently on your Mac.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-blue-600 mt-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Versatile Compression for Every Need</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Whether you're compressing photographs for a portfolio, reducing video file sizes for easier sharing, optimizing PDFs for email distribution, or archiving old files, TinyFast handles every scenario with equal efficiency. The unified interface supports all common file formats and understands the unique compression requirements of each type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="tinyfast-use-cases py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-900">Real-World Use Cases</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-blue-50 border border-blue-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">📸</span>
                  Photography & Creative Professionals
                </h3>
                <p className="text-slate-700">Compress high-resolution images and RAW files without quality loss. Share portfolios faster and manage large media libraries more efficiently. Store more creative assets locally without eating up drive space.</p>
              </Card>

              <Card className="bg-blue-50 border border-blue-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">🎬</span>
                  Video Content Creators
                </h3>
                <p className="text-slate-700">Optimize video files for different platforms and distribution channels. Reduce storage requirements while maintaining visual quality. Speed up file transfers and cloud backup processes for your video projects.</p>
              </Card>

              <Card className="bg-blue-50 border border-blue-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">💼</span>
                  Business Professionals
                </h3>
                <p className="text-slate-700">Confidently compress and share sensitive business documents. Reduce email attachment sizes while keeping data completely private. Maintain compliance requirements by avoiding cloud-based compression services.</p>
              </Card>

              <Card className="bg-blue-50 border border-blue-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">📚</span>
                  Educators & Researchers
                </h3>
                <p className="text-slate-700">Archive research materials and multimedia content securely. Create compressed backup copies of important files. Share educational resources efficiently while protecting data privacy and copyright compliance.</p>
              </Card>

              <Card className="bg-blue-50 border border-blue-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">🔒</span>
                  Privacy-Conscious Users
                </h3>
                <p className="text-slate-700">Reduce file sizes without surrendering privacy to third-party services. Keep your data on your computer at all times. Avoid tracking and data collection from cloud-based alternatives.</p>
              </Card>

              <Card className="bg-blue-50 border border-blue-200 p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900">
                  <span className="text-2xl">💻</span>
                  IT & Technical Teams
                </h3>
                <p className="text-slate-700">Automate file compression workflows with batch processing. Reduce storage and backup costs by compressing archives. Implement TinyFast across teams for consistent file optimization standards.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="tinyfast-how py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-900">How TinyFast Works</h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">1</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Drag & Drop Your Files</h3>
                  <p className="text-slate-700">Simply drag files or entire folders into TinyFast. The application accepts all supported file types and handles both single files and batch operations seamlessly.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">2</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Customization Options</h3>
                  <p className="text-slate-700">Configure compression settings based on your needs. Adjust quality levels, choose output formats, and set resolution requirements. Advanced users have granular control; casual users can rely on intelligent defaults.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">3</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Instant Compression</h3>
                  <p className="text-slate-700">Watch as TinyFast processes your files in real-time. With local processing and optimized algorithms, compression completes in seconds rather than the minutes or hours required by cloud-based competitors.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">4</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">Access Your Results</h3>
                  <p className="text-slate-700">Compressed files appear instantly in your specified output location. View compression statistics, compare file sizes, and verify results immediately. Everything stays on your Mac.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="tinyfast-comparison py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-900">TinyFast vs. Traditional Solutions</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="text-left py-4 px-4 text-lg font-bold text-slate-900">Feature</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-blue-600">TinyFast</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-slate-600">Cloud Compression</th>
                    <th className="text-center py-4 px-4 text-lg font-bold text-slate-600">Other Mac Tools</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4 font-semibold text-slate-900">Local Processing</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-500">✗</td>
                    <td className="text-center py-4 px-4 text-slate-500">Varies</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4 font-semibold text-slate-900">Privacy Guaranteed</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-500">✗</td>
                    <td className="text-center py-4 px-4 text-slate-500">Varies</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4 font-semibold text-slate-900">No Account Required</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-500">✗</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4 font-semibold text-slate-900">Lightning Speed</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-500">✗ Slow</td>
                    <td className="text-center py-4 px-4">Moderate</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4 font-semibold text-slate-900">Batch Processing</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-500">Limited</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4 font-semibold text-slate-900">Multi-Format Support</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4">Limited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-slate-900">macOS Native</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-500">N/A Web</td>
                    <td className="text-center py-4 px-4">Partial</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics Section */}
      <section className="tinyfast-stats py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-900">Why Thousands Choose TinyFast</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="bg-white border border-slate-200 p-8 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-900 mb-2">98%</div>
                <p className="text-sm text-slate-600">User Satisfaction Rate</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8 text-center">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-900 mb-2">12K+</div>
                <p className="text-sm text-slate-600">Active Users Monthly</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8 text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-900 mb-2">2.5M</div>
                <p className="text-sm text-slate-600">Files Compressed</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8 text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-900 mb-2">100%</div>
                <p className="text-sm text-slate-600">Privacy Guaranteed</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8 text-center">
                <Download className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-900 mb-2">0.2s</div>
                <p className="text-sm text-slate-600">Average Compression Time</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-8 text-center">
                <Lock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-900 mb-2">∞</div>
                <p className="text-sm text-slate-600">No Monthly Limits</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="tinyfast-faq py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-slate-900">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <Card className="bg-slate-50 border border-slate-200 p-8">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  Is TinyFast truly private?
                </h3>
                <p className="text-slate-700">Yes, absolutely. All compression processing happens locally on your Mac. No files are uploaded to servers, no personal data is collected, and no tracking occurs. TinyFast doesn't require an account, and your files never leave your computer.</p>
              </Card>

              <Card className="bg-slate-50 border border-slate-200 p-8">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  What file types does TinyFast support?
                </h3>
                <p className="text-slate-700">TinyFast supports all common file types including: images (PNG, JPG, GIF, WebP), videos (MP4, MOV, MKV), documents (PDF, DOCX), and more. The application is regularly updated to support additional formats.</p>
              </Card>

              <Card className="bg-slate-50 border border-slate-200 p-8">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  Will compression affect file quality?
                </h3>
                <p className="text-slate-700">TinyFast uses intelligent compression algorithms that minimize quality loss while maximizing file size reduction. For images and videos, you can adjust the quality slider to find the perfect balance for your needs.</p>
              </Card>

              <Card className="bg-slate-50 border border-slate-200 p-8">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  Can I compress multiple files at once?
                </h3>
                <p className="text-slate-700">Yes, TinyFast excels at batch processing. Drag entire folders or select multiple files, and the application will compress them all simultaneously. This significantly speeds up your workflow for large collections.</p>
              </Card>

              <Card className="bg-slate-50 border border-slate-200 p-8">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  What macOS versions are supported?
                </h3>
                <p className="text-slate-700">TinyFast is compatible with modern macOS versions. Check the official website for the minimum version requirement. The application is optimized for the latest macOS releases and receives regular updates.</p>
              </Card>

              <Card className="bg-slate-50 border border-slate-200 p-8">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  Is there a free trial or lifetime license?
                </h3>
                <p className="text-slate-700">TinyFast offers a free trial period so you can experience the benefits before committing. Once you're ready, choose between monthly and lifetime licensing options. Pricing is accessible and affordable for both individual users and teams.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Backlink Infinity */}
      <section className="tinyfast-cta py-20 md:py-32 bg-blue-50 border-t border-blue-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Boost Your Online Presence With Backlinks</h2>
            
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              While TinyFast helps you compress files efficiently, getting discovered online requires a different approach. At Backlink ∞, we help you build authority, drive traffic, and dominate search rankings by securing high-quality backlinks from authoritative sources.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white border border-slate-200 p-6">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2 text-slate-900">Increased Rankings</h3>
                <p className="text-sm text-slate-700">Quality backlinks signal authority to search engines, improving your rankings for competitive keywords.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2 text-slate-900">Organic Traffic Growth</h3>
                <p className="text-sm text-slate-700">Higher rankings lead to more organic traffic from people actively searching for your solutions.</p>
              </Card>

              <Card className="bg-white border border-slate-200 p-6">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold mb-2 text-slate-900">Domain Authority</h3>
                <p className="text-sm text-slate-700">Build lasting domain authority with strategic backlinks that improve all your pages' visibility.</p>
              </Card>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Why Choose Backlink ∞?</h3>
              <ul className="text-left space-y-3 text-slate-700 max-w-2xl mx-auto">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  Vetted, high-authority domains for maximum impact
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  Contextually relevant backlinks that add genuine value
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  Transparent reporting and ongoing support
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  White-hat SEO strategies that build lasting results
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-slate-700">
                Start your journey to better SEO rankings and increased organic traffic today.
              </p>
              <Button 
                className="px-10 py-8 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-3 mx-auto"
                onClick={() => window.open('https://backlinkoo.com/register', '_blank')}
              >
                <span>Register for Backlink ∞</span>
                <ArrowRight className="w-6 h-6" />
              </Button>
              <p className="text-sm text-slate-600 mt-4">
                Get started with high-quality backlinks and transform your SEO strategy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="tinyfast-final-cta py-16 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4 text-slate-900">Ready to Compress Files Faster?</h3>
            <p className="text-slate-700 mb-6">Experience the speed and privacy of TinyFast. Download today and see the difference local compression makes.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

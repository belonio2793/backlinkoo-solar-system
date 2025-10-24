export function AnimatedBlogHeadline() {
  const words = ["Generate", "a", "Blog", "Post", "For", "a", "Backlink"];
  const subtitle = "Generate a high quality, powerful blog post with your targeted keyword and boost your SEO score and search engine rankings in seconds.";

  return (
    <div className="text-center mb-8">
      <div className="relative inline-block">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-black">
          {words.map((word, index) => (
            <span key={index} className="inline-block text-black mr-3">
              {word}
            </span>
          ))}
        </h2>
      </div>

      <div className="mt-6">
        <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/**
 * Direct OpenAI Service for Blog Generation
 * Simplified service that directly calls OpenAI without complex templates
 */

import { LocalDevAPI } from '@/services/localDevAPI';
import { environmentVariablesService } from '@/services/environmentVariablesService';
import { blogService } from '@/services/blogService';

interface BlogRequest {
  keyword: string;
  anchorText: string;
  targetUrl: string;
  tone?: string;
  length?: string;
  industry?: string;
  additionalInstructions?: string;
}

interface BlogResponse {
  success: boolean;
  title?: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  blogUrl?: string;
  error?: string;
  metadata?: any;
}

export class DirectOpenAIService {
  /**
   * Generate blog post using direct OpenAI API call or local dev API
   */
  static async generateBlogPost(
    request: BlogRequest,
    options?: { endpoint?: string; source?: 'homepage' | 'automation' | 'generic'; onProgress?: (message: string) => void }
  ): Promise<BlogResponse> {
    try {
      console.log('🚀 Starting direct blog generation...');
      options?.onProgress?.('Preparing generation request...');

      // For homepage, always use the Netlify function (skip mock API)
      if (!options?.source || options?.source !== 'homepage') {
        if (LocalDevAPI.shouldUseMockAPI()) {
          console.log('🧪 Using local development API...');
          options?.onProgress?.('Using mock generator...');
          return await this.generateWithLocalAPI(request);
        }
      }

      // Check if OpenAI API key is configured (but allow Netlify functions to handle it)
      const clientApiKey = await environmentVariablesService.getOpenAIKey();

      // Don't fail if no local API key - Netlify functions might have it configured
      console.log('🔑 Local API key check:', clientApiKey ? 'Found' : 'Not found (will try Netlify function)');

      // Build the prompt dynamically with enhanced parameters
      const toneMap = {
        'professional': 'professional and authoritative',
        'conversational': 'conversational and friendly',
        'technical': 'technical and detailed',
        'casual': 'casual and engaging',
        'persuasive': 'persuasive and action-oriented'
      };

      const lengthMap = {
        'short': '500-800 words',
        'medium': '800-1200 words',
        'long': '1200-1800 words',
        'comprehensive': '1800+ words'
      };

      const targetTone = toneMap[request.tone || 'professional'] || 'professional and engaging';
      const targetLength = lengthMap[request.length || 'medium'] || '800-1200 words';

      // Use enhanced query patterns for superior content generation
      const eliteQueryPatterns = [
        `Create an authoritative ${targetLength} expert guide on ${request.keyword} that naturally integrates ${request.anchorText} as a valuable resource linking to ${request.targetUrl}`,
        `Write a comprehensive ${targetLength} industry-leading analysis of ${request.keyword} featuring ${request.anchorText} as a strategic reference to ${request.targetUrl}`,
        `Develop a ${targetLength} thought leadership piece on ${request.keyword} that seamlessly incorporates ${request.anchorText} directing readers to ${request.targetUrl}`
      ];

      const selectedPattern = eliteQueryPatterns[Math.floor(Math.random() * eliteQueryPatterns.length)];
      console.log('🚀 Selected elite query pattern:', selectedPattern);

      let prompt = `${selectedPattern}

🎯 CONTENT EXCELLENCE FRAMEWORK:
Create premium, viral-worthy content that positions this as the definitive resource on "${request.keyword}". This should be content that industry experts bookmark and reference.

📊 AUTHORITY REQUIREMENTS:
- Write ${targetLength} of expert-level, research-backed content
- Include 3-5 specific data points, statistics, or case studies
- Demonstrate deep subject matter expertise throughout
- Use ${targetTone} tone while maintaining authoritative credibility
- Create content that drives social shares and backlinks naturally
- Strategic placement of "${request.anchorText}" linking to ${request.targetUrl} where it adds maximum value

🏗️ PREMIUM STRUCTURE:
- Compelling H1 that promises specific, valuable outcomes
- Hook introduction with surprising insight or provocative question
- 4-6 main sections (H2) that each solve specific problems
- Actionable H3 subsections with concrete examples
- Natural integration of "${request.anchorText}" → ${request.targetUrl}
- Powerful conclusion with clear next steps

🚀 ENGAGEMENT OPTIMIZATION:
- Open with a statistic or insight that challenges conventional thinking
- Include numbered frameworks, step-by-step processes, or checklists
- Use psychological triggers and persuasive writing techniques
- Add transition phrases that maintain reading momentum
- Include rhetorical questions that increase engagement
- End sections with compelling hooks to continue reading`;

      if (request.industry) {
        prompt += `\n- Focus on ${request.industry} industry context and examples`;
      }

      if (request.additionalInstructions) {
        prompt += `\n- Additional requirements: ${request.additionalInstructions}`;
      }

      prompt += `

💻 CLEAN HTML OUTPUT FORMAT:
Return ONLY the body content as clean, well-structured HTML (no <html>, <head>, or <body> tags):

REQUIRED HTML STRUCTURE:
- <h2> for major sections (NO H1 - title will be added separately)
- <h3> for subsections
- <p> for all paragraphs (never leave text unwrapped)
- <ul>/<ol> and <li> for lists
- <strong> for key concepts (use sparingly)
- <a href="${request.targetUrl}" target="_blank" rel="noopener noreferrer">${request.anchorText}</a> for the backlink

CRITICAL FORMATTING RULES:
- Use proper HTML tags only - NO markdown symbols (**, ##, etc.)
- Every paragraph must be wrapped in <p></p> tags
- NO malformed patterns like **Text**more text - use <strong>Text</strong> more text
- NO HTML entities (&lt;, &gt;, &amp;) unless absolutely necessary
- NO title repetition in content (title handled separately)
- Clean, readable HTML that displays properly without processing

🎨 CONTENT EXCELLENCE STANDARDS:
- Every paragraph must provide immediate value
- Use specific examples and real-world applications
- Include actionable advice readers can implement today
- Write with confidence and authoritative expertise
- Create content that feels like a conversation with an industry leader
- Ensure the backlink enhances rather than interrupts the user experience

📈 SEO & VIRALITY OPTIMIZATION:
- Naturally incorporate "${request.keyword}" throughout the content
- Use semantic keywords and related industry terminology
- Create scannable content with clear visual hierarchy
- Include social proof elements and credibility indicators
- Write headlines that make readers want to share
- End with a compelling call-to-action that drives engagement

Generate content so valuable that readers feel they've discovered insider knowledge. This should be the kind of post that gets saved, shared, and referenced by industry professionals.`;

      console.log('🎯 Enhanced prompt:', prompt.substring(0, 200) + '...');

      console.log('📝 Generated prompt:', prompt);

      // Call OpenAI via Netlify function using safe wrapper (handles dev base + fetch interference)
      console.log('🚀 Calling OpenAI Netlify function...');
      options?.onProgress?.('Calling OpenAI (Netlify function)...');
      const functionName = options?.source === 'homepage'
        ? 'generate-openai-homepage-blog'
        : 'generate-openai';

      const { safeNetlifyFetch, getEnvironmentErrorMessage } = await import('@/utils/netlifyFunctionHelper');
      const nfRes = await safeNetlifyFetch(functionName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: request.keyword,
          url: request.targetUrl,
          anchorText: request.anchorText,
          wordCount: 1000,
          contentType: 'blog-post',
          tone: 'professional',
          apiKey: clientApiKey || null
        })
      });

      if (!nfRes.success) {
        options?.onProgress?.('Function call failed');
        throw new Error(getEnvironmentErrorMessage(nfRes.error || 'Function call failed', nfRes.isLocal));
      }

      const result = nfRes.data as any;
      options?.onProgress?.('OpenAI response received');

      if (!result.success || !result.content) {
        throw new Error(result.error || 'Failed to generate content');
      }

      const rawContent = result.content as string;

      // Extract title from the raw (unmodified) content for best accuracy
      const title = this.extractTitle(rawContent, request.keyword);
      const slug = this.generateSlug(title);

      // Clean and deduplicate the generated content (strip code-fences, "HTML Output" blocks, duplicate wrappers)
      const cleanedContent = this.cleanGeneratedContent(rawContent, title);
      const excerpt = this.extractExcerpt(cleanedContent);

      // Ensure backlink is present without breaking HTML structure
      const contentWithLink = this.ensureBacklink(cleanedContent, request.anchorText, request.targetUrl);

      // Optionally fetch a featured image (skip for homepage)
      let featuredImageUrl: string | undefined;
      let contentWithMedia = contentWithLink;
      if (options?.source !== 'homepage') {
        try {
          const { imageService } = await import('./imageService');
          const img = await imageService.fetchFeaturedImage(request.keyword, request.targetUrl, slug);
          if (img && img.url) {
            featuredImageUrl = img.url;
            contentWithMedia = imageService.injectFeaturedImage(contentWithLink, img, request.targetUrl, title);
          }
        } catch {}
      }

      // Save to blog posts using blog service (no manual ID setting)
      const blogData = {
        title,
        content: contentWithMedia,
        targetUrl: request.targetUrl,
        anchorText: request.anchorText,
        wordCount: contentWithMedia.replace(/<[^>]*>/g, '').split(/\s+/).length,
        readingTime: this.calculateReadingTime(contentWithMedia),
        seoScore: 85,
        customSlug: slug,
        featuredImage: featuredImageUrl
      };

      options?.onProgress?.('Saving post...');
      // Save the blog post using blog service
      const savedPost = await this.saveBlogPostData(blogData);
      const blogUrl = savedPost.published_url || `/blog/${savedPost.slug}`;
      options?.onProgress?.('Done');

      console.log('✅ Blog post generated successfully');

      return {
        success: true,
        title,
        content: contentWithLink,
        slug,
        excerpt,
        blogUrl,
        metadata: savedPost
      };

    } catch (error) {
      console.error('❌ Blog generation failed:', error);
      if (options?.onProgress) options.onProgress('Error: ' + (error instanceof Error ? error.message : 'Unknown'));

      // Handle specific stream errors gracefully
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('body stream already read') || errorMessage.includes('body used already')) {
        console.error('🔄 Response stream conflict detected - this suggests a network or parsing issue');
        return {
          success: false,
          error: 'Network communication error. Please try again.'
        };
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Extract title from content or generate from keyword
   */
  private static extractTitle(content: string, keyword: string): string {
    try {
      // Remove style/wrapper noise from Netlify formatter and look for a real heading
      const cleaned = String(content || '')
        .replace(/<style[\s\S]*?<\/style>/i, '')
        .replace(/<\/?.?div[^>]*generated-post[^>]*>/gi, '')
        .trim();

      // Prefer the first H1/H2 heading in the generated HTML (join consecutive headings if continuation)
      const headingMatch = cleaned.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>\s*(?:<br\s*\/?>\s*)?/i);
      let combined: string | null = null;
      if (headingMatch) {
        combined = headingMatch[1];
        const after = cleaned.slice((headingMatch.index || 0) + headingMatch[0].length);
        const nextHeading = after.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
        if (nextHeading && nextHeading[1]) {
          const cont = nextHeading[1];
          const startsLikeContinuation = /^([—–-]|of\b|the\b|and\b|in\b|on\b|for\b|to\b|with\b)/i.test(cont.trim());
          if (startsLikeContinuation) {
            combined = `${combined} ${cont}`;
          }
        }
      }
      if (combined) {
        let t = combined;
        t = t.replace(/<[^>]*>/g, '')
          .replace(/^\s*\*\*Title:\s*([^*]*)\*\*\s*/i, '$1')
          .replace(/^\*\*H1\*\*:\s*/i, '')
          .replace(/^\*\*Title\*\*:\s*/i, '')
          .replace(/^Title:\s*/gi, '')
          .replace(/^\*\*([^*]+?)\*\*:\s*/i, '$1')
          .replace(/^\*\*(.+?)\*\*$/i, '$1')
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/^#{1,6}\s+/, '')
          .trim();
        t = this.decodeHtmlEntities(t);
        t = t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        if (t.length >= 8 && t.length <= 140) return t;
      }

      // Fallback to first meaningful line of text (after stripping tags)
      const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length) {
        let t = lines.find(l => l && !l.startsWith('<')) || lines[0];
        t = t.replace(/<[^>]*>/g, '')
          .replace(/^\s*\*\*Title:\s*([^*]*)\*\*\s*/i, '$1')
          .replace(/^\*\*H1\*\*:\s*/i, '')
          .replace(/^\*\*Title\*\*:\s*/i, '')
          .replace(/^Title:\s*/gi, '')
          .replace(/^\*\*([^*]+?)\*\*:\s*/i, '$1')
          .replace(/^\*\*(.+?)\*\*$/i, '$1')
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/^#{1,6}\s+/, '')
          .trim();
        t = this.decodeHtmlEntities(t);
        t = t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        if (t.length >= 8 && t.length <= 140) return t;
      }
    } catch {}

    // Last resort: human-readable keyword (avoid generic templated titles)
    const keywordWords = keyword.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return keywordWords.join(' ');
  }

  /**
   * Decode HTML entities to prevent display issues
   */
  private static decodeHtmlEntities(text: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  /**
   * Generate URL-friendly slug with timestamp for uniqueness
   */
  private static generateSlug(title: string): string {
    const baseSlug = title
      .toLowerCase()
      // Strip HTML tags first
      .replace(/<[^>]*>/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 80); // Leave room for timestamp

    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  }

  /**
   * Extract excerpt from content
   */
  private static extractExcerpt(content: string): string {
    const paragraphs = content.split('\n\n').filter(p => p.trim() && p.length > 50);
    
    if (paragraphs.length > 0) {
      const firstParagraph = paragraphs[0].trim();
      return firstParagraph.length > 200 
        ? firstParagraph.substring(0, 200) + '...'
        : firstParagraph;
    }
    
    return content.substring(0, 200) + '...';
  }

  /**
   * Insert backlink naturally into content
   */
  private static ensureBacklink(content: string, anchorText: string, targetUrl: string): string {
    if (!content) return content;

    // Normalize existing markdown links and bare URLs to proper anchors first
    let s = String(content);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_m, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
    // Autolink bare URLs in text nodes (protect existing anchors)
    const anchors: string[] = [];
    s = s.replace(/<a\b[\s\S]*?<\/a>/gi, (m) => { anchors.push(m); return `__ANCHOR_${anchors.length - 1}__`; });
    s = s.replace(/(^|[\s(])((?:https?:)\/\/[^\s)<]+)/g, (m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    s = s.replace(/__ANCHOR_(\d+)__/g, (_m, i) => anchors[Number(i)] || '');

    // If backlink already present, return processed content
    if (s.includes(targetUrl) && /<a\b[^>]*href=\"[^\"]*\"/i.test(s)) return s;
    if (s.includes(`>${anchorText}<`)) return s;

    // If HTML structure is present, inject into the second paragraph when possible
    if (/<\s*\w+[^>]*>/.test(s)) {
      let inserted = false;
      let paraIndex = 0;
      const result = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, inner) => {
        paraIndex++;
        if (!inserted && paraIndex >= 2) {
          inserted = true;
          const link = `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer">${anchorText}</a>`;
          const suffix = inner.trim().endsWith('.') ? '' : '.';
          return `<p>${inner}${suffix} For more depth, see ${link}.</p>`;
        }
        return m;
      });
      if (inserted) return result;
      const link = `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer">${anchorText}</a>`;
      return s + `\n\n<p>Learn more here: ${link}</p>`;
    }

    // Plain text fallback
    const paragraphs = s.split('\n\n');
    const targetParagraphIndex = Math.min(2, Math.floor(paragraphs.length / 2));
    if (paragraphs[targetParagraphIndex] && paragraphs[targetParagraphIndex].length > 100) {
      const sentences = paragraphs[targetParagraphIndex].split('.');
      if (sentences.length > 1) {
        const linkedText = `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer">${anchorText}</a>`;
        sentences[0] = sentences[0] + `. For more information on this topic, check out ${linkedText}`;
        paragraphs[targetParagraphIndex] = sentences.join('.');
      }
    }
    return paragraphs.join('\n\n');
  }

  private static cleanGeneratedContent(raw: string, title: string): string {
    let s = String(raw || '');

    // Remove fenced code blocks (``` ... ```), including ```html
    s = s.replace(/```[\s\S]*?```/g, '');

    // Remove obvious labels that sometimes appear
    s = s.replace(/(^|\n)\s*(HTML\s*Output|Clean\s*HTML\s*Output|HTML\s*Version)\s*:?.*$/gi, '');

    // If both plain markers (e.g., **Title:**) and HTML tags exist, prefer the HTML portion
    const hasPlainMarkers = /(^|\n)\s*(\*\*\s*)?title\s*[:\-]/i.test(s) || /\*\*[\s\S]*?\*\*/.test(s);
    const firstHtmlIdx = s.search(/<h2\b|<p\b|<ul\b|<ol\b|<section\b|<article\b/i);
    if (hasPlainMarkers && firstHtmlIdx !== -1) {
      s = s.slice(firstHtmlIdx);
    }

    // Unwrap any outer article wrappers to avoid nested articles in templates
    s = s.replace(/^\s*<article[^>]*>/i, '').replace(/<\/article>\s*$/i, '');

    // Deduplicate accidental double-article blocks: if two <article> blocks exist back-to-back, keep the latter
    const doubleArticleMatch = s.match(/<article[\s\S]*<\/article>[\s\S]*<article[\s\S]*<\/article>/i);
    if (doubleArticleMatch) {
      const lastArticleMatch = s.match(/<article[^>]*>[\s\S]*<\/article>/gi);
      if (lastArticleMatch && lastArticleMatch.length) {
        const last = lastArticleMatch[lastArticleMatch.length - 1];
        s = last.replace(/^\s*<article[^>]*>/i, '').replace(/<\/article>\s*$/i, '');
      }
    }

    // Remove duplicate headings that mirror the title (h1-h3) anywhere near the start
    try {
      const esc = (title || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Remove a top-level H1 immediately
      s = s.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
      // Remove first H2/H3 that exactly matches the title
      const firstHeading = s.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i);
      if (firstHeading) {
        const inner = firstHeading[0].replace(/<[^>]*>/g, '').trim();
        const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '');
        if (norm(inner) && norm(inner) === norm(title || '')) {
          s = s.replace(firstHeading[0], '');
        }
      }
      // Also remove a leading paragraph that matches the title within the first few blocks
      const paragraphs = s.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
      const nTitle = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
      for (let i = 0; i < Math.min(3, paragraphs.length); i++) {
        const inner = paragraphs[i].replace(/<[^>]*>/g, '').trim();
        const nInner = inner.toLowerCase().replace(/[^a-z0-9]+/g, '');
        if (!nInner) continue;
        const isDup = nInner === nTitle || nInner.startsWith(nTitle) || nTitle.startsWith(nInner);
        if (isDup) {
          s = s.replace(paragraphs[i], '');
          break;
        }
      }
      // Remove bold-wrapped duplicate paragraph variations anywhere at the very top
      s = s.replace(new RegExp('^\\n?\\s*<p[^>]*>\\s*(?:<strong[^>]*>\\s*)?' + esc + '\\s*(?:<\\/strong>)?\\s*<\\/p>\\s*', 'i'), '');
    } catch {}

    // Final tidy: collapse multiple blank lines and trim
    s = s.replace(/\n{3,}/g, '\n\n').trim();

    return s;
  }

  /**
   * Calculate reading time
   */
  private static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Save blog post to storage using the blog service
   */
  private static async saveBlogPost(blogData: any): Promise<string> {
    try {
      // Import blog service
      const { blogService } = await import('@/services/blogService');

      const blogPostData = {
        title: blogData.title,
        content: blogData.content,
        keywords: blogData.keywords,
        targetUrl: blogData.target_url,
        anchorText: blogData.anchor_text,
        wordCount: blogData.word_count,
        readingTime: blogData.reading_time,
        seoScore: blogData.seo_score,
        metaDescription: blogData.meta_description,
        customSlug: blogData.slug
      };

      const savedPost = await blogService.createBlogPost(
        blogPostData,
        null, // no user_id for trial posts
        true  // is_trial_post = true
      );

      console.log('✅ Blog post saved to database');
      return savedPost.published_url || `/blog/${savedPost.slug}`;
    } catch (error) {
      console.error('Failed to save blog post:', error);
      throw new Error('Failed to save blog post to database');
    }
  }

  /**
   * Generate blog post using local development API
   */
  private static async generateWithLocalAPI(request: BlogRequest): Promise<BlogResponse> {
    try {
      const result = await LocalDevAPI.generateBlogPost({
        keyword: request.keyword,
        anchorText: request.anchorText,
        targetUrl: request.targetUrl,
        wordCount: 1000,
        contentType: 'blog-post',
        tone: 'professional'
      });

      if (!result.success || !result.content) {
        throw new Error(result.error || 'Failed to generate mock content');
      }

      const rawContent = result.content as string;

      // Extract title first from the raw content
      const title = this.extractTitle(rawContent, request.keyword);
      const slug = this.generateSlug(title);

      // Clean and deduplicate the generated content
      const cleanedContent = this.cleanGeneratedContent(rawContent, title);
      const excerpt = this.extractExcerpt(cleanedContent);

      // Save to blog posts
      const blogData = {
        title,
        content: cleanedContent,
        targetUrl: request.targetUrl,
        anchorText: request.anchorText,
        wordCount: cleanedContent.replace(/<[^>]*>/g, '').split(/\s+/).length,
        readingTime: this.calculateReadingTime(cleanedContent),
        seoScore: 85,
        customSlug: slug
      };

      // Save the blog post to database
      const savedPost = await this.saveBlogPostData(blogData);
      const blogUrl = savedPost.published_url || `/blog/${savedPost.slug}`;

      console.log('✅ Mock blog post generated and saved to database:', {
        id: savedPost.id,
        slug: savedPost.slug,
        title: savedPost.title
      });

      return {
        success: true,
        title,
        content: cleanedContent,
        slug,
        excerpt,
        blogUrl,
        metadata: savedPost
      };

    } catch (error) {
      console.error('❌ Mock blog generation failed:', error);

      // Handle specific stream errors gracefully
      const errorMessage = error instanceof Error ? error.message : 'Mock generation failed';
      if (errorMessage.includes('body stream already read') || errorMessage.includes('body used already')) {
        console.error('🔄 Stream conflict in mock API - retrying...');
        return {
          success: false,
          error: 'Network communication error. Please try again.'
        };
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Save blog post data using the blog service
   */
  private static async saveBlogPostData(blogData: any) {
    // Clean up old posts before creating new ones
    try {
      await LocalDevAPI.cleanupInvalidPosts();
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }

    return await blogService.createBlogPost(
      blogData,
      null, // no user_id for trial posts
      true  // is_trial_post = true
    );
  }


}

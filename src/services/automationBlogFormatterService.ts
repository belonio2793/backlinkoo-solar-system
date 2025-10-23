/**
 * Automation Blog Formatter Service
 * Formats blog posts according to selected templates for automation_domains
 */

import { AutomationTemplateService } from './automationTemplateService';
import { ImprovedBlogThemesService } from './improvedBlogThemesService';
import { slugGenerationService } from './slugGenerationService';

export interface BlogPostData {
  title: string;
  content: string;
  keyword: string;
  targetUrl: string;
  anchorText: string;
  excerpt?: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export interface FormattedBlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  htmlContent: string;
  plainTextContent: string;
  metaData: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  templateStyles: Record<string, string>;
  publishingData: {
    author: string;
    publishDate: string;
    readingTime: string;
    wordCount: number;
  };
  socialData: {
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
}

export interface FormattingOptions {
  templateId: number;
  domain?: string;
  includeBacklink?: boolean;
  backlinkPosition?: 'natural' | 'conclusion' | 'random';
  optimizeForSEO?: boolean;
  includeTableOfContents?: boolean;
  addSocialSharing?: boolean;
  customCSS?: string;
  generateExcerpt?: boolean;
}

export class AutomationBlogFormatterService {

  /**
   * Format blog post according to template specifications
   */
  static async formatBlogPost(
    postData: BlogPostData,
    options: FormattingOptions
  ): Promise<FormattedBlogPost> {
    try {
      console.log(`🎨 Formatting blog post "${postData.title}" with template ${options.templateId}`);
      
      // Get template configuration
      const template = AutomationTemplateService.getTemplate(options.templateId);
      if (!template) {
        throw new Error(`Template ${options.templateId} not found`);
      }
      
      const themeConfig = AutomationTemplateService.getTemplateThemeConfig(options.templateId);
      
      // Generate slug
      const slug = await this.generateSlug(postData.title, postData.keyword);
      
      // Format content according to template
      const formattedContent = await this.formatContentForTemplate(
        postData,
        template,
        options
      );
      
      // Generate HTML content
      const htmlContent = this.generateHTMLContent(
        postData,
        formattedContent,
        template,
        options
      );
      
      // Generate excerpt
      const excerpt = options.generateExcerpt !== false 
        ? this.generateExcerpt(formattedContent, postData.excerpt)
        : postData.excerpt || '';
      
      // Calculate reading time and word count
      const wordCount = this.calculateWordCount(formattedContent);
      const readingTime = this.calculateReadingTime(wordCount);
      
      // Generate meta data
      const metaData = this.generateMetaData(postData, excerpt, options.domain);
      
      // Generate social data
      const socialData = this.generateSocialData(postData, excerpt);
      
      // Generate template styles
      const templateStyles = this.generateTemplateStyles(template, themeConfig);
      
      const result: FormattedBlogPost = {
        title: postData.title,
        slug,
        content: formattedContent,
        excerpt,
        htmlContent,
        plainTextContent: this.stripHTML(formattedContent),
        metaData,
        templateStyles,
        publishingData: {
          author: postData.author || 'Content Team',
          publishDate: new Date().toISOString(),
          readingTime,
          wordCount
        },
        socialData
      };
      
      console.log(`✅ Blog post formatted successfully: ${slug} (${wordCount} words, ${readingTime} read)`);
      return result;
      
    } catch (error) {
      console.error('❌ Blog post formatting failed:', error);
      throw error;
    }
  }

  /**
   * Format content according to template style
   */
  private static async formatContentForTemplate(
    postData: BlogPostData,
    template: any,
    options: FormattingOptions
  ): Promise<string> {
    let content = postData.content;
    
    // Add template-specific formatting
    switch (template.id) {
      case 1: // Minimal Clean
        content = this.formatMinimalTemplate(content, postData);
        break;
      case 2: // Modern Business
        content = this.formatBusinessTemplate(content, postData);
        break;
      case 3: // Editorial Elegant
        content = this.formatEditorialTemplate(content, postData);
        break;
      case 4: // Tech Focus
        content = this.formatTechTemplate(content, postData);
        break;
      case 5: // Content Marketing
        content = this.formatMarketingTemplate(content, postData);
        break;
      case 6: // News & Updates
        content = this.formatNewsTemplate(content, postData);
        break;
      default:
        content = this.formatDefaultTemplate(content, postData);
    }
    
    // Add backlink if requested
    if (options.includeBacklink !== false) {
      content = this.insertBacklink(content, postData, options.backlinkPosition);
    }
    
    // Add table of contents if requested
    if (options.includeTableOfContents) {
      content = this.addTableOfContents(content);
    }
    
    // SEO optimization
    if (options.optimizeForSEO !== false) {
      content = this.optimizeForSEO(content, postData);
    }
    
    return content;
  }

  /**
   * Format content for Minimal Clean template
   */
  private static formatMinimalTemplate(content: string, postData: BlogPostData): string {
    return content
      .replace(/<h2>/g, '<h2 class="minimal-heading">')
      .replace(/<h3>/g, '<h3 class="minimal-subheading">')
      .replace(/<p>/g, '<p class="minimal-paragraph">')
      .replace(/<blockquote>/g, '<blockquote class="minimal-quote">')
      .replace(/<ul>/g, '<ul class="minimal-list">')
      .replace(/<ol>/g, '<ol class="minimal-numbered-list">');
  }

  /**
   * Format content for Modern Business template
   */
  private static formatBusinessTemplate(content: string, postData: BlogPostData): string {
    // Add call-to-action sections
    const ctaSection = `
      <div class="business-cta-section">
        <h3>Ready to Get Started?</h3>
        <p>Learn more about ${postData.keyword} and how it can benefit your business.</p>
      </div>
    `;
    
    return content
      .replace(/<h2>/g, '<h2 class="business-heading">')
      .replace(/<h3>/g, '<h3 class="business-subheading">')
      .replace(/<p>/g, '<p class="business-paragraph">')
      .replace(/<blockquote>/g, '<blockquote class="business-highlight">')
      + ctaSection;
  }

  /**
   * Format content for Editorial Elegant template
   */
  private static formatEditorialTemplate(content: string, postData: BlogPostData): string {
    // Add elegant typography classes
    return content
      .replace(/<h2>/g, '<h2 class="editorial-heading">')
      .replace(/<h3>/g, '<h3 class="editorial-subheading">')
      .replace(/<p>/g, '<p class="editorial-paragraph">')
      .replace(/<blockquote>/g, '<blockquote class="editorial-pullquote">')
      .replace(/^<p class="editorial-paragraph">/, '<p class="editorial-lead">'); // First paragraph as lead
  }

  /**
   * Format content for Tech Focus template
   */
  private static formatTechTemplate(content: string, postData: BlogPostData): string {
    // Add code-friendly formatting
    return content
      .replace(/<h2>/g, '<h2 class="tech-heading">')
      .replace(/<h3>/g, '<h3 class="tech-subheading">')
      .replace(/<p>/g, '<p class="tech-paragraph">')
      .replace(/<code>/g, '<code class="tech-inline-code">')
      .replace(/<pre>/g, '<pre class="tech-code-block">')
      .replace(/<blockquote>/g, '<blockquote class="tech-note">');
  }

  /**
   * Format content for Marketing template
   */
  private static formatMarketingTemplate(content: string, postData: BlogPostData): string {
    // Add conversion-focused elements
    const benefitsSection = `
      <div class="marketing-benefits">
        <h3>Key Benefits</h3>
        <ul class="marketing-benefits-list">
          <li>Improved ${postData.keyword} performance</li>
          <li>Enhanced user experience</li>
          <li>Better ROI and results</li>
        </ul>
      </div>
    `;
    
    return content
      .replace(/<h2>/g, '<h2 class="marketing-heading">')
      .replace(/<h3>/g, '<h3 class="marketing-subheading">')
      .replace(/<p>/g, '<p class="marketing-paragraph">')
      + benefitsSection;
  }

  /**
   * Format content for News template
   */
  private static formatNewsTemplate(content: string, postData: BlogPostData): string {
    // Add news-style formatting with urgency
    const newsHeader = `
      <div class="news-header">
        <span class="news-timestamp">${new Date().toLocaleDateString()}</span>
        <span class="news-category">Latest Update</span>
      </div>
    `;
    
    return newsHeader + content
      .replace(/<h2>/g, '<h2 class="news-heading">')
      .replace(/<h3>/g, '<h3 class="news-subheading">')
      .replace(/<p>/g, '<p class="news-paragraph">');
  }

  /**
   * Default template formatting
   */
  private static formatDefaultTemplate(content: string, postData: BlogPostData): string {
    return content
      .replace(/<h2>/g, '<h2 class="default-heading">')
      .replace(/<h3>/g, '<h3 class="default-subheading">')
      .replace(/<p>/g, '<p class="default-paragraph">');
  }

  /**
   * Insert backlink naturally into content
   */
  private static insertBacklink(
    content: string,
    postData: BlogPostData,
    position: FormattingOptions['backlinkPosition'] = 'natural'
  ): string {
    const backlink = `<a href="${postData.targetUrl}" class="content-backlink" rel="noopener">${postData.anchorText}</a>`;
    
    switch (position) {
      case 'conclusion':
        return content + `\n\n<p>For more information about ${postData.keyword}, visit ${backlink}.</p>`;
        
      case 'random':
        const paragraphs = content.split('</p>');
        if (paragraphs.length > 2) {
          const randomIndex = Math.floor(Math.random() * (paragraphs.length - 2)) + 1;
          paragraphs[randomIndex] += ` You can learn more about ${backlink}.`;
        }
        return paragraphs.join('</p>');
        
      case 'natural':
      default:
        // Find a natural place to insert the link (middle of content)
        const sentences = content.split('. ');
        if (sentences.length > 3) {
          const middleIndex = Math.floor(sentences.length / 2);
          sentences[middleIndex] += ` For detailed information about this topic, check out ${backlink}`;
        }
        return sentences.join('. ');
    }
  }

  /**
   * Add table of contents
   */
  private static addTableOfContents(content: string): string {
    const headings = content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/g) || [];
    
    if (headings.length < 2) return content;
    
    const tocItems = headings.map((heading, index) => {
      const text = heading.replace(/<[^>]*>/g, '');
      const id = `section-${index + 1}`;
      const level = heading.startsWith('<h2') ? 'toc-main' : 'toc-sub';
      
      // Add ID to heading
      content = content.replace(heading, heading.replace('>', ` id="${id}">`));
      
      return `<li class="${level}"><a href="#${id}">${text}</a></li>`;
    }).join('\n');
    
    const toc = `
      <div class="table-of-contents">
        <h3>Table of Contents</h3>
        <ul class="toc-list">
          ${tocItems}
        </ul>
      </div>
    `;
    
    return toc + '\n\n' + content;
  }

  /**
   * Optimize content for SEO
   */
  private static optimizeForSEO(content: string, postData: BlogPostData): string {
    const keyword = postData.keyword.toLowerCase();
    
    // Ensure keyword appears in first paragraph
    if (!content.toLowerCase().includes(keyword)) {
      content = content.replace(
        /<p[^>]*>/,
        `<p>When it comes to ${postData.keyword}, understanding the fundamentals is crucial. `
      );
    }
    
    // Add semantic keywords
    const semanticKeywords = this.generateSemanticKeywords(keyword);
    semanticKeywords.forEach((semanticKeyword, index) => {
      if (index < 3 && !content.toLowerCase().includes(semanticKeyword)) {
        // Add semantic keywords naturally
        content = content.replace(
          /<\/p>/,
          ` This approach to ${semanticKeyword} has proven effective across various applications.</p>`
        );
      }
    });
    
    // Add schema markup hints
    content = `<div itemscope itemtype="https://schema.org/Article">\n${content}\n</div>`;
    
    return content;
  }

  /**
   * Generate semantic keywords
   */
  private static generateSemanticKeywords(keyword: string): string[] {
    const baseKeywords = [
      `${keyword} tips`,
      `${keyword} guide`,
      `${keyword} best practices`,
      `${keyword} strategies`,
      `${keyword} solutions`,
      `${keyword} benefits`,
      `${keyword} techniques`,
      `${keyword} methods`
    ];
    
    return baseKeywords.slice(0, 5);
  }

  /**
   * Generate HTML content with template styling
   */
  private static generateHTMLContent(
    postData: BlogPostData,
    content: string,
    template: any,
    options: FormattingOptions
  ): string {
    const cssStyles = this.generateInlineCSS(template);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${postData.title}</title>
    <style>${cssStyles}</style>
    ${options.customCSS ? `<style>${options.customCSS}</style>` : ''}
</head>
<body class="template-${template.id}">
    <article class="blog-post">
        <header class="post-header">
            <h1 class="post-title">${postData.title}</h1>
            <div class="post-meta">
                <span class="post-date">${new Date().toLocaleDateString()}</span>
                <span class="post-author">${postData.author || 'Content Team'}</span>
                ${postData.category ? `<span class="post-category">${postData.category}</span>` : ''}
            </div>
        </header>
        <div class="post-content">
            ${content}
        </div>
        ${options.addSocialSharing ? this.generateSocialSharing(postData) : ''}
    </article>
</body>
</html>`;
  }

  /**
   * Generate inline CSS for template
   */
  private static generateInlineCSS(template: any): string {
    return `
      .blog-post { 
        font-family: ${template.styles.fontFamily}; 
        color: ${template.styles.textColor}; 
        background-color: ${template.styles.backgroundColor};
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .post-title { 
        color: ${template.styles.primaryColor}; 
        font-size: 2.5em;
        margin-bottom: 10px;
      }
      .post-meta { 
        color: #666; 
        margin-bottom: 30px;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
      }
      .content-backlink { 
        color: ${template.styles.primaryColor}; 
        text-decoration: none;
        border-bottom: 1px solid ${template.styles.primaryColor};
      }
      .content-backlink:hover { 
        opacity: 0.8; 
      }
    `;
  }

  /**
   * Generate social sharing buttons
   */
  private static generateSocialSharing(postData: BlogPostData): string {
    return `
      <div class="social-sharing">
        <h4>Share this article:</h4>
        <div class="social-buttons">
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(postData.title)}" target="_blank">Twitter</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postData.targetUrl)}" target="_blank">Facebook</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postData.targetUrl)}" target="_blank">LinkedIn</a>
        </div>
      </div>
    `;
  }

  /**
   * Generate excerpt from content
   */
  private static generateExcerpt(content: string, existingExcerpt?: string): string {
    if (existingExcerpt) return existingExcerpt;
    
    const plainText = this.stripHTML(content);
    const sentences = plainText.split('. ');
    
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  }

  /**
   * Generate meta data for SEO
   */
  private static generateMetaData(
    postData: BlogPostData,
    excerpt: string,
    domain?: string
  ): FormattedBlogPost['metaData'] {
    return {
      title: `${postData.title} | ${domain ? domain : 'Blog'}`,
      description: excerpt.substring(0, 155) + (excerpt.length > 155 ? '...' : ''),
      keywords: [
        postData.keyword,
        ...this.generateSemanticKeywords(postData.keyword).slice(0, 8),
        ...(postData.tags || [])
      ],
      canonicalUrl: domain ? `https://${domain}/blog/${slugGenerationService.generateIntelligentSlug({ title: postData.title })}` : undefined
    };
  }

  /**
   * Generate social media data
   */
  private static generateSocialData(
    postData: BlogPostData,
    excerpt: string
  ): FormattedBlogPost['socialData'] {
    return {
      ogTitle: postData.title,
      ogDescription: excerpt,
      twitterTitle: postData.title.length > 70 ? postData.title.substring(0, 67) + '...' : postData.title,
      twitterDescription: excerpt.length > 200 ? excerpt.substring(0, 197) + '...' : excerpt
    };
  }

  /**
   * Generate template styles object
   */
  private static generateTemplateStyles(template: any, themeConfig: any): Record<string, string> {
    return {
      ...template.styles,
      ...ImprovedBlogThemesService.generateCSSVariables(themeConfig.styles)
    };
  }

  /**
   * Generate slug for blog post
   */
  private static async generateSlug(title: string, keyword: string): Promise<string> {
    return await slugGenerationService.generateUniqueSlug({
      title,
      keywords: [keyword],
      includeKeyword: true,
      maxLength: 50
    });
  }

  /**
   * Strip HTML tags from content
   */
  private static stripHTML(content: string): string {
    return content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Calculate word count
   */
  private static calculateWordCount(content: string): number {
    const plainText = this.stripHTML(content);
    return plainText.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Calculate reading time
   */
  private static calculateReadingTime(wordCount: number): string {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }

  /**
   * Batch format multiple blog posts
   */
  static async batchFormatBlogPosts(
    postsData: BlogPostData[],
    options: FormattingOptions[]
  ): Promise<FormattedBlogPost[]> {
    const results: FormattedBlogPost[] = [];
    
    for (let i = 0; i < postsData.length; i++) {
      const postData = postsData[i];
      const postOptions = options[i] || options[0];
      
      try {
        const formatted = await this.formatBlogPost(postData, postOptions);
        results.push(formatted);
      } catch (error) {
        console.error(`Error formatting post "${postData.title}":`, error);
        // Continue with other posts
      }
      
      // Rate limiting between posts
      if (i < postsData.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return results;
  }
}

export default AutomationBlogFormatterService;

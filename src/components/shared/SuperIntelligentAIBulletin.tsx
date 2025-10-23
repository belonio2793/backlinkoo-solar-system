import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeBlogExamples from '@/components/examples/ThemeBlogExamples';

interface SuperIntelligentAIBulletinProps {
  className?: string;
}

export const SuperIntelligentAIBulletin: React.FC<SuperIntelligentAIBulletinProps> = ({ className }) => {
  const [tab, setTab] = useState<'examples' | 'pbn' | 'footprints' | 'metrics'>('examples');

  return (
    <div className={`rounded-lg border border-border bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4 sm:p-5 ${className || ''}`}>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <div className="w-full">
          <TabsList className="w-full flex justify-center border-b border-border/60">
            <TabsTrigger value="examples" className="text-sm px-4 py-2">Examples</TabsTrigger>
            <TabsTrigger value="pbn" className="text-sm px-4 py-2">Super Intelligence</TabsTrigger>
            <TabsTrigger value="footprints" className="text-sm px-4 py-2">Footprints</TabsTrigger>
            <TabsTrigger value="metrics" className="text-sm px-4 py-2">Domain Metrics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="examples" className="mt-4">
          <ThemeBlogExamples />
        </TabsContent>

        <TabsContent value="pbn" className="mt-4">
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>No footprints.</li>
            <li>Auto blog post generation.</li>
            <li>Add domains and create an infinite number of unique targeted blog posts with original, search engine optimized content.</li>
            <li>Distributed across multiple CDNs that offer an infinite number of unique IP addresses.</li>
            <li>The most intelligent, powerful and sophisticated blog post and backlink building software in the industry.</li>
            <li>Untraceable.</li>
            <li>Multiple indexing protocols and safeguarded with SSL certificate issuance for every domain.</li>
            <li>Simple setup and customization.</li>
            <li>Designed with brilliant industry leading engineers and search engine double optimization practitioners.</li>
          </ul>
        </TabsContent>

        <TabsContent value="footprints" className="mt-3 text-sm text-gray-700">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground">Diverse Hosting & IPs</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Use different servers, CDNs, or hosting providers.</li>
                <li>Cloudflare or similar services can help mask IPs.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Different Registrars & Whois Privacy</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Use Whois privacy or vary registrars to avoid ownership trails.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Varied Site Designs & Tech</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Change themes, layouts, plugins, and CMS setups.</li>
                <li>Mix WordPress, static HTML, or other CMSs.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Natural Link Profiles</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Vary anchor text (brand, generic, long-tail, naked URLs).</li>
                <li>Don’t over-optimize — keep links natural.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Unique, Quality Content</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Make each site valuable in its own right.</li>
                <li>Avoid spun or templated filler content.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Separate Analytics/Tracking</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Don’t use the same GA ID or AdSense across all sites.</li>
                <li>Use alternative trackers if needed.</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-3 text-sm text-gray-700">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground">Domain Authority (DA) / Domain Rating (DR)</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Measures the overall strength of a website’s backlink profile.</li>
                <li>A higher DA/DR means links from that site typically carry more weight.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Page Authority (PA) / URL Rating (UR)</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Evaluates the authority of the specific page linking to you, not just the domain.</li>
                <li>A contextual link from a strong page often outranks one from a weaker but high-DA domain.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Relevance of the Linking Site</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Google values links from websites that are topically related to your niche.</li>
                <li>Example: A backlink about fitness is far stronger on a health site than on a car blog.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Anchor Text Distribution</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>The clickable text of a backlink influences what keywords your page ranks for.</li>
                <li>A natural mix (brand names, naked URLs, generic terms, long-tail keywords) is key to avoiding penalties.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">DoFollow vs NoFollow</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>DoFollow links pass ranking power (link equity).</li>
                <li>NoFollow links don’t directly transfer authority but still build trust and traffic.</li>
                <li>A natural backlink profile has both.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Traffic of the Linking Site</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Links from websites with real organic traffic are more valuable.</li>
                <li>They send both ranking signals and referral visitors.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Placement & Context of the Link</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>In-content (editorial) links carry far more weight than sidebar or footer links.</li>
                <li>The closer the link is to relevant content, the stronger its SEO impact.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Diversity of Referring Domains</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>100 links from 1 site won’t move rankings like 10 links from 10 different sites.</li>
                <li>Google rewards domain diversity in your backlink profile.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Link Velocity (Growth Rate)</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>How quickly you acquire backlinks matters.</li>
                <li>Steady, natural growth is safer than sudden spikes that look manipulative.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Trust & Spam Scores</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Links from spammy, hacked, or irrelevant sites can harm rankings.</li>
                <li>High-trust domains (.edu, .gov, media sites) transfer stronger credibility.</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperIntelligentAIBulletin;

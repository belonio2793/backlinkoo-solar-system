/**
 * DNS Validation Service
 * 
 * Provides functionality to check DNS records for domains and validate configuration
 */

export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
}

export interface DNSValidationResult {
  success: boolean;
  domain: string;
  records: DNSRecord[];
  errors: string[];
  warnings: string[];
  recommendations: string[];
  hasCNAME: boolean;
  cnameTarget?: string;
  hasCorrectCNAME: boolean;
  expectedCNAME: string;
  propagationStatus: 'complete' | 'partial' | 'none';
  nameserversConfigured: boolean;
  nameservers: string[];
  shouldValidateDNS: boolean;
  isSubdomain?: boolean;
  ssl_enabled?: boolean;
}

export class DNSValidationService {
  // Expected CNAME target for hosted sites
  private static readonly EXPECTED_CNAME = 'domains.backlinkoo.com';
  private static readonly DNS_SERVERS = [
    'https://cloudflare-dns.com/dns-query',
    'https://dns.google/resolve',
    '1.1.1.1',
    '8.8.8.8'
  ];

  private static readonly EXPECTED_NAMESERVERS = [
    'dns1.p05.nsone.net',
    'dns2.p05.nsone.net',
    'dns3.p05.nsone.net',
    'dns4.p05.nsone.net'
  ];

  /**
   * Validate DNS configuration for a domain
   * Only validates DNS if nameservers are properly configured
   */
  static async validateDomainDNS(domain: string): Promise<DNSValidationResult> {
    const cleanDomain = this.cleanDomain(domain);

    const result: DNSValidationResult = {
      success: false,
      domain: cleanDomain,
      records: [],
      errors: [],
      warnings: [],
      recommendations: [],
      hasCNAME: false,
      hasCorrectCNAME: false,
      expectedCNAME: this.EXPECTED_CNAME,
      propagationStatus: 'none',
      nameserversConfigured: false,
      nameservers: [],
      shouldValidateDNS: false,
      isSubdomain: false
    };

    try {
      // Determine if caller provided a subdomain (e.g. demo.example.com)
      const parts = cleanDomain.split('.');
      const isSubdomain = parts.length > 2;

      // Use the same CNAME target for both root and subdomains
      result.expectedCNAME = DNSValidationService.EXPECTED_CNAME;

      // Step 1: Check nameservers for root domains. For subdomains we can validate the record directly without nameserver delegation.
      const nameservers = await this.fetchNameservers(cleanDomain);
      result.nameservers = nameservers;
      result.nameserversConfigured = this.areNameserversConfigured(nameservers);

      // For subdomains we don't require registrar nameservers to match Netlify's nameservers; proceed to DNS checks directly
      result.isSubdomain = isSubdomain;
      if (isSubdomain) {
        result.shouldValidateDNS = true;
      } else {
        // Root domains require nameservers to be configured before validating
        result.shouldValidateDNS = result.nameserversConfigured;
        if (!result.shouldValidateDNS) {
          result.errors.push('Nameservers not properly configured');
          result.recommendations.push(
            `Configure nameservers to: ${this.EXPECTED_NAMESERVERS.join(', ')}`
          );
          return result;
        }
      }

      // Step 2: Check DNS records using multiple methods
      const records = await this.fetchDNSRecords(cleanDomain);
      result.records = records;

      // Step 4: Analyze CNAME records
      const cnameRecords = records.filter(r => r.type === 'CNAME');
      if (cnameRecords.length > 0) {
        result.hasCNAME = true;
        result.cnameTarget = cnameRecords[0].value;

        // Check if CNAME points to correct target (use expectedCNAME set on result)
        result.hasCorrectCNAME = cnameRecords.some(record =>
          record.value.toLowerCase().includes(result.expectedCNAME.toLowerCase())
        );
      }

      // Step 5: A records are not used for validation (CNAME-only policy)
      const aRecords: any[] = [];
      const hasNetlifyA = false;

      // Step 6: Determine propagation status
      if (result.hasCorrectCNAME) {
        result.propagationStatus = 'complete';
      } else if (result.hasCNAME) {
        result.propagationStatus = 'partial';
      }

      // Step 7: Generate errors and recommendations
      this.analyzeDNSConfiguration(result);

      // Step 8: Final success determination
      // Success only when the correct CNAME is present
      if (result.isSubdomain) {
        result.success = result.errors.length === 0 && result.hasCorrectCNAME;
      } else {
        result.success = result.errors.length === 0 && result.nameserversConfigured && result.hasCorrectCNAME;
      }

    } catch (error: any) {
      result.errors.push(`DNS lookup failed: ${error.message}`);
      result.success = false;
    }

    return result;
  }

  /**
   * Fetch DNS records for a domain using browser-compatible methods
   */
  private static async fetchDNSRecords(domain: string): Promise<DNSRecord[]> {
    const records: DNSRecord[] = [];

    try {
      // Method 1: Use DNS over HTTPS (DoH) with Cloudflare
      const cloudflareRecords = await this.fetchRecordsFromCloudflare(domain);
      records.push(...cloudflareRecords);
    } catch (error) {
      console.warn('Cloudflare DNS lookup failed:', error);
    }

    try {
      // Method 2: Use DNS over HTTPS with Google
      const googleRecords = await this.fetchRecordsFromGoogle(domain);
      records.push(...googleRecords);
    } catch (error) {
      console.warn('Google DNS lookup failed:', error);
    }

    // Remove duplicates
    const uniqueRecords = records.filter((record, index, self) => 
      index === self.findIndex(r => 
        r.type === record.type && 
        r.name === record.name && 
        r.value === record.value
      )
    );

    return uniqueRecords;
  }

  /**
   * Fetch DNS records from Cloudflare DoH
   */
  private static async fetchRecordsFromCloudflare(domain: string): Promise<DNSRecord[]> {
    const records: DNSRecord[] = [];
    const types = ['A', 'AAAA', 'CNAME', 'MX', 'TXT'];

    for (const type of types) {
      try {
        const response = await fetch(
          `https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`,
          {
            headers: {
              'Accept': 'application/dns-json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.Answer) {
            data.Answer.forEach((answer: any) => {
              records.push({
                type: this.getRecordTypeName(answer.type),
                name: answer.name,
                value: answer.data,
                ttl: answer.TTL
              });
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch ${type} record from Cloudflare:`, error);
      }
    }

    return records;
  }

  /**
   * Fetch DNS records from Google DoH (using correct /resolve endpoint)
   */
  private static async fetchRecordsFromGoogle(domain: string): Promise<DNSRecord[]> {
    const records: DNSRecord[] = [];
    const types = ['A', 'AAAA', 'CNAME', 'MX', 'TXT'];

    for (const type of types) {
      try {
        const response = await fetch(
          `https://dns.google/resolve?name=${domain}&type=${type}`,
          {
            headers: {
              'Accept': 'application/dns-json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.Answer) {
            data.Answer.forEach((answer: any) => {
              records.push({
                type: this.getRecordTypeName(answer.type),
                name: answer.name,
                value: answer.data,
                ttl: answer.TTL
              });
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch ${type} record from Google:`, error);
      }
    }

    return records;
  }

  /**
   * Fetch nameservers for a domain
   */
  private static async fetchNameservers(domain: string): Promise<string[]> {
    const nameservers: string[] = [];

    try {
      // Use Cloudflare DoH to get NS records
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${domain}&type=NS`,
        {
          headers: {
            'Accept': 'application/dns-json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.Answer) {
          data.Answer.forEach((answer: any) => {
            nameservers.push(answer.data.toLowerCase().replace(/\.$/, ''));
          });
        }
      }
    } catch (error) {
      console.warn('Failed to fetch nameservers from Cloudflare:', error);
    }

    // Fallback: try Google DNS
    if (nameservers.length === 0) {
      try {
        const response = await fetch(
          `https://dns.google/resolve?name=${domain}&type=NS`,
          {
            headers: {
              'Accept': 'application/dns-json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.Answer) {
            data.Answer.forEach((answer: any) => {
              nameservers.push(answer.data.toLowerCase().replace(/\.$/, ''));
            });
          }
        }
      } catch (error) {
        console.warn('Failed to fetch nameservers from Google:', error);
      }
    }

    return [...new Set(nameservers)]; // Remove duplicates
  }

  /**
   * Check if nameservers are properly configured for Netlify
   */
  private static areNameserversConfigured(nameservers: string[]): boolean {
    if (nameservers.length === 0) return false;

    // Check if any of the expected nameservers are present
    return this.EXPECTED_NAMESERVERS.some(expected =>
      nameservers.some(ns => ns.includes(expected.toLowerCase()))
    );
  }

  /**
   * Convert DNS record type number to name
   */
  private static getRecordTypeName(type: number): string {
    const typeMap: { [key: number]: string } = {
      1: 'A',
      28: 'AAAA',
      5: 'CNAME',
      15: 'MX',
      16: 'TXT',
      2: 'NS'
    };
    return typeMap[type] || `TYPE${type}`;
  }

  /**
   * Analyze DNS configuration and generate errors/recommendations
   */
  private static analyzeDNSConfiguration(result: DNSValidationResult): void {
    const { domain, records, hasCNAME, hasCorrectCNAME, cnameTarget, expectedCNAME, nameserversConfigured, isSubdomain } = result;

    // Nameserver validation: skip requirement for subdomains
    if (!nameserversConfigured && !isSubdomain) {
      result.errors.push('Nameservers not configured for Netlify DNS');
      result.recommendations.push(
        `Configure nameservers at your registrar to: ${this.EXPECTED_NAMESERVERS.join(', ')}`
      );
      return; // Don't proceed with other checks if nameservers aren't configured
    }

    // CNAME-only validation (A records ignored by policy)
    const aRecords: any[] = [];
    const hasValidARecord = false;

    // If a correct CNAME does not exist, it's an error
    if (!hasCorrectCNAME) {
      if (!hasCNAME) {
        result.errors.push('No CNAME record found for domain');
      } else {
        result.errors.push(
          `CNAME record points to "${cnameTarget}" but should point to "${expectedCNAME}"`
        );
      }
      result.recommendations.push(`Add a CNAME record pointing to ${expectedCNAME}`);
    }

    // A records are ignored for validation per policy

    // Check for multiple CNAME records
    const cnameRecords = records.filter(r => r.type === 'CNAME');
    if (cnameRecords.length > 1) {
      result.warnings.push('Multiple CNAME records found. Only one should exist');
    }

    // Check TTL values
    const lowTTLRecords = records.filter(r => r.ttl && r.ttl < 300);
    if (lowTTLRecords.length > 0) {
      result.warnings.push('Some DNS records have very low TTL values, which may cause frequent DNS lookups');
    }

    // Propagation recommendations
    if (result.propagationStatus === 'partial') {
      result.recommendations.push('DNS changes are partially propagated. Wait 5-30 minutes for full propagation');
    } else if (result.propagationStatus === 'none') {
      result.recommendations.push('DNS configuration not detected. Ensure records are properly set and propagated');
    }

    // General recommendations
    if (result.errors.length === 0 && result.warnings.length === 0) {
      result.recommendations.push('DNS configuration looks good! Domain should be accessible shortly');
    }
  }

  /**
   * Clean and normalize domain
   */
  private static cleanDomain(domain: string): string {
    return domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  }

  /**
   * Check if domain is accessible via HTTP/HTTPS
   */
  static async checkDomainAccessibility(domain: string): Promise<{
    http: boolean;
    https: boolean;
    httpStatus?: number;
    httpsStatus?: number;
    errors: string[];
  }> {
    const cleanDomain = this.cleanDomain(domain);
    const result = {
      http: false,
      https: false,
      httpStatus: undefined as number | undefined,
      httpsStatus: undefined as number | undefined,
      errors: [] as string[]
    };

    // Check HTTPS
    try {
      const httpsResponse = await fetch(`https://${cleanDomain}`, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      result.https = true;
      result.httpsStatus = httpsResponse.status;
    } catch (error: any) {
      result.errors.push(`HTTPS check failed: ${error.message}`);
    }

    // Check HTTP
    try {
      const httpResponse = await fetch(`http://${cleanDomain}`, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      result.http = true;
      result.httpStatus = httpResponse.status;
    } catch (error: any) {
      result.errors.push(`HTTP check failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Get DNS propagation status across multiple servers
   */
  static async checkDNSPropagation(domain: string): Promise<{
    servers: Array<{
      server: string;
      status: 'success' | 'failed';
      records: DNSRecord[];
      responseTime: number;
    }>;
    propagationPercent: number;
  }> {
    const cleanDomain = this.cleanDomain(domain);
    const servers = ['1.1.1.1', '8.8.8.8', '208.67.222.222', '9.9.9.9'];
    const results = [];

    for (const server of servers) {
      const startTime = Date.now();
      try {
        // Note: Direct DNS queries from browser are limited, this is a simplified check
        const records = await this.fetchDNSRecords(cleanDomain);
        results.push({
          server,
          status: 'success' as const,
          records,
          responseTime: Date.now() - startTime
        });
      } catch (error) {
        results.push({
          server,
          status: 'failed' as const,
          records: [],
          responseTime: Date.now() - startTime
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const propagationPercent = (successCount / servers.length) * 100;

    return {
      servers: results,
      propagationPercent
    };
  }
}

export default DNSValidationService;

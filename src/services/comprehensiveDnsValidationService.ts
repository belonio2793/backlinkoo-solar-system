import { supabase } from '@/integrations/supabase/client';

export interface DNSRecord {
  type: 'A' | 'CNAME';
  name: string;
  value: string;
  found: boolean;
  correct: boolean;
}

export interface ComprehensiveDNSValidationResult {
  success: boolean;
  domain: string;
  records: DNSRecord[];
  validationMethod: 'CNAME' | 'A_RECORDS' | 'BOTH';
  errors: string[];
  warnings: string[];
  recommendations: string[];
  propagationStatus: 'complete' | 'partial' | 'pending' | 'failed';
  timestamp: string;
}

class ComprehensiveDnsValidationService {
  private static readonly EXPECTED_CNAME = 'domains.backlinkoo.com';
  private static readonly EXPECTED_A_RECORDS: string[] = [];

  private static async checkDNSRecords(domain: string): Promise<DNSRecord[]> {
    const records: DNSRecord[] = [];

    try {
      // Check CNAME records for both root and www
      await this.checkCNAMERecords(domain, records);

      // A records are not used for validation
    } catch (error) {
      console.error('DNS record check error:', error);
    }

    return records;
  }

  private static async checkCNAMERecords(domain: string, records: DNSRecord[]): Promise<void> {
    // For subdomains only check the exact host (e.g. blog.example.com). For root domains, also check www.
    const hosts = domain.split('.').length > 2 ? [domain] : [domain, `www.${domain}`];
    for (const host of hosts) {
      try {
        const response = await fetch(`https://dns.google/resolve?name=${host}&type=CNAME`);
        const data = await response.json();

        const cnameRecord: DNSRecord = {
          type: 'CNAME',
          name: host,
          value: '',
          found: false,
          correct: false
        };

        if (data.Answer && data.Answer.length > 0) {
          const cnameAnswer = data.Answer.find((answer: any) => answer.type === 5);
          if (cnameAnswer) {
            cnameRecord.found = true;
            cnameRecord.value = String(cnameAnswer.data).replace(/\.$/, '');
            cnameRecord.correct = cnameRecord.value.toLowerCase() === this.EXPECTED_CNAME;
          }
        }

        records.push(cnameRecord);
      } catch (error) {
        console.error('CNAME check error:', error);
        records.push({
          type: 'CNAME',
          name: host,
          value: '',
          found: false,
          correct: false
        });
      }
    }
  }

  private static async checkARecords(domain: string, records: DNSRecord[]): Promise<void> {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await response.json();

      const foundARecords: string[] = [];

      if (data.Answer && data.Answer.length > 0) {
        const aRecords = data.Answer.filter((answer: any) => answer.type === 1);
        foundARecords.push(...aRecords.map((record: any) => String(record.data)));
      }

      // Check each expected A record
      this.EXPECTED_A_RECORDS.forEach(expectedIP => {
        const isFound = foundARecords.includes(expectedIP);
        records.push({
          type: 'A',
          name: domain,
          value: expectedIP,
          found: isFound,
          correct: isFound
        });
      });

      // Add any unexpected A records found
      foundARecords.forEach(foundIP => {
        if (!this.EXPECTED_A_RECORDS.includes(foundIP)) {
          records.push({
            type: 'A',
            name: domain,
            value: foundIP,
            found: true,
            correct: false
          });
        }
      });
    } catch (error) {
      console.error('A records check error:', error);
      // Add placeholders for expected A records
      this.EXPECTED_A_RECORDS.forEach(expectedIP => {
        records.push({
          type: 'A',
          name: domain,
          value: expectedIP,
          found: false,
          correct: false
        });
      });
    }
  }

  private static determineValidationMethod(records: DNSRecord[], isSubdomain: boolean): 'CNAME' | 'A_RECORDS' | 'BOTH' {
    const cnameValid = records.some(r => r.type === 'CNAME' && r.correct);
    return 'CNAME';
  }

  private static generateValidationErrors(records: DNSRecord[], isSubdomain: boolean): string[] {
    const errors: string[] = [];

    const cnameRecords = records.filter(r => r.type === 'CNAME');

    const cnameValid = cnameRecords.some(r => r.correct);

    if (!cnameValid) {
      errors.push('No valid DNS configuration found');
    }

    const anyCnameFound = cnameRecords.some(r => r.found);
    if (!cnameValid && anyCnameFound) {
      const wrongTargets = cnameRecords.filter(r => r.found && !r.correct).map(r => `${r.name}→${r.value}`);
      if (wrongTargets.length > 0) {
        errors.push(`CNAME points to ${wrongTargets.join(', ')} but should point to '${this.EXPECTED_CNAME}'`);
      }
    }

    if (!cnameValid && !anyCnameFound) {
      // For subdomains, message should reference the exact host instead of root/www
      if (isSubdomain) {
        errors.push(`No CNAME record found for ${cnameRecords.length > 0 ? cnameRecords.map(r=>r.name).join(',') : 'the subdomain'} pointing to '${this.EXPECTED_CNAME}'`);
      } else {
        errors.push(`No CNAME record found for root or www pointing to '${this.EXPECTED_CNAME}'`);
      }
    }

    // A records are not considered in CNAME-only validation

    return errors;
  }

  private static generateValidationWarnings(records: DNSRecord[]): string[] {
    const warnings: string[] = [];

    return warnings;
  }

  private static generateRecommendations(records: DNSRecord[], validationMethod: string, isSubdomain: boolean): string[] {
    const recommendations: string[] = [];

    const cnameValid = records.some(r => r.type === 'CNAME' && r.correct);

    if (!cnameValid) {
      if (isSubdomain) {
        recommendations.push(`Add a CNAME record pointing to ${this.EXPECTED_CNAME}`);
      } else {
        recommendations.push(`Add a CNAME record pointing to ${this.EXPECTED_CNAME}`);
      }
    } else {
      recommendations.push('CNAME record is correctly configured');
    }

    return recommendations;
  }

  private static determinePropagationStatus(records: DNSRecord[], isSubdomain: boolean): 'complete' | 'partial' | 'pending' | 'failed' {
    const cnameValid = records.some(r => r.type === 'CNAME' && r.correct);

    if (cnameValid) {
      return 'complete';
    }

    const cnameFound = records.some(r => r.type === 'CNAME' && r.found);
    if (cnameFound) {
      return 'partial';
    }

    return 'pending';
  }

  static async validateDomainComprehensive(domain: string): Promise<ComprehensiveDNSValidationResult> {
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    
    try {
      const records = await this.checkDNSRecords(cleanDomain);
      const isSubdomain = cleanDomain.split('.').length > 2;
      const validationMethod = this.determineValidationMethod(records, isSubdomain);
      const errors = this.generateValidationErrors(records, isSubdomain);
      const warnings = this.generateValidationWarnings(records);
      const recommendations = this.generateRecommendations(records, validationMethod, isSubdomain);
      const propagationStatus = this.determinePropagationStatus(records, isSubdomain);

      const cnameValid = records.find(r => r.type === 'CNAME')?.correct;
      const success = !!cnameValid;

      return {
        success,
        domain: cleanDomain,
        records,
        validationMethod,
        errors,
        warnings,
        recommendations,
        propagationStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        domain: cleanDomain,
        records: [],
        validationMethod: 'CNAME',
        errors: [`DNS validation failed: ${error.message}`],
        warnings: [],
        recommendations: ['Check domain configuration and try again'],
        propagationStatus: 'failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  static async updateDomainStatus(domainId: string, validationResult: ComprehensiveDNSValidationResult): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('domains')
        .update({
          dns_verified: validationResult.success,
          status: validationResult.success ? 'active' : 'pending',
          error_message: validationResult.success ? null : validationResult.errors.join('; '),
          last_validation_at: new Date().toISOString(),
          dns_records: validationResult.records
        })
        .eq('id', domainId);

      if (error) {
        console.error('Failed to update domain status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Domain status update error:', error);
      return false;
    }
  }
}

export default ComprehensiveDnsValidationService;

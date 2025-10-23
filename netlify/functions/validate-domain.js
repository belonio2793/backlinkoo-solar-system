/**
 * Validate Domain - DNS Record Validation Function
 * 
 * Validates DNS records for a domain to ensure proper configuration
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
};

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // ✅ Require PATCH, not POST
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed. Use PATCH.'
      }),
    };
  }

  try {
    console.log('🔍 Starting DNS validation...');

    // Parse request body
    let requestData = {};
    if (event.body) {
      try {
        requestData = JSON.parse(event.body);
        console.log('📋 Validation request:', { domain: requestData.domain, domainId: requestData.domainId });
      } catch (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            error: 'Invalid JSON in request body'
          }),
        };
      }
    }

    const { domain, domainId } = requestData;

    if (!domain) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Domain is required'
        }),
      };
    }

    // Clean the domain name
    const cleanDomain = domain.trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    console.log(`🔍 Validating DNS for domain: ${cleanDomain}`);

    // Simulate DNS validation
    const validation = await simulateDnsValidation(cleanDomain);

    console.log('✅ DNS validation completed:', validation);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(validation),
    };

  } catch (error) {
    console.error('❌ DNS validation error:', error);

    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message || 'DNS validation failed',
        details: 'Check server logs for more information'
      }),
    };
  }
};

/**
 * Simulate DNS validation for development
 */
async function simulateDnsValidation(domain) {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const isSubdomain = domain.split('.').length > 2;
  let dnsChecks;

  if (isSubdomain) {
    dnsChecks = [
      {
        type: 'CNAME',
        name: domain.split('.')[0],
        expectedValue: 'domains.backlinkoo.com',
        currentValue: Math.random() > 0.3 ? 'domains.backlinkoo.com' : 'old-server.example.com',
        status: Math.random() > 0.3 ? 'verified' : 'error',
        error: Math.random() > 0.7 ? 'CNAME record not found' : undefined
      }
    ];
  } else {
    dnsChecks = [
      {
        type: 'A',
        name: '@',
        expectedValue: '75.2.60.5',
        currentValue: Math.random() > 0.4 ? '75.2.60.5' : '1.2.3.4',
        status: Math.random() > 0.4 ? 'verified' : 'error',
        error: Math.random() > 0.8 ? 'A record not found' : undefined
      },
      {
        type: 'A',
        name: '@',
        expectedValue: '99.83.190.102',
        currentValue: Math.random() > 0.4 ? '99.83.190.102' : '1.2.3.4',
        status: Math.random() > 0.4 ? 'verified' : 'error',
        error: Math.random() > 0.8 ? 'Secondary A record not found' : undefined
      },
      {
        type: 'CNAME',
        name: 'www',
        expectedValue: 'domains.backlinkoo.com',
        currentValue: Math.random() > 0.5 ? 'domains.backlinkoo.com' : 'old-server.example.com',
        status: Math.random() > 0.5 ? 'verified' : 'error',
        error: Math.random() > 0.7 ? 'WWW CNAME record not found' : undefined
      }
    ];
  }

  const verifiedChecks = dnsChecks.filter(check => check.status === 'verified');
  const success = verifiedChecks.length === dnsChecks.length;

  let message;
  if (success) {
    message = `All DNS records validated successfully for ${domain}`;
  } else {
    const errorCount = dnsChecks.length - verifiedChecks.length;
    message = `${errorCount} DNS record${errorCount > 1 ? 's' : ''} need attention for ${domain}`;
  }

  return {
    success,
    message,
    domain,
    dnsChecks,
    netlifyVerified: Math.random() > 0.2,
    dnsVerified: success,
    timestamp: new Date().toISOString(),
    propagationEstimate: success ? 'Complete' : '6-48 hours remaining'
  };
}

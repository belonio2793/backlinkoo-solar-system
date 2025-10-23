/**
 * Test Domain Sync Functionality
 * 
 * Run this to test the Netlify → Supabase domain sync
 */

async function testDomainSync() {
  console.log('🧪 Testing Domain Sync Functionality\n');

  try {
    // Method 1: Direct edge function call
    console.log('📡 Method 1: Direct Edge Function Call');
    const response = await fetch('/supabase/functions/v1/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (window.supabaseKey || 'anon-key')
      },
      body: JSON.stringify({
        action: 'sync'
      })
    });

    const result = await response.json();
    console.log('✅ Sync Result:', result);

    if (result.success) {
      console.log(`Successfully synced ${result.synced || 0} domains!`);
      console.log(`📊 Total Netlify domains: ${result.total_netlify_domains || 0}`);
      console.log(`📋 Domains: ${(result.domains || []).join(', ')}`);
    } else {
      console.log('❌ Sync failed:', result.error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Method 2: Using Supabase client (if available)
async function testWithSupabaseClient() {
  if (typeof window !== 'undefined' && window.supabase) {
    console.log('\n📡 Method 2: Using Supabase Client');
    
    try {
      const { data, error } = await window.supabase.functions.invoke('domains', {
        body: { action: 'sync' }
      });

      if (error) {
        console.log('❌ Client sync failed:', error);
      } else {
        console.log('✅ Client sync result:', data);
      }
    } catch (e) {
      console.log('⚠️ Client method not available:', e.message);
    }
  }
}

// Run both tests
testDomainSync().then(() => testWithSupabaseClient());

// Expose functions globally for manual testing
if (typeof window !== 'undefined') {
  window.testDomainSync = testDomainSync;
  window.testWithSupabaseClient = testWithSupabaseClient;
  
  console.log('🔧 Manual test functions available:');
  console.log('   window.testDomainSync()');
  console.log('   window.testWithSupabaseClient()');
}

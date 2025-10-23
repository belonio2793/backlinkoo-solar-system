/**
 * Test script to debug edge function issues
 */

async function testEdgeFunction() {
  console.log('🔍 Testing Netlify Domains Edge Function');
  
  try {
    // Test 1: Basic connectivity
    console.log('\n📡 Test 1: Basic Edge Function Connectivity');
    const basicTest = await fetch('/api/netlify-domains/debug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: 'basic_connectivity'
      })
    });
    
    console.log('Status:', basicTest.status);
    const basicResult = await basicTest.json();
    console.log('Response:', basicResult);
    
    // Test 2: Sync action
    console.log('\n🔄 Test 2: Sync Action');
    const syncTest = await fetch('/supabase/functions/v1/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (window.supabaseKey || 'anon-key-not-available')
      },
      body: JSON.stringify({
        action: 'sync',
        user_id: 'test-user'
      })
    });
    
    console.log('Sync Status:', syncTest.status);
    const syncResult = await syncTest.json();
    console.log('Sync Response:', syncResult);
    
    // Test 3: Add domain action
    console.log('\n➕ Test 3: Add Domain Action');
    const addTest = await fetch('/supabase/functions/v1/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (window.supabaseKey || 'anon-key-not-available')
      },
      body: JSON.stringify({
        action: 'add',
        domain: 'test-debug.com',
        user_id: 'test-user'
      })
    });
    
    console.log('Add Status:', addTest.status);
    const addResult = await addTest.json();
    console.log('Add Response:', addResult);
    
  } catch (error) {
    console.error('🚨 Test failed:', error);
  }
}

// Run the test
testEdgeFunction();

// Also provide a manual test function
window.testEdgeFunction = testEdgeFunction;
window.manualEdgeFunctionTest = async (action, domain = 'test.com') => {
  try {
    const response = await fetch('/supabase/functions/v1/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        domain,
        user_id: 'manual-test-user'
      })
    });
    
    console.log(`Manual test - ${action}:`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });
    
    const result = await response.json();
    console.log('Manual test result:', result);
    
    return result;
  } catch (error) {
    console.error('Manual test error:', error);
    return { error: error.message };
  }
};

console.log(`
🔧 Debug Tools Available:
- testEdgeFunction() - Run full test suite
- manualEdgeFunctionTest('sync') - Test sync action
- manualEdgeFunctionTest('add', 'yourdomain.com') - Test add action

💡 If you see CORS errors, try running from the domains page where Supabase client is initialized.
`);

#!/usr/bin/env node

/**
 * Sync Netlify Domains to Supabase
 * 
 * This script calls the domains edge function to sync all Netlify aliases
 * into the Supabase domains table.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncNetlifyDomains() {
  try {
    console.log('🔄 Starting Netlify → Supabase domain sync...\n');

    // Call the domains edge function with sync action
    const { data, error } = await supabase.functions.invoke('domains', {
      body: {
        action: 'sync'
      }
    });

    if (error) {
      console.error('❌ Sync failed:', error);
      process.exit(1);
    }

    console.log('✅ Sync completed successfully!');
    console.log(`📊 Results:`);
    console.log(`   • Total Netlify domains: ${data.total_netlify_domains || 0}`);
    console.log(`   • Synced to database: ${data.synced || 0}`);
    console.log(`   • Domains found: ${(data.domains || []).join(', ')}`);

    // Show current domains in database
    console.log('\n📋 Current domains in Supabase:');
    const { data: allDomains } = await supabase
      .from('domains')
      .select('domain, netlify_verified, status, created_by')
      .order('created_at', { ascending: false });

    (allDomains || []).forEach(domain => {
      const status = domain.netlify_verified ? '✅' : '❌';
      console.log(`   ${status} ${domain.domain} (${domain.status}) - ${domain.created_by || 'manual'}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the sync
syncNetlifyDomains();

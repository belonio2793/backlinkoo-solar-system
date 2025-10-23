#!/usr/bin/env node

import { spawn } from 'child_process';

const SITE_ID = process.env.NETLIFY_SITE_ID || 'ca6261e6-0a59-40b5-a2bc-5b5481ac8809';
const TOKEN = process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_API_TOKEN;

if (!TOKEN) {
  console.error('NETLIFY_ACCESS_TOKEN is required');
  process.exit(1);
}

// Keep essential runtime vars for process execution
const baseEnvKeys = new Set([
  'PATH','HOME','USER','SHELL','TMPDIR','PWD','TEMP','TMP','OS','SYSTEMROOT','COMSPEC','PROGRAMFILES','PROGRAMFILES(X86)','PROGRAMW6432','CI'
]);

// Only pass the minimal application secrets actually needed by functions
const allowAppKeys = new Set([
  'NETLIFY_ACCESS_TOKEN',
  'NETLIFY_API_TOKEN',
  'NETLIFY_SITE_ID',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'OPENAI_API_KEY',
  'RESEND_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_NETLIFY_FUNCTIONS_URL',
  'VITE_ENVIRONMENT'
]);

const sanitizedEnv = {};
for (const k of Object.keys(process.env)) {
  if (baseEnvKeys.has(k) || allowAppKeys.has(k)) {
    sanitizedEnv[k] = process.env[k];
  }
}

function sizeOfEnv(env) {
  return Object.entries(env).reduce((sum, [k, v]) => sum + k.length + String(v).length + 2, 0);
}

const totalSize = sizeOfEnv(sanitizedEnv);
const keys = Object.keys(sanitizedEnv).sort();
console.log('Launching Netlify MCP deploy with sanitized environment');
console.log(`Keys passed (${keys.length}): ${keys.join(', ')}`);
console.log(`Approx env size: ~${totalSize} bytes`);

const args = ['-y', '@netlify/mcp@latest', '--site-id', SITE_ID];

const child = spawn('npx', args, {
  stdio: 'inherit',
  env: sanitizedEnv,
  shell: process.platform === 'win32'
});

child.on('exit', (code) => process.exit(code ?? 0));

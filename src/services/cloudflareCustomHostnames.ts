export interface CFHostnameResult { id: string; hostname: string; status?: string; ssl?: any; created_at?: string; }

export async function cfCreateHostname(hostname: string, origin = 'domains.backlinkoo.com') {
  const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
  const res = await safeNetlifyFetch('domainsCloudflare?op=ch_create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hostname, origin })
  });
  const payload: any = res?.data || {};
  if (!res.success || !payload?.success) throw new Error(payload?.error || res?.error || 'Cloudflare create failed');
  return payload.result;
}

export async function cfListHostnames(hostname?: string): Promise<CFHostnameResult[]> {
  const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
  const q = hostname ? `&hostname=${encodeURIComponent(hostname)}` : '';
  const res = await safeNetlifyFetch(`domainsCloudflare?op=ch_list${q}`, { method: 'GET' });
  const payload: any = res?.data || {};
  if (!res.success || !payload?.success) throw new Error(payload?.error || res?.error || 'Cloudflare list failed');
  return payload.result || [];
}

export async function cfDeleteHostnameById(id: string) {
  const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
  const res = await safeNetlifyFetch(`domainsCloudflare?op=ch_delete&id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  const payload: any = res?.data || {};
  if (!res.success || !payload?.success) throw new Error(payload?.error || res?.error || 'Cloudflare delete failed');
  return true;
}

export async function cfDeleteHostnameByName(hostname: string) {
  const list = await cfListHostnames(hostname);
  const match = Array.isArray(list) ? list.find((h: any) => String(h.hostname || h?.name || '').toLowerCase() === hostname.toLowerCase()) : null;
  if (!match?.id) throw new Error('Hostname not found');
  return cfDeleteHostnameById(match.id);
}

export async function cfGetHostname(id: string) {
  const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
  const res = await safeNetlifyFetch(`domainsCloudflare?op=ch_get&id=${encodeURIComponent(id)}`, { method: 'GET' });
  const payload: any = res?.data || {};
  if (!res.success || !payload?.success) throw new Error(payload?.error || res?.error || 'Cloudflare get failed');
  return payload.result;
}

export async function cfUpdateHostname(id: string, payload: any) {
  const { safeNetlifyFetch } = await import('@/utils/netlifyFunctionHelper');
  const res = await safeNetlifyFetch(`domainsCloudflare?op=ch_update&id=${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patch: payload })
  });
  const data: any = res?.data || {};
  if (!res.success || !data?.success) throw new Error(data?.error || res?.error || 'Cloudflare update failed');
  return data.result;
}

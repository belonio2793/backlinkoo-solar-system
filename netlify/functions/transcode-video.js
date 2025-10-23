const crypto = require('crypto');

function response(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return response(200, { ok: true });
  }
  if (event.httpMethod !== 'POST') {
    return response(405, { error: 'Method not allowed' });
  }

  try {
    const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
    const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
      return response(400, { error: 'Cloudinary is not fully configured. Provide CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and CLOUDINARY_CLOUD_NAME.' });
    }

    const { fileBase64, filename } = JSON.parse(event.body || '{}');
    if (!fileBase64) {
      return response(400, { error: 'Missing fileBase64' });
    }

    const base64Data = fileBase64.startsWith('data:') ? fileBase64.split(',')[1] : fileBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = (filename || `ai_render_${timestamp}`).replace(/[^a-zA-Z0-9_\-]/g, '_');

    // Cinematic eager transformation: 21:9 pad, 24fps, H.264 High, high bitrate, AAC audio, subtle grading
    const eager = [
      'ar_21:9,c_pad,b_black',
      'fps_24',
      'f_mp4',
      'vc_h264:high',
      'br_12000k',
      'ac_aac,ab_192k',
      'e_vignette:30',
      'e_saturation:15',
      'e_contrast:10',
      'q_auto:best'
    ].join(',');

    // Build signature
    const paramsToSign = {
      eager,
      public_id: publicId,
      resource_type: 'video',
      timestamp,
    };

    // Sort params alphabetically and join
    const signString = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&') + CLOUDINARY_API_SECRET;

    const signature = crypto.createHash('sha1').update(signString).digest('hex');

    const form = new FormData();
    form.append('file', new Blob([buffer], { type: 'video/webm' }), `${publicId}.webm`);
    form.append('api_key', CLOUDINARY_API_KEY);
    form.append('timestamp', String(timestamp));
    form.append('public_id', publicId);
    form.append('resource_type', 'video');
    form.append('signature', signature);
    form.append('eager', eager);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;
    const res = await fetch(uploadUrl, { method: 'POST', body: form });
    const data = await res.json();

    if (!res.ok) {
      return response(res.status, { error: data.error?.message || 'Cloudinary upload failed' });
    }

    const eagerUrl = Array.isArray(data.eager) && data.eager[0]?.secure_url ? data.eager[0].secure_url : data.secure_url;

    return response(200, {
      ok: true,
      public_id: data.public_id,
      mp4Url: eagerUrl,
      bytes: data.bytes,
      duration: data.duration,
      format: data.format,
    });
  } catch (err) {
    console.error('transcode-video error', err);
    return response(500, { error: 'Server error' });
  }
};

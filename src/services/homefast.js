const PLATFORM_CONFIG = {
  g2: {
    label: 'G2',
    formUrl: 'https://www.g2.com/products/new',
    icon: 'https://www.google.com/s2/favicons?domain=www.g2.com&sz=64',
    help: 'Use “Add Your Product”. You may need a vendor account. Prepare tagline, summary, categories and website URL.',
    apiDocs: null,
    submissionMode: 'manual'
  },
  capterra: {
    label: 'Capterra',
    formUrl: 'https://vendors.capterra.com/',
    icon: 'https://www.google.com/s2/favicons?domain=www.capterra.com&sz=64',
    help: 'Create a vendor account, then add your product listing with URL and category.',
    apiDocs: null,
    submissionMode: 'manual'
  },
  producthunt: {
    label: 'Product Hunt',
    formUrl: 'https://www.producthunt.com/posts/new',
    icon: 'https://www.google.com/s2/favicons?domain=www.producthunt.com&sz=64',
    help: 'Create a post (launch). Include your homepage URL, short tagline, description and media.',
    apiDocs: 'https://api.producthunt.com/v2/docs',
    submissionMode: 'hybrid'
  },
  crunchbase: {
    label: 'Crunchbase',
    formUrl: 'https://www.crunchbase.com/',
    icon: 'https://www.google.com/s2/favicons?domain=www.crunchbase.com&sz=64',
    help: 'Sign in and create or claim your company profile. Add website URL, description, founders and location.',
    apiDocs: 'https://data.crunchbase.com/docs',
    submissionMode: 'hybrid'
  },
  getapp: {
    label: 'GetApp',
    formUrl: 'https://www.getapp.com/vendors/',
    icon: 'https://www.google.com/s2/favicons?domain=www.getapp.com&sz=64',
    help: 'Create a vendor account and submit your product with URL, categories and screenshots.',
    apiDocs: null,
    submissionMode: 'manual'
  },
  softwareadvice: {
    label: 'Software Advice',
    formUrl: 'https://www.softwareadvice.com/vendors/',
    icon: 'https://www.google.com/s2/favicons?domain=www.softwareadvice.com&sz=64',
    help: 'Register as a vendor. Provide product details, URL and target industries.',
    apiDocs: null,
    submissionMode: 'manual'
  },
  sourceforge: {
    label: 'SourceForge',
    formUrl: 'https://sourceforge.net/user/registration/',
    icon: 'https://www.google.com/s2/favicons?domain=sourceforge.net&sz=64',
    help: 'Create an account, then register your project. Include homepage URL, summary and categories.',
    apiDocs: null,
    submissionMode: 'manual'
  },
  alternativeto: {
    label: 'AlternativeTo',
    formUrl: 'https://alternativeto.net/add',
    icon: 'https://www.google.com/s2/favicons?domain=alternativeto.net&sz=64',
    help: 'Suggest your product with a short description, tags and website URL.',
    apiDocs: null,
    submissionMode: 'manual'
  },
  saashub: {
    label: 'SaaSHub',
    formUrl: 'https://www.saashub.com/submit',
    icon: 'https://www.google.com/s2/favicons?domain=www.saashub.com&sz=64',
    help: 'Submit your product with homepage URL, tags and one-line description.',
    apiDocs: null,
    submissionMode: 'manual'
  },
  betalist: {
    label: 'BetaList',
    formUrl: 'https://betalist.com/submit',
    icon: 'https://www.google.com/s2/favicons?domain=betalist.com&sz=64',
    help: 'Submit your startup for beta access. Provide URL, value prop and contact email.',
    apiDocs: null,
    submissionMode: 'manual'
  }
};

function clamp(str, max) {
  if (!str) return '';
  const s = String(str).trim().replace(/\s+/g, ' ');
  return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s;
}

function inferCategories(text) {
  const t = (text || '').toLowerCase();
  const cats = [];
  if (/(crm|pipeline|sales|deal|contact)/.test(t)) cats.push('CRM');
  if (/(marketing|seo|content|automation|campaign|email)/.test(t)) cats.push('Marketing');
  if (/(analytics|insight|report|dashboard|metric)/.test(t)) cats.push('Analytics');
  if (/(ai|machine learning|llm|chat)/.test(t)) cats.push('AI');
  if (/(project|task|kanban|scrum)/.test(t)) cats.push('Project Management');
  if (/(support|helpdesk|ticket|customer)/.test(t)) cats.push('Customer Support');
  return cats.slice(0, 3);
}

function buildPayload(opts) {
  const { url, productName, description, email, contactName } = opts;
  const tagline = clamp(description || (productName + ' for teams'), 60);
  const summary = clamp(description || `${productName} helps teams get more done with automation and insights. Learn more at ${url}.`, 400);
  const categories = inferCategories(`${productName} ${description}`);
  return { url, productName, email, contactName, tagline, summary, categories };
}

/**
 * Run HomeFast workflow. Emits events describing progress for each platform.
 * @param {HomeFastOptions} options
 * @param {(evt: HomeFastEvent)=>void} onEvent
 * @returns {{ cancel: () => void }}
 */
const FN_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_NETLIFY_FUNCTIONS_URL) || '/.netlify/functions';
const CAPTCHA_ENDPOINT = FN_BASE + '/solve-captcha';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function runHomeFast(options, onEvent) {
  const { only } = options || {};
  const targets = (only && only.length ? only : Object.keys(PLATFORM_CONFIG));
  let canceled = false;

  const basePayload = buildPayload(options);
  const signup = options?.signup || {};

  function emit(evt) {
    if (!canceled && typeof onEvent === 'function') onEvent(evt);
  }

  const SUBMISSION_GUIDANCE = {
    manual: 'Manual submission required. Prepared fields are ready for copy and paste.',
    hybrid: 'API hooks exist but manual review and overrides are still required.',
    api: 'API submission available. Verify credentials before executing.'
  };

  async function processPlatform(key) {
    if (canceled) return;
    const cfg = PLATFORM_CONFIG[key];
    const link = cfg.formUrl;

    emit({ type: 'start', platform: key, message: 'Preparing content', link });

    const requiresSignup = ['g2', 'capterra', 'getapp', 'softwareadvice', 'crunchbase', 'sourceforge'].includes(key);
    if (requiresSignup) {
      emit({ type: 'signup_required', platform: key, message: 'Sign-up/sign-in likely required before submission', link });
    }

    const guidance = SUBMISSION_GUIDANCE[cfg.submissionMode] || SUBMISSION_GUIDANCE.manual;
    emit({ type: 'processing', platform: key, message: `Compiling tailored listing details. ${guidance}`, link });
    await wait(250);
    if (canceled) return;

    const payload = { ...basePayload, signup };
    if (key === 'producthunt') {
      payload.launch_title = basePayload.tagline;
      payload.maker_email = basePayload.email;
    }
    if (key === 'crunchbase') {
      payload.company_type = 'Software';
    }
    if (key === 'alternativeto' || key === 'saashub') {
      payload.tags = payload.categories.map((c) => c.toLowerCase());
    }

    payload.bookmarklet = buildBookmarklet(key, payload);
    payload.captchaHelper = CAPTCHA_ENDPOINT;

    emit({ type: 'ready', platform: key, payload, message: 'Inputs prepared. Review the runtime panel and copy each field into the platform.', link });
    await wait(300);
    if (canceled) return;

    emit({ type: 'inserting', platform: key, message: 'Injecting prepared inputs into the runtime checklist for review.', link });
    await wait(400);
    if (canceled) return;

    emit({ type: 'done', platform: key, message: 'Prepared' });
  }

  (async () => {
    for (const key of targets) {
      if (canceled) break;
      await processPlatform(key);
    }
  })();

  return {
    cancel() { canceled = true; }
  };
}

function jsMin(s) {
  return s.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function buildBookmarklet(platformKey, payload) {
  const fieldMap = getPlatformFieldMap(platformKey);
  const code = `(function(){try{var P=${JSON.stringify(payload)};var M=${JSON.stringify(fieldMap)};var END='${CAPTCHA_ENDPOINT}';function set(el,val){if(!el)return;el.focus();el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
function find(terms){terms=terms||[];var all=document.querySelectorAll('input,textarea');var best=null;var score=0;all.forEach(function(el){var txt=((el.name||'')+' '+(el.id||'')+' '+(el.placeholder||'')).toLowerCase();var label='';try{var id=el.id;if(id){var lb=document.querySelector('label[for=\"'+id+'\"]');if(lb)label=lb.innerText.toLowerCase();}}catch(e){}
var s=0;terms.forEach(function(t){if(!t)return;var tt=t.toLowerCase();if(txt.includes(tt))s+=3;if(label.includes(tt))s+=4;});if(s>score){score=s;best=el;}});return best;}
function detect(){var el=document.querySelector('.g-recaptcha[data-sitekey], div[data-sitekey].g-recaptcha');if(el){return {type:'recaptcha_v2',sitekey:el.getAttribute('data-sitekey')}};var hc=document.querySelector('div.h-captcha[data-sitekey], iframe[src*="hcaptcha.com"]');if(hc){var key=(hc.getAttribute&&hc.getAttribute('data-sitekey'))||'';if(!key){try{var f=document.querySelector('div.h-captcha');if(f)key=f.getAttribute('data-sitekey');}catch(e){}}return {type:'hcaptcha',sitekey:key}};var tf=document.querySelector('div.cf-turnstile[data-sitekey], iframe[src*="turnstile"][data-sitekey]');if(tf){var tkey=tf.getAttribute('data-sitekey')||'';return {type:'turnstile',sitekey:tkey}};return null}
async function solve(){try{var d=detect();if(!d){alert('No supported CAPTCHA detected');return}var body={type:d.type,sitekey:d.sitekey,url:location.href};var res=await fetch(END,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});var json=await res.json();if(!res.ok){alert('Solve failed: '+(json&&json.error||res.status));return}var tok=json.token||'';if(d.type==='recaptcha_v2'){var ta=document.querySelector('textarea[name="g-recaptcha-response"]');if(!ta){ta=document.createElement('textarea');ta.name='g-recaptcha-response';ta.style.display='none';document.body.appendChild(ta);}set(ta,tok);}if(d.type==='hcaptcha'){var th=document.querySelector('textarea[name="h-captcha-response"], textarea[name="hcaptcha-response"]');if(!th){th=document.createElement('textarea');th.name='h-captcha-response';th.style.display='none';document.body.appendChild(th);}set(th,tok);}if(d.type==='turnstile'){var tc=document.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');if(!tc){tc=document.createElement('input');tc.type='hidden';tc.name='cf-turnstile-response';document.body.appendChild(tc);}set(tc,tok);}alert('CAPTCHA token injected. You can now submit the form.');}catch(e){alert('Solve error: '+e.message)}}
var fields={url:P.url,name:P.productName,email:P.email,contact:P.contactName,tagline:P.tagline,summary:P.summary,password:(P.signup&&P.signup.password)||'',phone:(P.signup&&P.signup.phone)||'',companySize:(P.signup&&P.signup.companySize)||'',country:(P.signup&&P.signup.country)||'',role:(P.signup&&P.signup.role)||''};
Object.keys(M).forEach(function(k){var el=find(M[k]);if(k==='url')set(el,fields.url);if(k==='name')set(el,fields.name);if(k==='email')set(el,fields.email);if(k==='contact')set(el,fields.contact);if(k==='tagline')set(el,fields.tagline);if(k==='summary'||k==='description')set(el,fields.summary);if(k==='password')set(el,fields.password);if(k==='confirmPassword')set(el,fields.password);if(k==='phone')set(el,fields.phone);if(k==='companySize')set(el,fields.companySize);if(k==='country')set(el,fields.country);if(k==='role'||k==='title')set(el,fields.role);});
var hasFile=document.querySelector('input[type=file]');if(hasFile&&P.signup&&P.signup.logo){try{console.warn('File inputs cannot be set by scripts. Opening your logo in a new tab for easy upload.');var w=window.open('about:blank','_blank');if(w){var h='<body style=\'margin:0;display:grid;place-items:center;height:100vh;background:#111;\'><img style=\'max-width:90vw;max-height:90vh;\' src=\''+(P.signup.logo)+'\' alt=\'logo\'/></body>';w.document.write(h);}}catch(e){}}
if(confirm('Run CAPTCHA solver now?')){solve();}
alert('Autofill completed for '+(document.title||location.host)+'. Review before submitting.');}catch(e){alert('Autofill error: '+e.message);}})();`;
  return 'javascript:' + encodeURIComponent(jsMin(code));
}

function getPlatformFieldMap(key){
  const generic={
    url:['url','website','homepage','site'],
    name:['product name','company name','name'],
    email:['email','contact email','work email'],
    contact:['your name','full name','contact name'],
    password:['password','create password','new password'],
    confirmPassword:['confirm password','retype password'],
    phone:['phone','phone number','mobile'],
    companySize:['company size','team size','employees'],
    country:['country','location','region'],
    role:['role','title','job title','position'],
    tagline:['tagline','one-liner','short description'],
    summary:['description','summary','about','what does your product']
  };
  const maps={
    g2:{...generic},
    capterra:{...generic, tagline:['tagline','short description','value proposition']},
    producthunt:{...generic, tagline:['tagline','headline'], summary:['description','what is it']},
    crunchbase:{...generic, name:['company name','organization name'], summary:['description','about']},
    getapp:{...generic},
    softwareadvice:{...generic},
    sourceforge:{...generic, name:['project name','name']},
    alternativeto:{...generic, tagline:['tagline','short description'], summary:['description','what is this']},
    saashub:{...generic},
    betalist:{...generic, tagline:['tagline','one-liner','elevator pitch']}
  };
  return maps[key]||generic;
}

function preparePlatform(key, options) {
  const cfg = PLATFORM_CONFIG[key];
  const basePayload = buildPayload(options || {});
  const signup = (options && options.signup) || {};
  const payload = { ...basePayload, signup };
  if (key === 'producthunt') {
    payload.launch_title = basePayload.tagline;
    payload.maker_email = basePayload.email;
  }
  if (key === 'crunchbase') {
    payload.company_type = 'Software';
  }
  if (key === 'alternativeto' || key === 'saashub') {
    payload.tags = (payload.categories || []).map((c) => String(c).toLowerCase());
  }
  payload.bookmarklet = buildBookmarklet(key, payload);
  payload.captchaHelper = CAPTCHA_ENDPOINT;
  const fieldMap = getPlatformFieldMap(key);
  const submissionGuidance = cfg && cfg.submissionMode === 'api'
    ? 'API submission available. Verify credentials before executing.'
    : cfg && cfg.submissionMode === 'hybrid'
      ? 'API hooks exist but manual review and overrides are still required.'
      : 'Manual submission required. Prepared fields are ready for copy and paste.';
  return { payload, link: cfg?.formUrl || '', cfg, fieldMap, guidance: submissionGuidance };
}

export { PLATFORM_CONFIG, getPlatformFieldMap, preparePlatform };

/**
 * @typedef {Object} HomeFastOptions
 * @property {string} url
 * @property {string} productName
 * @property {string} email
 * @property {string} [contactName]
 * @property {string} [description]
 * @property {string[]} [only]
 * @property {{password?: string, role?: string, phone?: string, companySize?: string, country?: string, logo?: string, logoFileName?: string}} [signup]
 */

/**
 * @typedef {Object} HomeFastEvent
 * @property {'start'|'signup_required'|'processing'|'ready'|'inserting'|'done'|'error'} type
 * @property {string} platform
 * @property {string} [message]
 * @property {Record<string, any>} [payload]
 * @property {string} [link]
 * @property {string} [error]
 */

# Ranking Service 404 Error Fix

## Issue
The `HomeFeaturedRankTracker` and `CombinedSearchSection` components are failing with:
```
Error: All endpoints failed for ranking lookup (404/timeout).
```

This occurs when the app is deployed on **non-Netlify** platforms (like fly.dev) but the ranking service functions are hosted on Netlify.

## Root Cause
The ranking service (`homeFeaturedSearchRank`) is a Netlify function that:
1. Needs the `X_API` environment variable set to work
2. Is only accessible locally via `/.netlify/functions/` when using `netlify dev`
3. Is not available when the app is deployed on other platforms (fly.dev, Heroku, etc.)

## Solution

### For Local Development
Use `netlify dev` to run both the frontend and Netlify functions:
```bash
netlify dev
```

This will serve the app on `http://localhost:3000` and make Netlify functions available at `/.netlify/functions/`.

### For Production (fly.dev and other non-Netlify deployments)

#### Step 1: Ensure Netlify Site is Set Up
1. Deploy Netlify functions to Netlify:
   ```bash
   netlify deploy --prod
   ```
2. Your Netlify site URL should be something like: `https://backlinkoo.netlify.app`

#### Step 2: Set Environment Variables on fly.dev

Set these environment variables on your fly.dev deployment:

```
VITE_NETLIFY_FUNCTIONS_URL=https://backlinkoo.netlify.app/.netlify/functions
VITE_NETLIFY_SITE_ID=ca6261e6-0a59-40b5-a2bc-5b5481ac8809
X_API=<your-x-ai-api-key>
```

### Configuration Details

**VITE_NETLIFY_FUNCTIONS_URL**
- Points to the remote Netlify functions
- Used when local endpoints fail
- Required for fly.dev deployments

**X_API**
- Required by the `homeFeaturedSearchRank` function
- Must be set on **Netlify** environment variables, not just fly.dev
- Go to Netlify → Site settings → Build & deploy → Environment

### How the Fix Works

The updated components now:
1. Try local endpoints first (`/api/homeFeaturedSearchRank`)
2. Fall back to environment-configured URLs (`VITE_NETLIFY_FUNCTIONS_URL`)
3. Fall back to known Netlify site (`https://backlinkoo.netlify.app`)
4. Provide helpful error messages when all endpoints fail

### Supported Deployment Scenarios

✅ **Local Development with `netlify dev`**
- Uses: `/.netlify/functions/homeFeaturedSearchRank`
- Status: Works

✅ **Netlify Deployment** 
- Uses: `/.netlify/functions/homeFeaturedSearchRank`
- Status: Works

✅ **fly.dev / Other Platforms**
- Uses: `https://backlinkoo.netlify.app/.netlify/functions/homeFeaturedSearchRank` (via VITE_NETLIFY_FUNCTIONS_URL)
- Status: Works if `X_API` is set on Netlify

### Troubleshooting

**Error: "ranking service endpoint is not available"**
- Solution: Set `VITE_NETLIFY_FUNCTIONS_URL` on your fly.dev deployment

**Error: "Service not configured"**
- Solution: Set `X_API` environment variable on Netlify (not on fly.dev)

**Still getting 404s**
- Check that Netlify functions are deployed: `netlify deploy --prod`
- Verify `X_API` is set on Netlify's environment variables
- Use the diagnostic component to check endpoint status

## Code Changes

### Components Updated
- `src/components/HomeFeaturedRankTracker.tsx`
- `src/components/CombinedSearchSection.tsx`

### Improvements
1. **Better endpoint detection**: Tries multiple candidates with clear fallbacks
2. **Timeout handling**: 10-second timeout per endpoint
3. **HTML response detection**: Skips endpoints returning HTML (404 pages)
4. **Service configuration errors**: Detects and reports 503 errors clearly
5. **User-friendly messages**: Provides actionable error messages

### New Component
- `src/components/RankTrackerDiagnostics.tsx`: Diagnostic tool to check endpoint status

## Testing

Use the diagnostic component to verify all endpoints:

```tsx
import { RankTrackerDiagnostics } from '@/components/RankTrackerDiagnostics';

// Add to your page
<RankTrackerDiagnostics />
```

This will show which endpoints are working and which are failing.

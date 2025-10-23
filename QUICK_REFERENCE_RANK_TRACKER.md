# Quick Reference: Rank Tracker Integration

## What's New
✅ **homeFeaturedSearchRank.js is now fully integrated on the home page**

## Public Access Feature
- **Location**: Home page / Featured Sections
- **Component**: `HomeFeaturedRankTracker`
- **Function**: Check Google rankings for any URL + keyword
- **Access**: Everyone (no login required)
- **Path**: `/` (automatically visible on home page)

## Premium Saving Feature
- **Save Location**: `/rank-tracker/premium` (user dashboard)
- **Access**: Premium users only
- **What Saves**: 
  - URL checked
  - Keyword searched
  - Ranking position (rank #)
  - Page number
  - Position on page
  - Status (found/not_found)
  - AI analysis

## How Users See It

### Free Users
```
1. Visit home page
2. See "Check Your Ranking" card
3. Enter URL (e.g., "google.com")
4. Enter keyword (e.g., "best search engine")
5. Click "Check Ranking"
6. Get instant result (no login needed!)
7. Message: "Free for everyone • Sign in to save results"
```

### Premium Users
```
1. Do steps 1-5 above (but logged in as premium)
2. Get instant result
3. Result auto-saves to their premium dashboard
4. See: "Data saved to your account"
5. Can view history at /rank-tracker/premium
```

## API Endpoints

### Check Ranking (Public)
```
POST /.netlify/functions/homeFeaturedSearchRank
{
  "url": "google.com",
  "keyword": "search engine"
}
Response: { rank, page, position, status, analysis }
```

### Save Ranking (Premium Only)
```
POST /.netlify/functions/saveRankReport
Headers: 
  - Content-Type: application/json
Body:
  {
    "userId": "user-id",
    "url": "google.com",
    "keyword": "search engine",
    "rank": 1,
    "page": 1,
    "position": 1,
    "status": "found",
    "analysis": "..."
  }
Response: { ok, data, path: "/rank-tracker/premium/{userId}/{reportId}" }
```

## Code Locations

| File | What | Status |
|------|------|--------|
| `src/pages/Index.tsx` | Home page with rank tracker | ✅ Already integrated |
| `src/components/HomeFeaturedRankTracker.tsx` | Rank checking form & results | ✅ Updated for public access |
| `netlify/functions/homeFeaturedSearchRank.js` | X AI rank checking | ✅ Public endpoint |
| `netlify/functions/saveRankReport.js` | Premium-only saving | ✅ Created new |
| `src/pages/RankTrackerPremium.tsx` | Premium dashboard | ✅ Existing page |

## Testing Checklist

- [ ] Non-logged-in user can check rankings
- [ ] Logged-in free user can check but cannot save
- [ ] Logged-in premium user can check AND save
- [ ] Saved reports appear in `/rank-tracker/premium`
- [ ] Form validates URL and keyword
- [ ] Error messages are clear
- [ ] UI messaging is correct for each user type

## Messages Users See

| Scenario | Message |
|----------|---------|
| Non-logged-in | "Free for everyone • Sign in to save results" |
| Logged in (free) | "Upgrade to Premium to save and track rankings" |
| Logged in (premium) | "Premium: Results will be saved automatically" |
| After save (premium) | "Data saved to your account" |

## Database

**Table**: `rank_tracking_history`
**Access**: Premium users only (row-level security)
**Fields**:
- user_id (links to user)
- url (website URL)
- keyword (search term)
- rank (ranking position)
- page (page number in results)
- position (position on page)
- status (found/not_found)
- analysis (AI-generated analysis)
- checked_at (timestamp)

## Premium Verification

The `saveRankReport` endpoint verifies premium status by checking:
- `profiles.subscription_tier` = "premium" OR "monthly"
- Returns 403 Forbidden if not premium

## Features

✅ Anyone can check Google rankings  
✅ Premium users only can save rankings  
✅ Automatic saving on ranking check (if premium)  
✅ History preserved in premium dashboard  
✅ AI-powered analysis included  
✅ Works on home page - no extra navigation needed  

## What Happens When User Checks Ranking

1. User enters URL + keyword
2. Frontend validates input
3. Calls `/homeFeaturedSearchRank` API
4. X AI analyzes Google rankings
5. Results displayed instantly
6. If user is premium: Automatically saved to `/rank-tracker/premium`
7. If user is free: Prompt to upgrade or sign in

## Customization Options

### Change the form styling
Edit `src/components/HomeFeaturedRankTracker.tsx` CardContent styling

### Change save behavior
Edit `netlify/functions/saveRankReport.js` to:
- Save to different table
- Add additional validation
- Change premium tier requirements

### Change home page position
Edit `src/pages/Index.tsx` to move `<HomeFeaturedRankTracker />` component

## Support

For issues:
1. Check browser console for errors
2. Verify X_API key is set
3. Verify Supabase connection
4. Check user premium status in database
5. Review function logs in Netlify dashboard

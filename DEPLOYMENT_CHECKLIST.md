# 📋 Rank Tracker Deployment Checklist

## Pre-Deployment (Environment Setup)

### Environment Variables
- [ ] X_API is set with valid X AI API key
  - **How to verify**: 
    ```bash
    echo $X_API  # Should show your API key (not empty)
    ```
  - **Where to set**: 
    - Local: `.env.local` file
    - Production: DevServerControl > Environment Variables > Add X_API

- [ ] SUPABASE_URL is set
  - **Value**: `https://dfhanacsmsvvkpunurnp.supabase.co`

- [ ] SUPABASE_ANON_KEY is set
  - **How to verify**: Check Supabase project settings

### Database Setup
- [ ] Run Supabase migration
  - **File**: `supabase/migrations/20250115_create_rank_tracking_history.sql`
  - **Steps**:
    1. Go to Supabase Dashboard
    2. SQL Editor > New Query
    3. Copy-paste entire migration file
    4. Click "Execute"
    5. Verify: No errors shown

- [ ] Verify tables created
  - [ ] `rank_tracking_history` table exists
  - [ ] `user_rank_tracking_summary` view exists
  - [ ] Indexes created (idx_rank_tracking_*)
  - [ ] RLS is enabled on table

- [ ] Verify RLS Policies
  - [ ] SELECT policy for users
  - [ ] INSERT policy for users
  - [ ] UPDATE policy for users
  - [ ] DELETE policy for users

### Code Integration
- [ ] HomeFeaturedRankTracker imported in Index.tsx
  - **File**: `src/pages/Index.tsx`
  - **Should have**: 
    ```tsx
    import { HomeFeaturedRankTracker } from "@/components/HomeFeaturedRankTracker";
    ```

- [ ] HomeFeaturedRankTracker component added to Index.tsx
  - **Should appear**: After `<RankHeader />` and before pricing section
  - **Should look like**:
    ```tsx
    {/* Featured Rank Tracker Section - First Section */}
    <HomeFeaturedRankTracker />
    ```

---

## Local Testing

### Test 1: Homepage Rendering
- [ ] Navigate to `http://localhost:3001/`
- [ ] See RankHeader at top
- [ ] See HomeFeaturedRankTracker section (gradient background)
- [ ] See form with URL and keyword inputs
- [ ] See "Check Ranking" button
- [ ] No console errors

### Test 2: API Endpoint
- [ ] Test endpoint directly:
  ```bash
  curl -X POST http://localhost:3001/.netlify/functions/homeFeaturedSearchRank \
    -H "Content-Type: application/json" \
    -d '{"url":"example.com","keyword":"example"}'
  ```
- [ ] Receive valid JSON response with `ok: true`
- [ ] Response contains `data` object with ranking info

### Test 3: Guest User Flow
- [ ] Open rank tracker (not signed in)
- [ ] Enter URL: `backlinkoo.com`
- [ ] Enter Keyword: `backlinks`
- [ ] Click "Check Ranking"
- [ ] See sign-in modal appear
- [ ] Modal is not dismissible (proper UX)
- [ ] Can sign in through modal
- [ ] After sign in, see result displayed

### Test 4: Free User Flow
- [ ] Sign in with free account
- [ ] Go back to home page
- [ ] Enter URL and keyword in rank tracker
- [ ] Click "Check Ranking"
- [ ] See result displayed
- [ ] See message "Upgrade to Premium to save rankings"
- [ ] Result is NOT saved (check Supabase later)
- [ ] Can click upgrade button
- [ ] Checkout modal appears

### Test 5: Premium User Flow
- [ ] Create premium account (use test Stripe card: `4242 4242 4242 4242`)
- [ ] Go to home page
- [ ] Enter URL: `example.com`
- [ ] Enter Keyword: `seo`
- [ ] Click "Check Ranking"
- [ ] See result displayed
- [ ] See message "Data saved to your account"
- [ ] Close page and reopen
- [ ] Check Supabase: rank_tracking_history table should have new record

### Test 6: Result Display
- [ ] When result shows:
  - [ ] Rank number is prominently displayed (#1, #5, etc.)
  - [ ] Page and position shown if available
  - [ ] Analysis text from AI displayed
  - [ ] Status (found/not_found) shown
  - [ ] Formatting is clear and readable

### Test 7: Error Handling
- [ ] Enter invalid URL (e.g., "not a url")
  - [ ] See error message: "Invalid URL format"
  
- [ ] Leave URL blank, enter keyword
  - [ ] See error message: "Both url and keyword are required"

- [ ] Enter URL, leave keyword blank
  - [ ] See error message: "Both url and keyword are required"

- [ ] API down/timeout scenario
  - [ ] See error toast: "Failed to check ranking. Please try again."

---

## Mobile Testing

### Responsive Design
- [ ] Open on mobile device or use Chrome DevTools (Ctrl+Shift+M)
- [ ] Form stacks vertically on mobile
- [ ] Buttons are touch-friendly (48px minimum height)
- [ ] Text is readable (no horizontal scroll)
- [ ] Inputs are properly sized for mobile

### Form Interaction
- [ ] Can tap URL input on mobile keyboard
- [ ] Can tap keyword input
- [ ] Can tap "Check Ranking" button
- [ ] Loading spinner visible
- [ ] Results display properly on small screen

### Modal Testing (Mobile)
- [ ] Sign-in modal displays properly
- [ ] Modal is not wider than screen
- [ ] Can scroll within modal if needed
- [ ] Buttons are tappable

---

## Dark Mode Testing

- [ ] Toggle dark mode (theme switcher or system setting)
- [ ] Background gradient adjusts properly
- [ ] Text contrast is sufficient (WCAG AA standard)
- [ ] Form inputs are readable
- [ ] Buttons are visible
- [ ] Modal is properly styled
- [ ] Results display is readable

---

## Supabase Database Verification

### After Running Migration
```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'rank_tracking_history'
);
-- Should return: true

-- Check if view exists
SELECT EXISTS (
  SELECT FROM information_schema.views 
  WHERE table_name = 'user_rank_tracking_summary'
);
-- Should return: true
```

### After Premium User Test
```sql
-- Check if data was saved
SELECT * FROM rank_tracking_history 
WHERE user_id = '[test-user-id]'
ORDER BY created_at DESC
LIMIT 1;
-- Should return: One row with your test data
```

### Check RLS Policies
```sql
-- View all policies on rank_tracking_history
SELECT * FROM pg_policies 
WHERE tablename = 'rank_tracking_history';
-- Should return: 4 policies (SELECT, INSERT, UPDATE, DELETE)
```

---

## Integration Verification

### With Auth System
- [ ] `useAuth()` hook works
- [ ] `user` state available
- [ ] `isPremium` flag works correctly
- [ ] Token refresh works properly

### With Premium System
- [ ] PremiumCheckoutModal opens on demand
- [ ] Stripe integration works (test mode)
- [ ] Premium status updates after purchase
- [ ] Rank data saves after premium upgrade

### With Supabase
- [ ] Client connection works
- [ ] Insert operations succeed for premium users
- [ ] RLS prevents unauthorized access
- [ ] Indexes are being used (check query performance)

---

## Performance Testing

### API Response Time
- [ ] Rank check completes in < 5 seconds (typical)
- [ ] X AI API is responsive
- [ ] No timeout errors

### Database Performance
- [ ] Fetching history is fast (< 1 second)
- [ ] Summary calculation is fast (< 1 second)
- [ ] Export CSV completes quickly (< 2 seconds)

### Frontend Performance
- [ ] Page loads quickly (< 2 seconds)
- [ ] Form is responsive to input
- [ ] Modal opens instantly
- [ ] Results display immediately

---

## Security Verification

### API Security
- [ ] X_API key is not exposed in logs
- [ ] CORS headers are correct
- [ ] No sensitive data in error messages
- [ ] Rate limiting present (if applicable)

### Database Security
- [ ] RLS policies are enforced
- [ ] Users cannot see other users' data
- [ ] Foreign key constraint works
- [ ] Update/delete restricted to owner

### Frontend Security
- [ ] No API keys in frontend code
- [ ] No sensitive data in localStorage
- [ ] HTTPS required for all API calls
- [ ] CSRF protection in place

---

## Documentation Verification

- [ ] RANK_TRACKER_GUIDE.md is accurate
- [ ] RANK_TRACKER_QUICK_START.md is tested
- [ ] IMPLEMENTATION_SUMMARY.md covers all components
- [ ] Inline code comments are helpful
- [ ] No broken links in documentation

---

## Pre-Production (Final Steps)

### Code Quality
- [ ] No console warnings or errors
- [ ] No unused imports
- [ ] TypeScript types are correct
- [ ] Linting passes: `npm run lint`

### Build Verification
- [ ] `npm run build` completes successfully
- [ ] No build warnings
- [ ] Build size is reasonable
- [ ] Source maps are available (for debugging)

### Environment Configuration
- [ ] All environment variables set
- [ ] No hardcoded secrets
- [ ] Configuration matches production settings
- [ ] API endpoints are correct

---

## Production Deployment

### Pre-Deployment
- [ ] Git repository is clean (no uncommitted changes)
- [ ] All tests pass
- [ ] All checklist items above are complete
- [ ] Backup of production database taken
- [ ] Rollback plan is documented

### Deployment Steps
1. [ ] Commit all code changes
2. [ ] Push to main/production branch
3. [ ] Verify Netlify build succeeds
4. [ ] Run Supabase migration (if not already done)
5. [ ] Set environment variables in production
6. [ ] Monitor deployment completion

### Post-Deployment
- [ ] Verify site loads: `https://yourdomain.com/`
- [ ] Test rank tracker on production
- [ ] Test with guest user
- [ ] Test with free user
- [ ] Test with premium user
- [ ] Monitor error logs
- [ ] Monitor API usage
- [ ] Monitor database queries

---

## Monitoring & Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor X AI API usage
- [ ] Verify no RLS errors
- [ ] Check user feedback

### Weekly
- [ ] Review API performance metrics
- [ ] Check database query performance
- [ ] Monitor conversion metrics
- [ ] Review user engagement

### Monthly
- [ ] Analyze rank tracker usage
- [ ] Review premium conversions
- [ ] Check for feature requests
- [ ] Plan improvements

---

## Success Criteria

### Functional
- ✅ Rank checker works for all user types
- ✅ Premium data persistence works
- ✅ Dashboard displays history correctly
- ✅ Mobile responsive
- ✅ Dark mode works
- ✅ No critical errors

### Performance
- ✅ API responses < 5 seconds
- ✅ Database queries < 1 second
- ✅ Page load < 2 seconds
- ✅ No timeout errors

### User Experience
- ✅ Clear user flows for each account type
- ✅ Helpful error messages
- ✅ Professional UI/UX
- ✅ Mobile-friendly
- ✅ Accessible (WCAG AA)

### Business
- ✅ Premium feature is valuable
- ✅ Encourages subscriptions
- ✅ Good user engagement
- ✅ Positive feedback

---

## Rollback Plan

If issues occur after deployment:

1. **Minor Issues** (UI/styling)
   - [ ] Fix in code
   - [ ] Deploy hotfix

2. **Database Issues** (RLS/schema)
   - [ ] Restore from backup
   - [ ] Check migration
   - [ ] Verify RLS policies

3. **API Issues** (X AI)
   - [ ] Check X API status
   - [ ] Verify API key
   - [ ] Check rate limits
   - [ ] Fallback to error message

4. **Critical Issues** (all users affected)
   - [ ] Revert to previous version
   - [ ] Restore database backup
   - [ ] Investigate root cause
   - [ ] Deploy fix

---

## Sign-Off

- [ ] All items completed
- [ ] Ready for production
- [ ] Documentation complete
- [ ] Team trained on new feature
- [ ] Support team briefed
- [ ] Monitoring set up

**Date Completed**: _____________

**Signed By**: _____________

---

## Notes

Use this space to document any issues, solutions, or notes during testing:

```
[Add your notes here]
```

---

**Last Updated**: January 15, 2025  
**Status**: ✅ Ready for Use  
**Version**: 1.0

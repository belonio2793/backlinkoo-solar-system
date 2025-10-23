-- Make balance column a generated column that auto-calculates like Excel formula
-- This ensures balance is always accurate: amount + bonus - total_used

-- Step 1: First, drop the existing balance column if it exists
ALTER TABLE public.credits DROP COLUMN IF EXISTS balance;

-- Step 2: Add balance as a generated column that automatically calculates
ALTER TABLE public.credits 
ADD COLUMN balance INTEGER GENERATED ALWAYS AS (
  COALESCE(amount, 0) + COALESCE(bonus, 0) - COALESCE(total_used, 0)
) STORED;

-- Step 3: Create index on balance for better query performance
CREATE INDEX IF NOT EXISTS idx_credits_balance ON public.credits(balance);

-- Step 4: Add helpful comment explaining the auto-calculation
COMMENT ON COLUMN public.credits.balance IS 'Auto-calculated balance: amount + bonus - total_used (like Excel formula)';

-- Step 5: Verify the calculation works by checking existing data
-- This will show the auto-calculated balances for verification
DO $$
DECLARE
    rec RECORD;
    calculated_balance INTEGER;
BEGIN
    -- Log some sample calculations for verification
    RAISE NOTICE 'Verifying balance auto-calculation:';
    
    FOR rec IN 
        SELECT user_id, amount, bonus, total_used, balance
        FROM public.credits 
        LIMIT 5
    LOOP
        calculated_balance := COALESCE(rec.amount, 0) + COALESCE(rec.bonus, 0) - COALESCE(rec.total_used, 0);
        
        RAISE NOTICE 'User %: amount=%, bonus=%, used=%, auto_balance=%, expected=%', 
            rec.user_id, 
            COALESCE(rec.amount, 0), 
            COALESCE(rec.bonus, 0), 
            COALESCE(rec.total_used, 0),
            rec.balance,
            calculated_balance;
    END LOOP;
END $$;

-- Step 6: Create or replace any triggers that might interfere
-- Remove old trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_credits_balance ON public.credits;
DROP FUNCTION IF EXISTS public.update_credits_balance();

-- Note: With GENERATED ALWAYS AS columns, we don't need triggers
-- The database automatically maintains the balance column

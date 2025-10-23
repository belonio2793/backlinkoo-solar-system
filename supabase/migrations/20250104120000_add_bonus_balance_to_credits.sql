-- Add bonus and balance columns to credits table
-- This allows tracking gifted/bonus credits separately from purchased credits

-- Add the bonus column to track gifted credits
ALTER TABLE public.credits 
ADD COLUMN IF NOT EXISTS bonus INTEGER NOT NULL DEFAULT 0;

-- Add the balance column to track total available credits
ALTER TABLE public.credits 
ADD COLUMN IF NOT EXISTS balance INTEGER NOT NULL DEFAULT 0;

-- Create a function to calculate and update balance automatically
CREATE OR REPLACE FUNCTION public.update_credits_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate balance as: amount + bonus - total_used
  NEW.balance = (NEW.amount + NEW.bonus) - NEW.total_used;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update balance on any credits table change
DROP TRIGGER IF EXISTS trigger_update_credits_balance ON public.credits;
CREATE TRIGGER trigger_update_credits_balance
  BEFORE INSERT OR UPDATE ON public.credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_credits_balance();

-- Update existing records to have correct balance
UPDATE public.credits 
SET 
  bonus = 0,
  balance = amount - total_used
WHERE bonus IS NULL OR balance IS NULL OR balance = 0;

-- Add helpful comments
COMMENT ON COLUMN public.credits.bonus IS 'Credits gifted by admins or earned through bonuses';
COMMENT ON COLUMN public.credits.balance IS 'Total available credits (amount + bonus - total_used)';
COMMENT ON COLUMN public.credits.amount IS 'Credits purchased with money';
COMMENT ON COLUMN public.credits.total_purchased IS 'Total credits ever purchased';
COMMENT ON COLUMN public.credits.total_used IS 'Total credits consumed by campaigns';

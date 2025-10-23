-- Create a safe RPC to increment domain post count atomically
CREATE OR REPLACE FUNCTION public.increment_domain_post_count(domain_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.domains
  SET post_count = COALESCE(post_count, 0) + 1,
      updated_at = now()
  WHERE id = domain_id;
END;
$$;

-- Grant execute to authenticated role (if desired)
GRANT EXECUTE ON FUNCTION public.increment_domain_post_count(uuid) TO authenticated;

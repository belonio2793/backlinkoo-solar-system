-- Migration: Add favicon column to domains
-- Created: 2025-10-01

BEGIN;

ALTER TABLE IF EXISTS public.domains
  ADD COLUMN IF NOT EXISTS favicon TEXT;

COMMIT;

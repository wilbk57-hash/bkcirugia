ALTER TABLE public.user_books
  ADD COLUMN IF NOT EXISTS ocr_pages_done integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ocr_total_pages integer;
-- Drop restrictive policies
DROP POLICY IF EXISTS "Users can view their own diary entries" ON public.lunar_diary;
DROP POLICY IF EXISTS "Users can create their own diary entries" ON public.lunar_diary;
DROP POLICY IF EXISTS "Users can update their own diary entries" ON public.lunar_diary;
DROP POLICY IF EXISTS "Users can delete their own diary entries" ON public.lunar_diary;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Users can view their own diary entries"
  ON public.lunar_diary FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary entries"
  ON public.lunar_diary FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries"
  ON public.lunar_diary FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries"
  ON public.lunar_diary FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Recreate trigger (in case it didn't persist)
DROP TRIGGER IF EXISTS update_lunar_diary_updated_at ON public.lunar_diary;
CREATE TRIGGER update_lunar_diary_updated_at
  BEFORE UPDATE ON public.lunar_diary
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
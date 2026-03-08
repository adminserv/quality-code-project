
DROP TRIGGER IF EXISTS update_lunar_diary_updated_at ON public.lunar_diary;
CREATE TRIGGER update_lunar_diary_updated_at
  BEFORE UPDATE ON public.lunar_diary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

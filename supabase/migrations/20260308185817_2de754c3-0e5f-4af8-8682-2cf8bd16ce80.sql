-- Fix lunar_diary: drop RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can view their own diary entries" ON public.lunar_diary;
DROP POLICY IF EXISTS "Users can create their own diary entries" ON public.lunar_diary;
DROP POLICY IF EXISTS "Users can update their own diary entries" ON public.lunar_diary;
DROP POLICY IF EXISTS "Users can delete their own diary entries" ON public.lunar_diary;

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

-- Fix notification_preferences: drop RESTRICTIVE and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.notification_preferences;

CREATE POLICY "Users can view their own preferences"
  ON public.notification_preferences FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.notification_preferences FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.notification_preferences FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON public.notification_preferences FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Fix push_subscriptions: drop RESTRICTIVE and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.push_subscriptions;

CREATE POLICY "Users can view their own subscriptions"
  ON public.push_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.push_subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.push_subscriptions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.push_subscriptions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Fix app_config: replace pattern-based policy with explicit allowlist
DROP POLICY IF EXISTS "Allow authenticated to read public keys" ON public.app_config;

CREATE POLICY "Allow authenticated to read public config"
  ON public.app_config FOR SELECT TO authenticated
  USING (key IN ('vapid_public_key', 'vapid_subject'));
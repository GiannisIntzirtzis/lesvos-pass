-- =====================================================================
-- Lesvos Pass — test data (step 2)
-- 1) First create a test partner login: Authentication -> Users -> Add user
-- 2) Replace YOUR@EMAIL below with that email, then Run.
-- 3) Copy the 3 card_token values from the results: they are shown ONLY ONCE.
-- =====================================================================

-- Link the test login to the Genesis partner
insert into public.partner_members (user_id, partner_id)
select id, 'genesis' from auth.users where email = 'YOUR@EMAIL';

-- Create 3 test cards and show their number and secret token
select c.* from generate_series(1, 3) as g, lateral public.create_card('test') as c;

/* Lesvos Pass — connection to the database (Supabase).
   These two values are PUBLIC by design: security comes from the database rules.
   Never put the "secret" / "service_role" key here. */
window.LP_CONFIG = {
  supabaseUrl: "https://gqnqzlohifdodjdbusur.supabase.co",
  supabaseKey: "sb_publishable_334j83khUWguChAbr7T7IA_gEP3tJCj",
  // Support contact shown to partners (fill in: country code + number, no + or spaces)
  supportWhatsapp: "+306980324890",
  supportEmail: "ioannisintzirtzis@gmail.com"
};
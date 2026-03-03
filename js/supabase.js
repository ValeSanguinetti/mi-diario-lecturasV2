const SUPABASE_URL = "https://gxtuylxdyyqrpugebhhs.supabase.co";
const SUPABASE_KEY = "sb_publishable_waKX1ah8sDNGfZ6ko_G8Lw_Eomb8Q5y";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
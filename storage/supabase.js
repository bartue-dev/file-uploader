const { createClient  } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Check your environment variables.");
}


const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = {
supabase
}

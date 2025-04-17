const { createClient  } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_KEY:', supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Check your environment variables.");
}


const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = {
supabase
}

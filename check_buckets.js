const { createClient } = require('@supabase/supabase-js');
const url = 'https://txnecdeccianklqqyrav.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM';
const supabase = createClient(url, key);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.error("Error:", error);
  else console.log("Buckets:", data.map(b => b.name));
}
checkBuckets();

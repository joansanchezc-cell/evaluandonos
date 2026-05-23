const SB_URL = 'https://txnecdeccianklqqyrav.supabase.co';
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM";

async function query(table, select = '*', filter = '') {
  const url = `${SB_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}${filter}`;
  const response = await fetch(url, {
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function run() {
  try {
    console.log("=== UNIQUE SEDES IN eval_resultados ===");
    const res = await query('eval_resultados', 'sede', '');
    const uniqueRes = [...new Set(res.map(d => d.sede))];
    console.log(uniqueRes);

    console.log("\n=== UNIQUE SEDES IN eval_estudiantes_notas ===");
    const notas = await query('eval_estudiantes_notas', 'sede', '');
    const uniqueNotas = [...new Set(notas.map(d => d.sede))];
    console.log(uniqueNotas);

  } catch (err) {
    console.error("Fatal:", err);
  }
}

run();

const fs = require('fs');
const c = fs.readFileSync('src/shared/constants.js', 'utf8');
const keyMatch = c.match(/export const SB_KEY = '([^']+)';/);
if (!keyMatch) { console.error("Key not found in constants"); process.exit(1); }
const SB_KEY = keyMatch[1];
const SB_URL = 'https://txnecdeccianklqqyrav.supabase.co';

async function test() {
    const res = await fetch(`${SB_URL}/rest/v1/eval_preguntas?grado=eq.10&periodo=eq.1&select=asignatura`, {
        headers: {
            'apikey': SB_KEY,
            'Authorization': `Bearer ${SB_KEY}`
        }
    });
    const data = await res.json();
    console.log("Data length:", data.length);
    if(data && data.length > 0) {
        const distinct = [...new Set(data.map(i => i.asignatura))].sort((a, b) => a.localeCompare(b, 'es'));
        console.log("Distinct:", distinct);
    } else {
        console.log(data);
    }
}
test();

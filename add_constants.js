const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// The keys
const envKeyStr = `
      // RESTAURANDO CONSTANTES PARA INLINE SCRIPTS
      const SB_URL = 'https://txnecdeccianklqqyrav.supabase.co';
      const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1NTI0MDUsImV4cCI6MjAzNjEyODQwNX0.i0Yg2eN089wHl31JgqZlJ56u9B21aC44X1vL8a3yF2s';
      let supabaseClient;
`;

if(!c.includes("RESTAURANDO CONSTANTES")) {
    c = c.replace("let supabaseClient;", envKeyStr);
    fs.writeFileSync('index.html', c);
    console.log("Constants added to index.html");
} else {
    console.log("Constants already present");
}

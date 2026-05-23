const fs=require('fs');
const c=fs.readFileSync('index.html','utf8');
const m=c.match(/supabaseClient\.from\(['\`\"](.*?)['\`\"]\)/g);
if (m) {
  const unique=[...new Set(m)];
  console.log(unique.join('\n'));
}

const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const footerHTML = `
  <footer style="background: white; border-top: 2px solid #f1f5f9; padding: 4rem 0; margin-top: 8rem;">
    <div class="container" style="display: flex; flex-direction: column; align-items: center; gap: 2rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-weight: 900; font-size: 2rem; color: #1e293b; letter-spacing: -0.5px;">E<span
            style="color: #22c55e;">✔</span>aluándonos</span>
      </div>
      <p style="color: #64748b; font-weight: 800; font-size: 0.9rem; letter-spacing: 0.5px;">© 2026 AndréSán
        - Evaluándonos System <span style="color:#4f46e5; margin-left:10px;"></span></p>
    </div>
  </footer>
`;

let mainEnd = c.lastIndexOf('</main>');
if (mainEnd > -1) {
    c = c.substring(0, mainEnd) + '\n\n' + footerHTML + '\n' + c.substring(mainEnd);
    fs.writeFileSync('index.html', c, 'utf8');
    console.log('✅ Footer appended.');
}

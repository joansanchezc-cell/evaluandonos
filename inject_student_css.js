const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const injection = `
  <style>
    /* Estilos estrictos para el perfil estudiante */
    body.is-student #sidebar nav > p:nth-of-type(1),
    body.is-student #sidebar nav > p:nth-of-type(2),
    body.is-student #sidebar nav > div:nth-of-type(1),
    body.is-student #sidebar nav > div:nth-of-type(2),
    body.is-student #sidebar nav > button#tab-estadisticas {
      display: none !important;
    }

    body.is-student #sidebar h2 {
      display: none !important;
    }

    body.is-student .mobile-nav {
      display: none !important;
    }
    
    /* Ensure only Individual report container is shown correctly in student mode, even if switchMainTab does weird things */
    body.is-student #resultado-container,
    body.is-student #estadisticas-container,
    body.is-student #grupal-container,
    body.is-student #asignatura-container,
    body.is-student #estudiante-detalle-container,
    body.is-student #admin-modal,
    body.is-student #usuarios-container {
       display: none !important;
    }
    
    body.is-student #individual-container {
       display: block !important;
    }
  </style>
`;

if (!c.includes('/* Estilos estrictos para el perfil estudiante */')) {
    c = c.replace('</head>', injection + '</head>');
    fs.writeFileSync('index.html', c, 'utf8');
    console.log('✅ CSS inyectado correctamente.');
} else {
    console.log('⚠️ El CSS ya estaba inyectado.');
}

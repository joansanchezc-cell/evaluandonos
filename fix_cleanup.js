const fs = require('fs');
const filePath = require('path').join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// ================================================================
// Detectar y eliminar el bloque de código viejo que quedó mezclado
// desde "async function cargarUsuarios() {window.switchUserForm..."
// hasta el bloque de todosLosUsuarios y el nuevo async function cargarUsuarios
// ================================================================

// El problema es que tenemos:
// cargarUsuarios() { [viejo codigo de switchUserForm] }
// Necesitamos separar eso

const mixedPattern = "async function cargarUsuarios() {window.switchUserForm";

if (content.includes(mixedPattern)) {
  // Separar el bloque incorrecto: cargarUsuarios() { ... viejo ... cargarUsuarios() { ... nuevo ...
  // El viejo tiene el inicio de cargarUsuarios pegado con el inicio de switchUserForm
  // Buscar y reemplazar:
  
  // Encontrar posición del bloque mixto
  const mixedIdx = content.indexOf(mixedPattern);
  
  // Encontrar el final del bloque viejo (termina antes del nuevo cargarUsuarios real)
  // El nuevo cargarUsuarios real comienza justo después del bloque viejo de editarUsuario
  const newCargarIdx = content.indexOf('\n      async function cargarUsuarios() {\n', mixedIdx + 1);
  
  if (newCargarIdx > -1) {
    // El bloque viejo va desde mixedIdx hasta newCargarIdx
    // Necesitamos reemplazar "async function cargarUsuarios() {[VIEJO]" + el nuevo
    // con simplemente el nuevo cargarUsuarios
    
    const beforeMixed = content.substring(0, mixedIdx);
    const afterOld = content.substring(newCargarIdx);
    
    content = beforeMixed + afterOld;
    console.log('✅ Bloque viejo de switchUserForm eliminado del interior de cargarUsuarios');
  } else {
    console.log('❌ No se encontró el nuevo cargarUsuarios después del bloque mixto');
    
    // Buscar el final del bloque viejo buscando la función real cargarUsuarios
    // que sigue al bloque de editarUsuario
    const editarIdx = content.indexOf("window.editarUsuario = function(id)", mixedIdx);
    if (editarIdx > -1) {
      // El bloque viejo termina después del editarUsuario
      // Buscar el cierre de prepararNuevoUsuario y editarUsuario
      const afterEditarIdx = content.indexOf("\n\n      \n\n", editarIdx);
      if (afterEditarIdx > -1) {
        // Remover desde el inicio del bloque mixto hasta el inicio real de cargarUsuarios
        const beforeMixed = content.substring(0, mixedIdx);
        // Poner de vuelta el inicio de cargarUsuarios limpio
        const afterOld = content.substring(afterEditarIdx + 8);
        
        const newCargarStart = "\n      async function cargarUsuarios() {\n";
        content = beforeMixed + newCargarStart + afterOld;
        console.log('✅ Intentando separación alternativa...');
      }
    }
  }
} else {
  console.log('ℹ️ No se encontró el patrón mixto - puede que ya esté limpio');
}

// ================================================================
// Verificar que la función guardarUsuario() maneja los dos tipos
// ================================================================
const guardarIdx = content.indexOf('async function guardarUsuario()');
if (guardarIdx > -1) {
  const guardarSnippet = content.substring(guardarIdx, guardarIdx + 300);
  if (guardarSnippet.includes('nu-nombre-doc') || guardarSnippet.includes('nu-nombre-est')) {
    console.log('✅ guardarUsuario ya usa los campos nuevos');
  } else {
    console.log('⚠️ guardarUsuario usa campos viejos - necesita actualización');
    
    // Reemplazar la función guardarUsuario completa
    const oldGuardar = content.substring(guardarIdx, content.indexOf('\n      }\n\n\n\n', guardarIdx) + 12);
    
    const newGuardar = `async function guardarUsuario() {
        const isEdit = document.getElementById('nu-id').value !== '';
        const formType = document.getElementById('nu-form-type').value;
        const status = document.getElementById('users-status');
        
        try {
          status.innerText = '⏳ Guardando...';
          status.style.display = 'block';
          status.style.background = '#f8fafc';
          status.style.color = '#475569';

          if (formType === 'docente') {
            // --- GUARDAR DOCENTE en 'perfiles' ---
            const id = document.getElementById('nu-id').value;
            const email = (document.getElementById('nu-email') || {}).value?.trim() || '';
            const nombre = (document.getElementById('nu-nombre-doc') || {}).value?.trim() || '';
            const pass = (document.getElementById('nu-pass') || {}).value || '';
            const rol = (document.getElementById('nu-rol') || {}).value || 'lector';

            if (!email || !nombre) throw new Error('El nombre y el email son obligatorios.');

            if (!isEdit) {
              if (!pass) throw new Error('La contraseña es obligatoria para nuevos usuarios.');
              const { data, error } = await supabaseClient.auth.signUp({
                email, password: pass, options: { data: { nombre, name: nombre } }
              });
              if (error) {
                if (error.message.includes('already registered') || error.status === 422) throw new Error('El correo ya está registrado.');
                throw error;
              }
              const userId = data.user.id;
              const { error: pErr } = await supabaseClient.from('perfiles').insert({ id: userId, email, nombre, rol });
              if (pErr) throw pErr;
            } else {
              const { error: pErr } = await supabaseClient.from('perfiles').update({ email, nombre, rol }).eq('id', id);
              if (pErr) throw pErr;
            }

          } else {
            // --- GUARDAR ESTUDIANTE en 'maestro_estudiantes' ---
            const originalId = document.getElementById('nu-id').value;
            const nombre = (document.getElementById('nu-nombre-est') || {}).value?.trim() || '';
            const identificacion = (document.getElementById('nu-identificacion') || {}).value?.trim() || '';
            const sede = (document.getElementById('nu-sede') || {}).value?.trim() || '';
            const zipgrade = (document.getElementById('nu-zipgrade') || {}).value?.trim() || '';

            if (!nombre || !identificacion || !sede) throw new Error('Nombre, Identificación y Sede son obligatorios.');

            if (!isEdit) {
              const { error } = await supabaseClient.from('maestro_estudiantes').insert({ identificacion, nombre, sede, zipgrade_id: zipgrade });
              if (error) {
                if (error.code === '23505') throw new Error('La identificación ya existe en la base de datos.');
                throw error;
              }
            } else {
              const { error } = await supabaseClient.from('maestro_estudiantes').update({ nombre, sede, zipgrade_id: zipgrade }).eq('identificacion', originalId);
              if (error) throw error;
            }
          }

          status.innerText = isEdit ? '✅ ACTUALIZADO exitosamente.' : '✅ CREADO exitosamente.';
          status.style.background = '#ecfdf5';
          status.style.color = '#10b981';
          
          setTimeout(() => prepararNuevoUsuario(), 1500);
          cargarUsuarios();

        } catch(e) {
          status.innerText = '❌ Error: ' + e.message;
          status.style.background = '#fef2f2';
          status.style.color = '#ef4444';
        }
      }`;
    
    content = content.substring(0, guardarIdx) + newGuardar + content.substring(guardarIdx + oldGuardar.length);
    console.log('✅ guardarUsuario actualizado para manejar docentes y estudiantes');
  }
} else {
  console.log('⚠️ No se encontró guardarUsuario');
}

fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log('\n✅ Script completado!');

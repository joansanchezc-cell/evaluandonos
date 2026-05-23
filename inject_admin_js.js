const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const newAdminJS = `
      // --- LOGICA DEL NUEVO ADMINISTRADOR A PANTALLA COMPLETA ---
      
      function toggleAdmin() {
        const view = $('admin-view');
        if (view) {
          view.style.display = 'block';
          // Ocultar barras de scroll del body para que el admin use la pantalla completa
          document.body.style.overflow = 'hidden'; 
          cargarGradosAdminSelects();
        }
      }

      function cerrarAdminView() {
        const view = $('admin-view');
        if (view) {
          view.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      }

      async function generarBackupJSON() {
        if (!confirm("Se va a generar un archivo JSON con la copia completa de la base de datos (Estudiantes, Docentes, Resultados, Preguntas, Notas). ¿Continuar?")) return;
        
        try {
          showLoading(true);
          const anio = window.currentYear || 2026;
          
          const backup = {
            metadata: { fecha: new Date().toISOString(), anio: anio },
            tablas: {}
          };

          // Descargar todas las tablas en paralelo
          const [resData, pregData, notasData, estData, docData] = await Promise.all([
            supabaseClient.from('eval_resultados').select('*').eq('anio', anio),
            supabaseClient.from('eval_preguntas').select('*').eq('anio', anio),
            supabaseClient.from('eval_estudiantes_notas').select('*').eq('anio', anio),
            supabaseClient.from('maestro_estudiantes').select('*').eq('anio', anio),
            supabaseClient.from('docentes_privacidad').select('*')
          ]);

          backup.tablas['eval_resultados'] = resData.data;
          backup.tablas['eval_preguntas'] = pregData.data;
          backup.tablas['eval_estudiantes_notas'] = notasData.data;
          backup.tablas['maestro_estudiantes'] = estData.data;
          backup.tablas['docentes_privacidad'] = docData.data;

          // Convertir a JSON
          const jsonStr = JSON.stringify(backup, null, 2);
          const blob = new Blob([jsonStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          const dateStr = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
          a.download = \`backup-evaluandonos-\${dateStr}.json\`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          alert("Backup generado y descargado exitosamente.");
        } catch (error) {
          console.error("Error al generar backup:", error);
          alert("Hubo un error al generar el backup. Revisa la consola.");
        } finally {
          showLoading(false);
        }
      }

      async function subirImagenStorage() {
        const inputName = $('img-upload-name');
        const inputFile = $('img-upload-file');
        const statusDiv = $('img-upload-status');
        
        if (!inputName || !inputFile || !statusDiv) return;
        
        const fileName = inputName.value.trim();
        const file = inputFile.files[0];
        
        if (!fileName || !file) {
          statusDiv.innerText = '❌ Por favor ingresa el nombre y selecciona un archivo.';
          statusDiv.style.color = '#ef4444';
          return;
        }

        statusDiv.innerText = '⏳ Subiendo imagen a Supabase...';
        statusDiv.style.color = '#eab308';

        try {
          // El bucket se llama 'assets' según la investigación
          const { data, error } = await supabaseClient.storage
            .from('assets')
            .upload(fileName, file, { cacheControl: '3600', upsert: true });

          if (error) {
            throw error;
          }

          statusDiv.innerText = '✅ Imagen subida con éxito: ' + fileName;
          statusDiv.style.color = '#10b981';
          inputName.value = '';
          inputFile.value = '';
          
          // Refrescar el detalle visual de la pregunta si está abierta
          if (typeof verDetallePreguntaAdmin === 'function') verDetallePreguntaAdmin();

        } catch (error) {
          console.error("Error al subir imagen:", error);
          statusDiv.innerText = '❌ Error al subir: ' + error.message;
          statusDiv.style.color = '#ef4444';
        }
      }

      async function guardarEstudianteIndividual() {
        const id = $('ind-est-id').value.trim();
        const nom = $('ind-est-nom').value.trim();
        const gra = parseInt($('ind-est-gra').value);
        const jor = $('ind-est-jor').value;
        const sed = $('ind-est-sede').value.trim() || 'Central';
        const statusDiv = $('ind-est-status');

        if (!id || !nom || !gra) {
          statusDiv.innerText = '❌ Identificación, Nombre y Grado son obligatorios.';
          statusDiv.style.color = '#ef4444';
          return;
        }

        try {
          statusDiv.innerText = '⏳ Guardando estudiante...';
          statusDiv.style.color = '#eab308';
          
          const estudiante = {
            identificacion: id,
            nombre: nom,
            grado: gra,
            jornada: jor,
            sede: sed,
            anio: window.currentYear || 2026
          };

          const { error } = await supabaseClient.from('maestro_estudiantes').upsert([estudiante], { onConflict: 'identificacion' });

          if (error) throw error;

          statusDiv.innerText = '✅ Estudiante guardado con éxito.';
          statusDiv.style.color = '#10b981';
          
          $('ind-est-id').value = '';
          $('ind-est-nom').value = '';

        } catch (error) {
          console.error("Error al guardar estudiante:", error);
          statusDiv.innerText = '❌ Error al guardar: ' + error.message;
          statusDiv.style.color = '#ef4444';
        }
      }

      async function guardarDocenteIndividual() {
        const id = $('ind-doc-id').value.trim();
        const nom = $('ind-doc-nom').value.trim();
        const sed = $('ind-doc-sed').value.trim();
        const rol = $('ind-doc-rol').value.trim();
        const gra = $('ind-doc-gra').value.trim();
        const statusDiv = $('ind-doc-status');

        if (!nom) {
          statusDiv.innerText = '❌ El Nombre es obligatorio.';
          statusDiv.style.color = '#ef4444';
          return;
        }

        try {
          statusDiv.innerText = '⏳ Guardando docente...';
          statusDiv.style.color = '#eab308';
          
          const docente = {
            nombre: nom,
            id: id || null,
            sedes: sed || null,
            roles: rol || null,
            grados: gra || null
          };

          // Intentar insertar. Si existe el id, update. En docentes_privacidad es complicado porque la PK es id que suele estar vacío o autogenerado.
          // Haremos un select primero para ver si existe por nombre exacto.
          const { data: exist } = await supabaseClient.from('docentes_privacidad').select('id').eq('nombre', nom).maybeSingle();
          
          let errorObj = null;
          if (exist && exist.id) {
             const { error } = await supabaseClient.from('docentes_privacidad').update(docente).eq('id', exist.id);
             errorObj = error;
          } else {
             const { error } = await supabaseClient.from('docentes_privacidad').insert([docente]);
             errorObj = error;
          }

          if (errorObj) throw errorObj;

          statusDiv.innerText = '✅ Docente guardado/actualizado con éxito.';
          statusDiv.style.color = '#10b981';
          
        } catch (error) {
          console.error("Error al guardar docente:", error);
          statusDiv.innerText = '❌ Error al guardar: ' + error.message;
          statusDiv.style.color = '#ef4444';
        }
      }
`;

// Extract toggleAdmin function to replace it
const startMarker = 'function toggleAdmin() {';
const startIndex = content.indexOf(startMarker);

if (startIndex !== -1) {
    // Find the end of toggleAdmin
    // toggleAdmin ends at line 3008 roughly
    // We will just find the next function definition 'function cargarGradosAdminSelects()'
    const endMarker = 'async function cargarGradosAdminSelects() {';
    const endIndex = content.indexOf(endMarker);
    
    if (endIndex !== -1) {
        const before = content.substring(0, startIndex);
        const after = content.substring(endIndex);
        content = before + newAdminJS + "\n      " + after;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("JS del Administrador inyectado con éxito.");
    }
} else {
    console.error("No se encontró toggleAdmin");
}

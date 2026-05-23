import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """        if ($('user-role-label')) $('user-role-label').innerText = "Estudiante";"""
replacement1 = """        if ($('user-role-label')) $('user-role-label').innerText = "Estudiante";
        if ($('mobile-greeting-name')) $('mobile-greeting-name').innerText = nombre;
        if ($('mobile-role-badge')) $('mobile-role-badge').innerText = "ESTUDIANTE";
        if ($('mobile-date')) {
            const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            $('mobile-date').innerText = new Date().toLocaleDateString('es-ES', opciones);
        }"""

target2 = """          if ($('user-nombre')) $('user-nombre').innerText = userName;"""
replacement2 = """          if ($('user-nombre')) $('user-nombre').innerText = userName;
          if ($('mobile-greeting-name')) $('mobile-greeting-name').innerText = userName;
          if ($('mobile-role-badge')) $('mobile-role-badge').innerText = currentRole.toUpperCase();
          if ($('mobile-date')) {
              const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              $('mobile-date').innerText = new Date().toLocaleDateString('es-ES', opciones);
          }"""

new_content = content.replace(target1, replacement1).replace(target2, replacement2)

with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
    f.write(new_content)
    print("Success: Patched JS logic.")

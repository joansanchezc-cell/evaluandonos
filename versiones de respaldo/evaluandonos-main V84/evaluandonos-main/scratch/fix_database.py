import csv
import unicodedata

def normalize(text):
    if not text: return ""
    return text.strip().upper()

# 1. Cargar la base de datos original completa (con Sedes)
master_data = []
identificaciones_vistas = set()

with open('estudiantes/base datos estudiantes.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        ident = row['Identificación'].strip()
        if ident and ident not in identificaciones_vistas:
            master_data.append({
                'ident': ident,
                'nombre': row['Estudiante'].strip(),
                'sede': row['SEDE'].strip(),
                'zipid': ''
            })
            identificaciones_vistas.add(ident)

# 2. Cargar los códigos de ZipGrade para vincularlos
zipgrade_map = {}
with open('estudiantes/codigos zipgrade estudiantes.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Normalizar para buscar
        full_name = normalize(row['Last Name'] + " " + row['First Name'])
        zipgrade_map[full_name] = row['ZipGrade ID']

# 3. Vincular los códigos ZipGrade al maestro
for student in master_data:
    norm_name = normalize(student['nombre'])
    if norm_name in zipgrade_map:
        student['zipid'] = zipgrade_map[norm_name]

# 4. Generar el Script SQL de Reparación
sql_lines = [
    "-- SCRIPT DE REPARACION TOTAL DE MAESTRO_ESTUDIANTES",
    "BEGIN;",
    "TRUNCATE TABLE maestro_estudiantes; -- Limpiar la tabla dañada",
    ""
]

for s in master_data:
    # Escapar comillas simples para SQL
    nombre_esc = s['nombre'].replace("'", "''")
    sede_esc = s['sede'].replace("'", "''")
    ident_esc = s['ident'].replace("'", "''")
    zipid_esc = s['zipid'].replace("'", "''")
    
    sql_lines.append(f"INSERT INTO maestro_estudiantes (identificacion, nombre, zipgrade_id, sede) VALUES ('{ident_esc}', '{nombre_esc}', '{zipid_esc}', '{sede_esc}');")

sql_lines.append("COMMIT;")

with open('estudiantes/reparacion_maestro.sql', mode='w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print("Script de reparacion generado en 'estudiantes/reparacion_maestro.sql'")

import csv
import unicodedata

def normalize_key(key):
    return "".join(c for c in unicodedata.normalize('NFD', key.upper()) if unicodedata.category(c) != 'Mn').strip()

# 1. Cargar la base de datos original completa
master_data = []
identificaciones_vistas = set()

# Usar utf-8-sig por si hay un BOM al inicio
with open('estudiantes/base datos estudiantes.csv', mode='r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f, delimiter=';')
    # Mapear nombres de columnas por si acaso cambian mayúsculas/acentos
    field_map = {normalize_key(k): k for k in reader.fieldnames}
    
    key_sede = field_map.get('SEDE', 'SEDE')
    key_estudiante = field_map.get('ESTUDIANTE', 'Estudiante')
    key_ident = field_map.get('IDENTIFICACION', 'Identificación')

    for row in reader:
        ident = row[key_ident].strip()
        if ident and ident not in identificaciones_vistas:
            master_data.append({
                'ident': ident,
                'nombre': row[key_estudiante].strip(),
                'sede': row[key_sede].strip(),
                'zipid': ''
            })
            identificaciones_vistas.add(ident)

# 2. Cargar los códigos de ZipGrade
zipgrade_map = {}
with open('estudiantes/codigos zipgrade estudiantes.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # ZipGrade: Last Name, First Name
        full_name = (row['Last Name'] + " " + row['First Name']).strip().upper()
        # Normalizar para comparación robusta
        norm_name = "".join(c for c in unicodedata.normalize('NFD', full_name) if unicodedata.category(c) != 'Mn')
        zipgrade_map[norm_name] = row['ZipGrade ID']

# 3. Vincular los códigos ZipGrade
for student in master_data:
    name_to_search = "".join(c for c in unicodedata.normalize('NFD', student['nombre'].upper()) if unicodedata.category(c) != 'Mn')
    if name_to_search in zipgrade_map:
        student['zipid'] = zipgrade_map[name_to_search]

# 4. Generar el Script SQL final
sql_lines = [
    "-- SCRIPT DE REPARACION TOTAL - EJECUTAR EN SQL EDITOR DE SUPABASE",
    "BEGIN;",
    "TRUNCATE TABLE maestro_estudiantes;",
    ""
]

for s in master_data:
    nombre_esc = s['nombre'].replace("'", "''")
    sede_esc = s['sede'].replace("'", "''")
    ident_esc = s['ident'].replace("'", "''")
    zipid_esc = s['zipid'].replace("'", "''")
    
    sql_lines.append(f"INSERT INTO maestro_estudiantes (identificacion, nombre, zipgrade_id, sede) VALUES ('{ident_esc}', '{nombre_esc}', '{zipid_esc}', '{sede_esc}');")

sql_lines.append("COMMIT;")

with open('estudiantes/REPARAR_BASE_DATOS.sql', mode='w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print("Script generado exitosamente.")

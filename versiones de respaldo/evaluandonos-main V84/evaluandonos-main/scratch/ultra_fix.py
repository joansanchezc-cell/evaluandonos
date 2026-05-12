import csv
import unicodedata

def clean_name_list(name):
    if not name: return []
    n = "".join(c for c in unicodedata.normalize('NFD', name.upper()) if unicodedata.category(c) != 'Mn')
    ignore = {'DE', 'LA', 'DEL', 'LOS', 'Y', 'LAS'}
    return [w.strip() for w in n.split() if w.strip() and w.strip() not in ignore]

def levenshtein_distance(s1, s2):
    if len(s1) < len(s2): return levenshtein_distance(s2, s1)
    if len(s2) == 0: return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

# 1. Cargar Base Maestra
master_students = []
identificaciones_vistas = set()
with open('estudiantes/base datos estudiantes.csv', mode='r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        ident = row['Identificación'].strip()
        if ident and ident not in identificaciones_vistas:
            master_students.append({
                'ident': ident,
                'nombre': row['Estudiante'].strip(),
                'sede': row['SEDE'].strip(),
                'words': clean_name_list(row['Estudiante']),
                'zipid': ''
            })
            identificaciones_vistas.add(ident)

# 2. Cargar ZipGrade
zip_list = []
with open('estudiantes/codigos zipgrade estudiantes.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        full_name = (row['Last Name'] + " " + row['First Name']).strip()
        zip_list.append({
            'id': row['ZipGrade ID'],
            'full_name': full_name,
            'words': clean_name_list(full_name),
            'matched': False
        })

# 3. Fase 1: Coincidencia de palabras (Intersección) - La más segura
for s in master_students:
    best_z = None
    max_score = 0
    for z in zip_list:
        if z['matched']: continue
        score = len(set(s['words']).intersection(set(z['words'])))
        if score > max_score:
            max_score = score
            best_z = z
    
    required = min(len(s['words']), len(best_z['words']) if best_z else 99, 3)
    if best_z and max_score >= required:
        s['zipid'] = best_z['id']
        best_z['matched'] = True

# 4. Fase 2: Coincidencia por Levenshtein (para errores de dedo) en los que sobran
unmatched_zip = [z for z in zip_list if not z['matched']]
unmatched_master = [s for s in master_students if not s['zipid']]

for s in unmatched_master:
    s_full = " ".join(s['words'])
    best_z = None
    min_dist = 99
    
    for z in unmatched_zip:
        if z['matched']: continue
        z_full = " ".join(z['words'])
        dist = levenshtein_distance(s_full, z_full)
        if dist < min_dist:
            min_dist = dist
            best_z = z
            
    # Si la distancia es pequeña respecto al largo del nombre (umbral de error 15%)
    if best_z and min_dist <= (len(s_full) * 0.15):
        s['zipid'] = best_z['id']
        best_z['matched'] = True

matched_count = sum(1 for s in master_students if s['zipid'])
print(f"Búsqueda Ultra-Refinada: Se encontraron {matched_count} coincidencias (antes eran 714).")

# 5. Generar SQL
sql_lines = ["BEGIN;", "TRUNCATE TABLE maestro_estudiantes;", ""]
for s in master_students:
    n_esc = s['nombre'].replace("'", "''")
    s_esc = s['sede'].replace("'", "''")
    i_esc = s['ident'].replace("'", "''")
    z_esc = s['zipid'].replace("'", "''")
    sql_lines.append(f"INSERT INTO maestro_estudiantes (identificacion, nombre, zipgrade_id, sede) VALUES ('{i_esc}', '{n_esc}', '{z_esc}', '{s_esc}');")
sql_lines.append("COMMIT;")

with open('estudiantes/REPARAR_BASE_DATOS_FINAL.sql', mode='w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

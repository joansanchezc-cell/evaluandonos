import csv
import unicodedata

def clean_name(name):
    if not name: return set()
    # Normalizar: quitar tildes, a mayúsculas y dividir en palabras
    n = "".join(c for c in unicodedata.normalize('NFD', name.upper()) if unicodedata.category(c) != 'Mn')
    # Quitar conectores comunes que estorban en la comparación
    ignore = {'DE', 'LA', 'DEL', 'LOS', 'Y', 'LAS'}
    words = [w.strip() for w in n.split() if w.strip() and w.strip() not in ignore]
    return words

def get_match_score(words1, words2):
    if not words1 or not words2: return 0
    set1 = set(words1)
    set2 = set(words2)
    matches = set1.intersection(set2)
    return len(matches)

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
                'words': clean_name(row['Estudiante']),
                'zipid': ''
            })
            identificaciones_vistas.add(ident)

# 2. Cargar ZipGrade y pre-procesar nombres
zip_list = []
with open('estudiantes/codigos zipgrade estudiantes.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        full_name = (row['Last Name'] + " " + row['First Name']).strip()
        zip_list.append({
            'id': row['ZipGrade ID'],
            'words': clean_name(full_name)
        })

# 3. Emparejamiento Inteligente
matches_found = 0
for s in master_students:
    best_match = None
    max_score = 0
    
    for z in zip_list:
        score = get_match_score(s['words'], z['words'])
        # Si coinciden todas las palabras o al menos 3 (en nombres largos)
        if score > max_score:
            max_score = score
            best_match = z
            
    # Umbral de confianza: 
    # - Si tiene 2 palabras y coinciden las 2.
    # - Si tiene 3+ palabras y coinciden al menos 3.
    # - O si coinciden todas las palabras de la lista de ZipGrade.
    required = min(len(s['words']), len(best_match['words']) if best_match else 99, 3)
    if best_match and max_score >= required:
        s['zipid'] = best_match['id']
        matches_found += 1
        # Opcional: remover de zip_list para no duplicar, pero mejor dejarlo por si hay hermanos con nombres similares
        # Aunque el scoring de intersección ya es bastante selectivo.

print(f"Búsqueda inteligente: Se encontraron {matches_found} coincidencias (antes eran 678).")

# 4. Generar SQL
sql_lines = ["BEGIN;", "TRUNCATE TABLE maestro_estudiantes;", ""]
for s in master_students:
    n_esc = s['nombre'].replace("'", "''")
    s_esc = s['sede'].replace("'", "''")
    i_esc = s['ident'].replace("'", "''")
    z_esc = s['zipid'].replace("'", "''")
    sql_lines.append(f"INSERT INTO maestro_estudiantes (identificacion, nombre, zipgrade_id, sede) VALUES ('{i_esc}', '{n_esc}', '{z_esc}', '{s_esc}');")
sql_lines.append("COMMIT;")

with open('estudiantes/REPARAR_BASE_DATOS_V2.sql', mode='w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

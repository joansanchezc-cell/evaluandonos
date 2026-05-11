import csv
import unicodedata

def normalize(text):
    if not text: return ""
    return "".join(c for c in unicodedata.normalize('NFD', text.upper()) if unicodedata.category(c) != 'Mn').strip()

# Cargar base de datos oficial
master = {}
with open('estudiantes/base datos estudiantes.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        name = normalize(row['Estudiante'])
        master[name] = row['Identificación']

# Cargar códigos ZipGrade y combinar
combined = []
with open('estudiantes/codigos zipgrade estudiantes.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        zg_name = normalize(row['Last Name'] + " " + row['First Name'])
        zg_name_alt = normalize(row['First Name'] + " " + row['Last Name'])
        
        identificacion = master.get(zg_name) or master.get(zg_name_alt)
        
        if identificacion:
            combined.append({
                'identificacion': identificacion,
                'zipgrade_id': row['ZipGrade ID'],
                'nombre': zg_name,
                'grado': row['Classes']
            })

# Guardar con nombres de columna exactos para Supabase
with open('estudiantes/maestro_actualizado_v2.csv', mode='w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['identificacion', 'zipgrade_id', 'nombre', 'grado'], delimiter=';')
    writer.writeheader()
    writer.writerows(combined)

print(f"Combinación v2 completada. Archivo 'maestro_actualizado_v2.csv' generado.")

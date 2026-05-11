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
        # ZipGrade separa nombre y apellido
        zg_name = normalize(row['Last Name'] + " " + row['First Name'])
        zg_name_alt = normalize(row['First Name'] + " " + row['Last Name'])
        
        identificacion = master.get(zg_name) or master.get(zg_name_alt)
        
        if identificacion:
            combined.append({
                'Identificación': identificacion,
                'ZipGrade_ID': row['ZipGrade ID'],
                'Nombre_Oficial': zg_name,
                'Grado': row['Classes']
            })

# Guardar resultado (usando punto y coma para compatibilidad)
with open('estudiantes/maestro_actualizado.csv', mode='w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['Identificación', 'ZipGrade_ID', 'Nombre_Oficial', 'Grado'], delimiter=';')
    writer.writeheader()
    writer.writerows(combined)

print(f"Combinación completada. Se encontraron {len(combined)} coincidencias.")

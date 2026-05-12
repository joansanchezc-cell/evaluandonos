import csv

# Generar Script SQL de actualización
with open('estudiantes/maestro_actualizado_v2.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter=';')
    sql_lines = [
        "-- Script de actualización masiva de ZipGrade IDs",
        "BEGIN;"
    ]
    
    for row in reader:
        ident = row['identificacion']
        zipid = row['zipgrade_id']
        # Usamos comillas simples para manejar IDs que puedan tener letras (como los que empiezan con N)
        sql_lines.append(f"UPDATE maestro_estudiantes SET zipgrade_id = '{zipid}' WHERE identificacion = '{ident}';")
    
    sql_lines.append("COMMIT;")

with open('estudiantes/actualizar_maestro.sql', mode='w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print("Script SQL 'estudiantes/actualizar_maestro.sql' generado con éxito.")

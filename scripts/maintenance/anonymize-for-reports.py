#!/usr/bin/env python3
"""
anonymize-for-reports.py
Anonimiza datos sensibles para reportes

Entrada:
  - CSV con datos de estudiantes/docentes

Salida:
  - CSV anonimizado sin IDs reales

Uso:
  python scripts/maintenance/anonymize-for-reports.py input.csv output.csv

Status: ✅ ACTIVO
Última ejecución: 2026-04-30
"""

import csv
import unicodedata
import sys
import hashlib
from pathlib import Path

def normalize_name(name):
    """Normalize name for comparison"""
    if not name:
        return ""
    
    # Convert to string, upper and strip
    n = str(name).upper().strip()
    
    # Normalize unicode to decompose accents
    n = "".join(c for c in unicodedata.normalize('NFD', n) 
                if unicodedata.category(c) != 'Mn')
    
    # Standardize common characters
    n = n.replace('Ñ', 'N')
    
    # Keep only alphanumeric and spaces
    n = "".join(c for c in n if c.isalnum() or c.isspace())
    
    return " ".join(n.split())

def anonymize_id(id_str):
    """Generate consistent anonymous ID from real ID"""
    hash_obj = hashlib.sha256(str(id_str).encode())
    hex_dig = hash_obj.hexdigest()
    return f"ANON_{hex_dig[:8].upper()}"

def anonymize_csv(input_path, output_path):
    """Anonymize CSV file"""
    try:
        rows = []
        id_mapping = {}
        
        # Read input
        with open(input_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            
            for row in reader:
                # Anonymize identification
                if 'identificacion' in row:
                    real_id = row['identificacion']
                    anon_id = anonymize_id(real_id)
                    id_mapping[real_id] = anon_id
                    row['identificacion'] = anon_id
                
                # Anonymize nombre (keep first letter + count)
                if 'nombre' in row:
                    norm_name = normalize_name(row['nombre'])
                    if norm_name:
                        first_letter = norm_name[0]
                        row['nombre'] = f"{first_letter}***{len(norm_name)}"
                    else:
                        row['nombre'] = "****"
                
                # Anonymize email
                if 'email' in row:
                    email = row['email']
                    if '@' in email:
                        user, domain = email.split('@')
                        row['email'] = f"user_{anonymize_id(user)[:6]}@{domain}"
                
                rows.append(row)
        
        # Write output
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        
        print(f"✅ Anonymized {len(rows)} records")
        print(f"📝 Output: {output_path}")
        print(f"📊 IDs mapped: {len(id_mapping)}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python anonymize-for-reports.py input.csv output.csv")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if anonymize_csv(input_file, output_file):
        sys.exit(0)
    else:
        sys.exit(1)

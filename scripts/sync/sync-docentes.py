#!/usr/bin/env python3
"""
sync-docentes.py
Sincroniza docentes desde CSV hacia formato importable

Entrada:
  - usuarios-evaluandonos_total.csv
  - NUEVA ASIGNACIÓN 2026.csv

Salida:
  - docentes_import_final_v3.csv (para UPSERT a Supabase)

Uso:
  python scripts/sync/sync-docentes.py

Status: ✅ ACTIVO
Última ejecución: 2026-05-08
"""

import csv
import os
import sys
from pathlib import Path

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
DATA_DIR = PROJECT_ROOT / "assets" / "data"

USERS_FILE = DATA_DIR / "usuarios-evaluandonos_total.csv"
ASSIGNMENTS_FILE = DATA_DIR / "docentes_assignments_2026.csv"
OUTPUT_FILE = DATA_DIR / "docentes_import_final.csv"

# Director mapping (reference - update as needed)
DIRECTORES = {
    "601": "Ricardo Neftali Velez Suarez",
    "602": "Piedad Cecilia Granados Velasco",
    "603": "Gaby Cecilia Teran Dominguez",
    "701": "Henry Hernan Cruz Ceron",
    "702": "Adriana Ruiz Rivera",
    "703": "Sonia Adiela Mena Gonzalez",
    "801": "Telly Alejandro Castillo Diaz",
    "802": "Luis Eduardo Yunda Cifuentes",
    "901": "Guido Alberto Imbachi Fernandez",
    "902": "Clara Ines Urrea Montenegro",
    "903": "Diana Patricia Trochez Lopez",
    "1001": "James Yamiht Diaz Leyton",
    "1002": "Carlos Enrique Orozco Agredo",
    "1003": "Mayra Cilena Lopez",
    "1101": "Edwin Julian Muñoz Cabezas",
    "1102": "Jhony Ferney Ibarra Vasquez",
    "1103": "Edgar Velasco Quintero",
}

def load_users(filepath):
    """Load users from CSV"""
    users = {}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                email = row.get('email', '').strip()
                users[email] = {
                    'nombre': row.get('nombre', ''),
                    'email': email,
                    'rol': row.get('rol', 'docente')
                }
        print(f"✅ Loaded {len(users)} users from {filepath}")
        return users
    except Exception as e:
        print(f"❌ Error loading users: {e}")
        return {}

def load_assignments(filepath):
    """Load grade assignments from CSV"""
    assignments = {}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                email = row.get('email', '').strip()
                assignments[email] = {
                    'grado': row.get('grado', ''),
                    'sede': row.get('sede', 'Central'),
                    'asignatura': row.get('asignatura', '')
                }
        print(f"✅ Loaded {len(assignments)} assignments from {filepath}")
        return assignments
    except Exception as e:
        print(f"❌ Error loading assignments: {e}")
        return {}

def merge_and_export(users, assignments, output_path):
    """Merge users with assignments and export"""
    merged = []
    
    for email, user in users.items():
        assignment = assignments.get(email, {})
        merged.append({
            'email': user['email'],
            'nombre': user['nombre'],
            'rol': user['rol'],
            'grado': assignment.get('grado', ''),
            'sede': assignment.get('sede', 'Central'),
            'asignatura': assignment.get('asignatura', '')
        })
    
    try:
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            fieldnames = ['email', 'nombre', 'rol', 'grado', 'sede', 'asignatura']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(merged)
        print(f"✅ Exported {len(merged)} docentes to {output_path}")
        return True
    except Exception as e:
        print(f"❌ Error exporting: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Sincronizando docentes...")
    
    users = load_users(USERS_FILE)
    assignments = load_assignments(ASSIGNMENTS_FILE)
    
    if merge_and_export(users, assignments, OUTPUT_FILE):
        print("\n✅ Sincronización completada")
        print(f"📝 Archivo generado: {OUTPUT_FILE}")
        print("\nPróximo paso: Importar CSV a Supabase tabla 'docentes'")
        sys.exit(0)
    else:
        print("\n❌ Sincronización falló")
        sys.exit(1)

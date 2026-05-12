-- Migration 001: Sincronización de ZipGrade IDs
-- Descripción: Actualiza masivamente zipgrade_id en maestro_estudiantes
-- Executado: 2026-05-10
-- Ambiente: Producción
-- Status: Completado

BEGIN;

UPDATE maestro_estudiantes SET zipgrade_id = '90102' WHERE identificacion = '1061765779';
UPDATE maestro_estudiantes SET zipgrade_id = '30102' WHERE identificacion = '1058553488';
UPDATE maestro_estudiantes SET zipgrade_id = '30514' WHERE identificacion = '1061088873';
UPDATE maestro_estudiantes SET zipgrade_id = '50123' WHERE identificacion = '1023016241';
UPDATE maestro_estudiantes SET zipgrade_id = '10125' WHERE identificacion = '1058935450';
UPDATE maestro_estudiantes SET zipgrade_id = '50508' WHERE identificacion = '1166466931';
UPDATE maestro_estudiantes SET zipgrade_id = '70107' WHERE identificacion = '1061020301';
UPDATE maestro_estudiantes SET zipgrade_id = '11103' WHERE identificacion = '1013127110';
UPDATE maestro_estudiantes SET zipgrade_id = '60322' WHERE identificacion = '1191219266';
UPDATE maestro_estudiantes SET zipgrade_id = '10118' WHERE identificacion = '1061744981';
UPDATE maestro_estudiantes SET zipgrade_id = '50106' WHERE identificacion = '1166465964';
UPDATE maestro_estudiantes SET zipgrade_id = '30104' WHERE identificacion = '1115549865';
UPDATE maestro_estudiantes SET zipgrade_id = '90124' WHERE identificacion = '1095553210';
UPDATE maestro_estudiantes SET zipgrade_id = '11316' WHERE identificacion = '1029602192';
UPDATE maestro_estudiantes SET zipgrade_id = '90204' WHERE identificacion = '1061760510';
UPDATE maestro_estudiantes SET zipgrade_id = '40516' WHERE identificacion = '1029604900';
UPDATE maestro_estudiantes SET zipgrade_id = '11109' WHERE identificacion = '1058550167';
UPDATE maestro_estudiantes SET zipgrade_id = '50504' WHERE identificacion = '1043185374';
UPDATE maestro_estudiantes SET zipgrade_id = '80129' WHERE identificacion = '1061782647';
UPDATE maestro_estudiantes SET zipgrade_id = '40127' WHERE identificacion = '1080065733';
UPDATE maestro_estudiantes SET zipgrade_id = '11221' WHERE identificacion = '1059242382';
UPDATE maestro_estudiantes SET zipgrade_id = '60318' WHERE identificacion = '1061792394';
UPDATE maestro_estudiantes SET zipgrade_id = '10304' WHERE identificacion = '1058550781';
UPDATE maestro_estudiantes SET zipgrade_id = '70118' WHERE identificacion = '1144827667';
UPDATE maestro_estudiantes SET zipgrade_id = '90106' WHERE identificacion = '1166463744';
UPDATE maestro_estudiantes SET zipgrade_id = '60113' WHERE identificacion = '1067946785';
UPDATE maestro_estudiantes SET zipgrade_id = '50133' WHERE identificacion = '1061796670';
UPDATE maestro_estudiantes SET zipgrade_id = '50403' WHERE identificacion = '1061795363';

COMMIT;

-- Para revertir, hacer DELETE y rellenar con valores anteriores
-- ROLLBACK;

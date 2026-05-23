import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """          // 1. Obtener la pregunta del banco
          const { data: pregDataArr } = await supabaseClient.from('eval_preguntas')
            .select('*')
            .eq('grado', gBase)
            .eq('periodo', currentPeriodo)
            .or(`asignatura.eq."${queryAsig}",asignatura.eq."${asigLabel}"`)
            .eq('pregunta_num', qNum)
            .limit(1);

          const qData = (pregDataArr && pregDataArr.length > 0) ? pregDataArr[0] : null;"""

replacement = """          // 1. Obtener la pregunta del banco
          let { data: pregDataArr } = await supabaseClient.from('eval_preguntas')
            .select('*')
            .eq('grado', gBase)
            .eq('periodo', currentPeriodo)
            .or(`asignatura.ilike."${queryAsig}",asignatura.ilike."${asigLabel}"`)
            .eq('pregunta_num', qNum)
            .limit(1);

          if (!pregDataArr || pregDataArr.length === 0) {
            const res = await supabaseClient.from('eval_preguntas')
              .select('*')
              .eq('grado', gBase)
              .eq('periodo', currentPeriodo)
              .eq('pregunta_num', qNum)
              .limit(1);
            if (res.data) pregDataArr = res.data;
          }

          const qData = (pregDataArr && pregDataArr.length > 0) ? pregDataArr[0] : null;"""

# Normalize line endings just in case
target_normalized = target.replace('\r\n', '\n')
content_normalized = content.replace('\r\n', '\n')

if target_normalized in content_normalized:
    new_content = content_normalized.replace(target_normalized, replacement.replace('\r\n', '\n'))
    with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print("Success: Replaced target content.")
else:
    print("Error: Target content not found in index.html.")

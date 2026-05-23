import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# find css media queries
media_queries = re.findall(r'@media\s*\([^)]+\)\s*\{[^}]+\}', content)
with open('scratch/media.css', 'w', encoding='utf-8') as f:
    for mq in media_queries:
        f.write(mq + '\n')

# print lines that have layout structure
lines = content.split('\n')
for i, line in enumerate(lines):
    if '<header' in line or '<aside' in line or 'class="app-body"' in line or 'id="user-info"' in line:
        print(f"{i+1}: {line.strip()}")

import re

css_path = r'C:\Users\shaja\OneDrive\Desktop\Santhigiri\S6\Main Project\Project\Festivo\Festivo_Frontend\src\app\Institution\editcompetition\editcompetition.scss'
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the submission modal logic
content = re.sub(
    r'\.modal-overlay \{.*$',
    r'',
    content,
    flags=re.DOTALL
)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("CSS Updated")

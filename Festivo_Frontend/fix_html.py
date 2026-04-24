import re

html_path = r'C:\Users\shaja\OneDrive\Desktop\Santhigiri\S6\Main Project\Project\Festivo\Festivo_Frontend\src\app\Institution\editcompetition\editcompetition.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the submission modal logic
content = re.sub(
    r'\s*<!-- Modal Component.*?</div>\s*</div>\n',
    r'\n',
    content,
    flags=re.DOTALL
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("HTML Updated")

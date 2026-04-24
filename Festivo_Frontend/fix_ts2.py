import re

ts_path = r'C:\Users\shaja\OneDrive\Desktop\Santhigiri\S6\Main Project\Project\Festivo\Festivo_Frontend\src\app\Institution\editcompetition\editcompetition.ts'
with open(ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove specific patterns manually
content = re.sub(
    r'this\.showModal\s*=\s*true;\s*this\.modalData\s*=\s*\{\s*title:\s*\'Success\',\s*message:\s*\'Competition updated successfully!\',\s*type:\s*\'success\'\s*};\s*setTimeout\(\(\)\s*=>\s*\{\s*this\.router\.navigate\(\[/Institution/festdetails/\$\{this\.festId\}\]\);\s*\}, 2000\);',
    r'alert("Competition updated successfully!");\n            this.router.navigate([/Institution/festdetails/]);',
    content
)

content = re.sub(
    r'this\.showModal\s*=\s*true;\s*this\.modalData\s*=\s*\{\s*title:\s*\'Error\',\s*message:\s*this\.errorMessage,\s*type:\s*\'error\'\s*};',
    r'alert(this.errorMessage);',
    content
)

content = re.sub(
    r'this\.showModal\s*=\s*true;\s*this\.modalData\s*=\s*\{\s*title:\s*\'Error\',\s*message:\s*this\.errorMessage,\s*type:\s*\'error\'\s*};',
    r'alert(this.errorMessage);',
    content
)

with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(content)

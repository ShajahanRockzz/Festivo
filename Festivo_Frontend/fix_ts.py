import re

ts_path = r'C:\Users\shaja\OneDrive\Desktop\Santhigiri\S6\Main Project\Project\Festivo\Festivo_Frontend\src\app\Institution\editcompetition\editcompetition.ts'
with open(ts_path, 'r') as f:
    content = f.read()

# Replace the submission modal logic
content = re.sub(
    r'this\.showModal = true;\s*this\.modalData = \{\s*title: \'Success\',\s*message: \'Competition updated successfully!\',\s*type: \'success\'\s*};\s*setTimeout\(\(\) => \{\s*this\.router\.navigate\(\[/Institution/festdetails/\$\{this\.festId\}]\);\s*\}, 2000\);',
    r'alert("Competition updated successfully!");\n            this.router.navigate([/Institution/festdetails/]);',
    content
)

content = re.sub(
    r'this\.showModal = true;\s*this\.modalData = \{\s*title: \'Error\',\s*message: this\.errorMessage,\s*type: \'error\'\s*};',
    r'alert(this.errorMessage);',
    content
)

content = re.sub(
    r'showModal\s*=\s*false;\n\s*modalData\s*=\s*\{[^}]*\};\n',
    r'',
    content
)

content = re.sub(
    r'closeModal\(\)(?: *: *void)? *\{[\s\S]*?\}\n',
    r'',
    content
)

with open(ts_path, 'w') as f:
    f.write(content)
print("TS Updated")

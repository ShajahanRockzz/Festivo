import re

html_path = r'C:\Users\shaja\OneDrive\Desktop\Santhigiri\S6\Main Project\Project\Festivo\Festivo_Frontend\src\app\Institution\festdetails\festdetails.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove inline styles from the view-all-container and button
content = content.replace('style="text-align: center; margin-top: 20px;"', 'class="view-all-wrapper"')
content = content.replace('style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"', '')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

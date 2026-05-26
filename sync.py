import re

with open('home.html', 'r') as f:
    home = f.read()

def get_dict(name):
    m = re.search(r'const ' + name + r'\s*=\s*({.*?});\s*(?:function|/\*|const)', home, re.DOTALL)
    if m: return m.group(1)
    return "{}"

serviceData = get_dict('serviceData')
hallData = get_dict('hallData')
typeData = get_dict('typeData')
productImages = get_dict('productImages')

db_code = f"const productDatabase = Object.assign({{}}, {serviceData}, {hallData}, {typeData});\nconst productImages = {productImages};\n"

keys = []
for d in [serviceData, hallData, typeData]:
    keys.extend(re.findall(r'"([^"]+)"\s*:', d))

aliases_code = "const aliases = {};\n"
for key in keys:
    lk = key.lower()
    aliases_code += f'aliases["{lk}"] = "{key}";\n'
    for part in re.split(r'[/\\s-]+', lk):
        if len(part) > 3:
            aliases_code += f'aliases["{part}"] = "{key}";\n'

with open('search.html', 'r') as f:
    search = f.read()

start_idx = search.find('/* PRODUCT DATABASE */')
if start_idx == -1:
    start_idx = search.find('const productDatabase = {')

end_idx = search.find('let html = "";')

before = search[:start_idx]
after = search[end_idx:]

# update aliases
alias_start = before.find('const aliases = {')
alias_end = before.find('query = aliases[query] || query;')
before = before[:alias_start] + aliases_code + '\n' + before[alias_end:]

# update loop
after = after.replace('onclick="openProduct(\'${query}\',${i})"', 'onclick="openProduct(\'${query}\',${i}, \'${products[i-1]}\')"')
after = after.replace('<img src="images/${query}/${i}.jpg">', '<img src="${productImages[products[i-1]] || \'images/\' + query + \'/\' + i + \'.jpg\'}">')
after = after.replace('<p>Shop Name: ${shopData[query] && shopData[query][i-1] ? shopData[query][i-1].shop : "Royal Rentals"}</p>', '<p>Shop Name: ${(window.shopData && shopData[query] && shopData[query][i-1]) ? shopData[query][i-1].shop : "Royal Rentals"}</p>')
after = after.replace('<p>Location: ${shopData[query] && shopData[query][i-1] ? shopData[query][i-1].location : "Bangalore"}</p>', '<p>Location: ${(window.shopData && shopData[query] && shopData[query][i-1]) ? shopData[query][i-1].location : "Bangalore"}</p>')

# update openProduct
after = after.replace('function openProduct(name,id){', 'function openProduct(name, id, productName){\n  let imgUrl = productImages[productName] || "";')
after = re.sub(r'window\.location\.href =[^;]+;', 'window.location.href = "product1.html?item=" + name + "&id=" + id + "&product=" + encodeURIComponent(productName) + "&img=" + encodeURIComponent(imgUrl);', after)

with open('search.html', 'w') as f:
    f.write(before + '/* PRODUCT DATABASE */\n' + db_code + '\n' + after)

print("Merged successfully!")

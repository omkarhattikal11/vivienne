const fs = require('fs');

const homeHtml = fs.readFileSync('home.html', 'utf8');
let searchHtml = fs.readFileSync('search.html', 'utf8');

// Extract dictionaries from home.html
function extractDict(name, text) {
  const regex = new RegExp(`const ${name}\\s*=\\s*({[\\s\\S]*?});\\s*function`, 'm');
  const match = text.match(regex);
  if (match) return match[1];
  
  const regex2 = new RegExp(`const ${name}\\s*=\\s*({[\\s\\S]*?});\\s*(?:/\\*|const)`, 'm');
  const match2 = text.match(regex2);
  if (match2) return match2[1];
  
  return null;
}

const serviceData = extractDict('serviceData', homeHtml);
const hallData = extractDict('hallData', homeHtml);
const typeData = extractDict('typeData', homeHtml);
const productImages = extractDict('productImages', homeHtml);

let dbCode = `const productDatabase = Object.assign({}, ${serviceData}, ${hallData}, ${typeData});\n`;
dbCode += `const productImages = ${productImages};\n`;

// Generate aliases based on keys
let aliases = `const aliases = {};\n`;
let keys = [];

function parseKeys(dictStr) {
  if (!dictStr) return [];
  const regex = /"([^"]+)"\s*:/g;
  let matches = [];
  let match;
  while ((match = regex.exec(dictStr)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

keys = keys.concat(parseKeys(serviceData));
keys = keys.concat(parseKeys(hallData));
keys = keys.concat(parseKeys(typeData));

// Map standard search terms
for (let key of keys) {
  let lowerKey = key.toLowerCase();
  aliases += `aliases["${lowerKey}"] = "${key}";\n`;
  
  let parts = lowerKey.split(/[/\\s-]/);
  for (let part of parts) {
    if (part.length > 3) {
      aliases += `aliases["${part}"] = "${key}";\n`;
    }
  }
}

// Update search.html
let newScriptStart = searchHtml.indexOf('/* PRODUCT DATABASE */');
if(newScriptStart === -1) {
    newScriptStart = searchHtml.indexOf('const productDatabase = {');
}
let newScriptEnd = searchHtml.indexOf('let html = "";');
if (newScriptStart !== -1 && newScriptEnd !== -1) {
    let before = searchHtml.substring(0, newScriptStart);
    let after = searchHtml.substring(newScriptEnd);
    
    after = after.replace('onclick="openProduct(\\'${query}\\',${i})"', 'onclick="openProduct(\\'${query}\\',${i}, \\'${products[i-1]}\\')"');
    after = after.replace('<img src="images/${query}/${i}.jpg">', '<img src="${productImages[products[i-1]] || \\'images/\\' + query + \\'/\\' + i + \\'.jpg\\'}">');
    after = after.replace('<p>Shop Name: ${shopData[query] && shopData[query][i-1] ? shopData[query][i-1].shop : "Royal Rentals"}</p>', '<p>Shop Name: ${(window.shopData && shopData[query] && shopData[query][i-1]) ? shopData[query][i-1].shop : "Royal Rentals"}</p>');
    after = after.replace('<p>Location: ${shopData[query] && shopData[query][i-1] ? shopData[query][i-1].location : "Bangalore"}</p>', '<p>Location: ${(window.shopData && shopData[query] && shopData[query][i-1]) ? shopData[query][i-1].location : "Bangalore"}</p>');
    
    // Update openProduct definition
    after = after.replace(/function openProduct\(name,id\)\{/, `function openProduct(name, id, productName){\n  let imgUrl = productImages[productName] || "";`);
    after = after.replace(/window\.location\.href =[^;]+;/, `window.location.href = "product1.html?item=" + name + "&id=" + id + "&product=" + encodeURIComponent(productName) + "&img=" + encodeURIComponent(imgUrl);`);
    
    // Replace aliases block
    let aliasStart = before.indexOf('const aliases = {');
    let aliasEnd = before.indexOf('query = aliases[query] || query;');
    if (aliasStart !== -1 && aliasEnd !== -1) {
        before = before.substring(0, aliasStart) + aliases + '\n' + before.substring(aliasEnd);
    }
    
    fs.writeFileSync('search.html', before + '/* PRODUCT DATABASE */\n' + dbCode + '\n' + after);
    console.log("Successfully synchronized search.html");
} else {
    console.log("Could not find insertion points");
}

const fs = require('fs');

const origPath = '/Users/omkarhattikal/.gemini/antigravity/scratch/vivienne/hallbooking.html';
const newPath = '/Users/omkarhattikal/.gemini/antigravity/scratch/vivienne/hallbooking.txt';

let orig = fs.readFileSync(origPath, 'utf-8');
let newFile = fs.readFileSync(newPath, 'utf-8');

const startTag = '<script>';
const endTag = '</script>';

const newScriptStart = newFile.indexOf(startTag);
const newScriptEnd = newFile.indexOf(endTag) + endTag.length;

if (newScriptStart === -1 || newScriptEnd === -1) {
    console.error("Could not find script tags in new file.");
    process.exit(1);
}

const newScript = newFile.substring(newScriptStart, newScriptEnd);

const origScriptStart = orig.indexOf(startTag);
const origScriptEnd = orig.indexOf(endTag) + endTag.length;

if (origScriptStart === -1 || origScriptEnd === -1) {
    console.error("Could not find script tags in original file.");
    process.exit(1);
}

const updated = orig.substring(0, origScriptStart) + newScript + orig.substring(origScriptEnd);

fs.writeFileSync(origPath, updated);
console.log("Successfully merged the script block from images.txt into product.html!");

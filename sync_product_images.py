import re

with open('home.html', 'r') as f:
    home = f.read()

m = re.search(r'const productImages\s*=\s*({.*?});\s*(?:function|/\*|const)', home, re.DOTALL)
if m:
    productImages = m.group(1)
else:
    productImages = "{}"

with open('product.html', 'r') as f:
    product = f.read()

fallback_logic_old = """// Fallback if images array is still empty or doesn't have enough images
if (bestImages.length < 2) {
    bestImages = ["ethnic-sarees.png", "ethnic-sarees.png"];
}
if (moreImages.length < 4) {
    moreImages = ["ethnic-sarees.png", "ethnic-sarees.png", "ethnic-sarees.png", "ethnic-sarees.png"];
}"""

fallback_logic_new = f"""
const productImages = {productImages};

// Fallback if images array is still empty or doesn't have enough images
if (bestImages.length < 2) {{
    let fallbackImg = productImages[product] || "ethnic-sarees.png";
    bestImages = [fallbackImg, fallbackImg];
}}
if (moreImages.length < 4) {{
    let fallbackImg = productImages[product] || "ethnic-sarees.png";
    moreImages = [fallbackImg, fallbackImg, fallbackImg, fallbackImg];
}}
"""

new_product = product.replace(fallback_logic_old, fallback_logic_new)
with open('product.html', 'w') as f:
    f.write(new_product)

print("Injected productImages into product.html")

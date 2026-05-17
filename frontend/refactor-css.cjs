const fs = require('fs');
const path = require('path');

const dir = '/Users/kanishkadubey/NotePilot_AI_Workspace/frontend/src/styles';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.css'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace white colors with text variables
  content = content.replace(/color:\s*white;?/g, 'color: var(--text-main);');
  content = content.replace(/color:\s*#fff;?/gi, 'color: var(--text-main);');
  content = content.replace(/color:\s*#ffffff;?/gi, 'color: var(--text-main);');
  
  // Replace hardcoded transparent white backgrounds with generic variables
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[123]\);?/g, 'background: var(--bg-input);');
  content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.0[456]\);?/g, 'background: var(--border-main);');
  
  // Replace borders
  content = content.replace(/border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\);?/g, 'border: 1px solid var(--border-main);');
  content = content.replace(/border-top:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\);?/g, 'border-top: 1px solid var(--border-main);');
  content = content.replace(/border-bottom:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\);?/g, 'border-bottom: 1px solid var(--border-main);');

  fs.writeFileSync(filePath, content);
}

console.log('Styles updated.');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function updateColorsinDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      updateColorsinDirectory(fullPath);
    } else if (['.jsx', '.css', '.js'].includes(path.extname(file.name))) {
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const original = content;
        
        // Reemplazos principales
        content = content.replace(/brand-red/g, 'brand-accent');
        content = content.replace(/brand-gold/g, 'brand-secondary');
        content = content.replace(/brand-charcoal/g, 'brand-dark');
        
        // Reemplazar gradientes oscuros
        content = content.replace(/bg-gradient-to-br from-brand-dark via-brand-dark to-black/g, 'bg-white');
        content = content.replace(/from-black/g, 'from-gray-50');
        content = content.replace(/to-black/g, 'to-gray-100');
        
        // Guardar si cambió
        if (content !== original) {
          fs.writeFileSync(fullPath, content, 'utf-8');
          console.log(`✓ ${fullPath.replace(__dirname, '')}`);
        }
      } catch (err) {
        console.error(`Error in ${fullPath}:`, err.message);
      }
    }
  });
}

updateColorsinDirectory(path.join(__dirname, 'src'));
console.log('\n✓ ACTUALIZACIÓN COMPLETADA');

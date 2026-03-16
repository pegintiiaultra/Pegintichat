const fs = require('fs');
const path = require('path');

const AutoFixer = {
  // 🔄 CORRECTION + BACKUP AUTOMATIQUE
  fixAndBackup: (filePath, maxBackups = 5) => {
    const dir = path.dirname(filePath);
    const name = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath);
    
    // 📦 SAUVEGARDE intelligente
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${dir}/${name}-backup-${timestamp}${ext}`;
    fs.copyFileSync(filePath, backupPath);
    
    // 🔍 ANALYSE & CORRECTION
    let code = fs.readFileSync(filePath, 'utf8');
    const originalLength = code.length;
    
    // RÈGLES Bo'oivini
    const fixes = [
      { find: /const metrics = require\(".\/src\/metrics\/boivini-metrics"\);?/gi, replace: '// ✅ Bo\'oivini: module supprimé (inexistant)' },
      { find: /cat > ~\/PEGINTICHAT/gi, replace: '// ✅ Bo\'oivini: script shell supprimé' },
      { find: /contre-nature/gi, replace: '// ✅ Bo\'oivini: contenu doctrinal rejeté' },
      { find: /app\.listen\(3000/gi, replace: 'app.listen(3001' },
      { find: /EADDRINUSE/gi, replace: '// ✅ Bo\'oivini: port conflit résolu' }
    ];
    
    let fixedCount = 0;
    fixes.forEach(fix => {
      if (fix.find.test(code)) {
        code = code.replace(fix.find, fix.replace);
        fixedCount++;
      }
    });
    
    // 💾 SAUVEGARDE si corrections
    if (fixedCount > 0 || code.length !== originalLength) {
      fs.writeFileSync(filePath, code);
      
      // 🧹 Nettoyage backups anciens
      const backups = fs.readdirSync(dir)
        .filter(f => f.startsWith(`${name}-backup-`) && f.endsWith(ext))
        .sort((a, b) => fs.statSync(`${dir}/${b}`).mtime - fs.statSync(`${dir}/${a}`).mtime);
      
      if (backups.length > maxBackups) {
        backups.slice(maxBackups).forEach(old => {
          fs.unlinkSync(`${dir}/${old}`);
        });
      }
      
      return {
        success: true,
        fixes: fixedCount,
        backup: backupPath,
        sizeDiff: originalLength - code.length
      };
    }
    
    return { success: false, message: 'Aucune correction nécessaire' };
  },
  
  // ⚡ SCAN & CORRECTION MASSIVE
  fixAll: (dirs = ['~/NoyauUltra', '~/PEGINTICHAT']) => {
    const results = [];
    dirs.forEach(dir => {
      const fullDir = dir.replace('~', process.env.HOME);
      if (fs.existsSync(fullDir)) {
        fs.readdirSync(fullDir)
          .filter(f => f.endsWith('.js'))
          .forEach(file => {
            const result = AutoFixer.fixAndBackup(`${fullDir}/${file}`);
            results.push({ file, ...result });
          });
      }
    });
    return results;
  }
};

module.exports = { AutoFixer };

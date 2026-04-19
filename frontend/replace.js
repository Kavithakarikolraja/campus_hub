const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.includes('antigravityignore')) continue;
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch(e) { continue; }
        
        if (stat.isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            
            // For template literals like `http://localhost:5000${...}`
            updated = updated.replace(/`http:\/\/localhost:5000\$\{/g, '`${axios.defaults.baseURL || import.meta.env.VITE_API_URL || ""}${');
            
            // For string literals like 'http://localhost:5000/api/...' -> '/api/...'
            updated = updated.replace(/'http:\/\/localhost:5000\//g, "'/");
            
            // For io sockets
            updated = updated.replace(/"http:\/\/localhost:5000"/g, 'import.meta.env.VITE_API_URL || "http://localhost:5000"');

            // fallback not needed since we handled specifics

            if (content !== updated) {
                fs.writeFileSync(fullPath, updated);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInFiles(path.join(__dirname, 'src'));

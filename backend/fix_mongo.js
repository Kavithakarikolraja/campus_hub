const dns = require('dns');
const fs = require('fs');
const path = require('path');

const user = 'monikathangamani2006_db_user';
const pass = 'monikamongodb14';
const cluster = 'cluster0.cz0ubv8.mongodb.net';
const dbName = 'campus-hub';

dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS to bypass ISP issues

dns.resolveSrv(`_mongodb._tcp.${cluster}`, (err, addresses) => {
    if (err) {
        console.error('Failed to resolve SRV:', err);
        process.exit(1);
    }

    // Sort and format the addresses: ac-xxxxx-shard-00-00.cz0ubv8.mongodb.net:27017, ...
    const hosts = addresses.map(a => `${a.name}:${a.port}`).sort().join(',');

    dns.resolveTxt(cluster, (err, records) => {
        let txtArgs = '';
        if (!err && records && records.length > 0) {
            txtArgs = records[0].join(''); // e.g., authSource=admin&replicaSet=atlas-xxx-shard-0
        }

        const standardUri = `mongodb://${user}:${pass}@${hosts}/${dbName}?ssl=true&${txtArgs}&retryWrites=true&w=majority`;

        console.log('Resolved Standard URI:', standardUri);

        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Replace the MONGO_URI
        envContent = envContent.replace(/^MONGO_URI=.*$/m, `MONGO_URI=${standardUri}`);

        fs.writeFileSync(envPath, envContent);
        console.log('.env file updated successfully!');
    });
});

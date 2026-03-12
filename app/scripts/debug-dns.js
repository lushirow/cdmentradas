
const dns = require('dns');

const hostname = 'db.jmoktmygdhlczdxrxufz.supabase.co';

console.log(`Looking up ${hostname}...`);

dns.lookup(hostname, { all: true }, (err, addresses) => {
    if (err) {
        console.error('DNS Lookup failed:', err);
    } else {
        console.log('DNS Lookup successful:', addresses);
    }
});

dns.resolve6(hostname, (err, addresses) => {
    if (err) {
        console.error('DNS Resolve6 failed:', err);
    } else {
        console.log('DNS Resolve6 successful:', addresses);
    }
});

dns.resolve4(hostname, (err, addresses) => {
    if (err) {
        console.error('DNS Resolve4 failed:', err);
    } else {
        console.log('DNS Resolve4 successful:', addresses);
    }
});

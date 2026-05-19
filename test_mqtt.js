const fetch = require('node-fetch');

async function test() {
    const res = await fetch('http://localhost:8080/api/env/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'mqtt',
            host: 'non.existent.host',
            port: 1883,
            clientId: 'test1',
            protocol: 'mqtt'
        })
    });
    console.log(await res.json());
}
test();

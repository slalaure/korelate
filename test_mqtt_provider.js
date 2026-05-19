const MqttProvider = require('./connectors/mqtt/index.js');
const mockContext = {
    logger: {
        child: () => console,
        info: console.log,
        error: console.error,
        warn: console.warn,
        debug: console.log
    },
    config: {},
    handleMessage: () => {},
    activeConnections: new Map(),
    isShuttingDown: () => false,
    CERTS_PATH: './data/certs'
};
const provider = new MqttProvider({
    id: 'test',
    type: 'mqtt',
    host: 'broker.hivemq.com',
    port: 1883,
    clientId: 'test_korelate_' + Date.now(),
    protocol: 'mqtt'
}, mockContext);

provider.connect().then(res => {
    console.log("Connect result:", res);
    provider.disconnect();
}).catch(e => {
    console.error("Error:", e);
});

const WT = require('worker_threads');

// Worker Pool
// let counter = 0;
// WT.parentPort.on('message', (data) => {
//     const { port } = data;
//     console.log('WT Parent Port: ', port.parentPort);
//     setTimeout(() => {
//         port.postMessage({ data: 'worker thread ping ' + counter++ });
//     }, 2000);
// });

if (WT.isMainThread) {
    throw new Error('Its not a worker');
}

const doCalcs = (data) => {
    const collection = [];
    
    for (let i = 0; i < 1000000; i += 1) {
        collection[i] = Math.round(Math.random() * 100000);
    }

    return collection.sort((a, b) => {
        if (a > b) {
            return 1;
        }
        return -1;
    });
};

WT.parentPort.on('message', (data) => {
    const result = doCalcs(data);
    WT.parentPort.postMessage(result);
});
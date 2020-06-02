onmessage = (ev) => {
    let [buffer, buffer2, count] = ev.data;
    buffer.fill(0, 0, count);
    buffer2.fill(0, 0, count);
    postMessage([buffer, buffer2], [buffer.buffer, buffer2.buffer]);
}

import * as Comlink from 'comlink';

class TestWorker {
    clear(buffers, count) {
        for (let buffer of buffers) {
            buffer.fill(0, 0, count);
        }
        return buffers;
    }
}

Comlink.expose(TestWorker);
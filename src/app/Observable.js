export class Observable {
    constructor(value) {
        this._value = value;
        this.listeners = new Set();
    }

    listen(listener) {
        return this.listeners.add(listener);
    }

    unlisten(listener) {
        return this.listeners.delete(listener);
    }

    notify() {
        for (let listener of this.listeners) {
            listener(this);
        }
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.notify();
    }
}
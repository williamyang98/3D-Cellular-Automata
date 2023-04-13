import { atom, selector } from "recoil";

/**
 * To use this correctly use this.state() in a useRecoilState() or useRecoilValue()
 * Then pass the "unique value" as a key={value} inside a react component
 * 
 * let [unique_key, refresh] = useRecoilState(item.state);
 * return (
 *  <div key={unique_key}>
 *    <button onClick={() => refresh()}>Refresh everything!</button>
 *  </div>
 * )
 */
class Recoil_Force_Update {
    constructor(key) {
        this.value = true;
        this.key = key;
        this.atom = atom({ key: `_force_update_${key}`, default: this.value });
        this.selector = selector({ 
            key: key,
            get: ({get}) => get(this.atom),
            set: ({set}, new_value) => {
                // NOTE: We don't care about any value, we just toggle a key to force a rerender
                this.value = !this.value;
                set(this.atom, this.value);
            }
        })
    }

    get state() {
        return this.selector;
    }
}

/**
 * Bindings for recoil state management
 */
class Recoil_State {
    /**
     * @param {App} app 
     */
    constructor(app) {
        this.app = app;
        this.force_update = {}

        // NOTE: We just take in the app to get the default state
        this.is_running = atom({ key: 'is_running', default: this.app.simulation.get_is_running() });
        this.is_fullscreen = atom({ key: 'is_fullscreen', default: false });
        this.is_focused = atom({ key: 'is_focused', default: true });

        this.current_entry = atom({ key: 'current_entry', default: this.app.current_entry });
        this.randomiser_list = this.create_force_update('randomiser_list');
        this.statistics = this.create_force_update('statistics');
        this.user_entries_list = this.create_force_update('user_entries_list');
    }

    create_force_update = (key) => {
        if (key in this.force_update) {
            throw Error(`Force update key conflict: ${key}`);
        }

        let force_update = new Recoil_Force_Update(key);
        this.force_update[key] = force_update;
        return force_update.state;
    }
};

export { Recoil_State };

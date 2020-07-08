export function gui_reducer(init) {
    let default_settings = {
        fullscreen: false, 
        focused: true,
        ...init
    };
    const reducer = (settings=default_settings, action) => {
        switch (action.type) {
            case 'gui.fullscreen':
                return {...settings, fullscreen: action.value};
            case 'gui.focused':
                return {...settings, focused: action.value};
            default:
                break;
        }
        return settings;
    }
    return reducer;
}
export function randomiser_reducer(randomiser_manager) {
    const reducer = (manager=randomiser_manager, action) => {
        switch (action.type) {
            case 'randomiser.select':
                manager.select(action.value);
                break;
            case 'randomiser.update':
                manager.update_current(action.name, action.value);
                break;
            default: 
                break;
        }
        return manager;
    }
    return reducer;
}
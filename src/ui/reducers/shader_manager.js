export function shader_reducer(shader_manager) {
    const reducer = (manager=shader_manager, action) => {
        switch (action.type) {
            case 'shader.select_renderer':
                manager.select_renderer(action.value);
                break;
            case 'shader.update_params':
                manager.update_params(action.value);
                break;
            default: 
                break;
        }

        return manager;
    }

    return reducer;
}
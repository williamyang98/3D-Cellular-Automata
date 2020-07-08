// app controls
export const show_render = is_render => ({
    type: 'app.show_render', value: is_render
})

export const show_border = has_border => ({
    type: 'app.show_border', value: has_border
})

export const set_background_colour = colour => ({
    type: 'app.set_background_colour', value: colour
})

export const set_border_colour = colour => ({
    type: 'app.set_border_colour', value: colour
})

export const set_size = size => ({
    type: 'app.set_size', value: size
})

// sim controls
export const sim = {
    step:       () => ({type: 'step'}),
    randomise:  () => ({type: 'randomise'}),
    clear:      () => ({type: 'clear'}),
    toggle:     () => ({type: 'toggle'}),
    start:      () => ({type: 'start'}),
    stop:       () => ({type: 'stop'}),
}

// entries
export const refresh_entries = () => ({
    type: 'entry.refresh'
})

export const select_entry = (browser, index) => ({
    type: 'entry.select', value: {key: browser, index}
})

export const create_entry = (name, ca_string, on_error) => (dispatch, getState) => {
    let entry_browser = getState().entry_browser;
    entry_browser.create(name, ca_string)
        .then(() => {
            on_error(false);
            dispatch(refresh_entries());
        }, (err) => {
            on_error(err);
        }); 
}

export const edit_entry = (browser, index, name, ca_string, on_error) => (dispatch, getState) => {
    let entry_browser = getState().entry_browser;
    entry_browser.edit(browser, index, name, ca_string)
        .then(() => {
            on_error(false);
            dispatch(refresh_entries());
        }, (err) => {
            on_error(err);
        });
}

export const delete_entry = (browser, index) => (dispatch, getState) => {
    let entry_browser = getState().entry_browser;
    entry_browser.delete(browser, index)
        .then(() => {
            dispatch(refresh_entries());
        })
}

// randomiser
export const select_randomiser = index => ({
    type: 'randomiser.select', value: index
})

export const update_randomiser = (name, value) => ({
    type: 'randomiser.update', name: name, value: value 
})

// shader
export const select_renderer = index => ({
    type: 'shader.select_renderer', value: index
})

export const update_shader_params = params => ({
    type: 'shader.update_params', value: params
})

// statistics
export const update_statistics = stats => ({
    type: 'stats.update', value: stats
})

// gui
export const set_fullscreen = fullscreen => ({
    type: 'gui.fullscreen', value: fullscreen
})

export const set_focused = focused => ({
    type: 'gui.focused', value: focused
})

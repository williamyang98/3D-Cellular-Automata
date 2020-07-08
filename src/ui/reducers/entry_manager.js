export function entry_reducer(entry_browser) {
    const reducer = (browser=entry_browser, action) => {
        switch (action.type) {
            case 'entry.refresh':
                return browser;
            case 'entry.select':
                {
                    let {key, index} = action.value;
                    browser.select(key, index);
                }
                break;
            default: 
                break;
        }

        return browser;
    } 

    return reducer;
}
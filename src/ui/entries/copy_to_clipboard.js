let copy_to_clipboard = (string, on_success) => {
    navigator.permissions
        .query({name: 'clipboard-write'})
        .then(res => {
            if (res.state === 'granted' || res.state === 'prompt') {
                navigator.clipboard
                .writeText(string)
                .then(() => {
                    if (on_success !== undefined) {
                        on_success();
                    }
                });
            }
        });
}

export { copy_to_clipboard };
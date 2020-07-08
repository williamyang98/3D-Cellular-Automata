export function stats_reducer(init_stats) {
    const reducer = (stats=init_stats, action) => {
        switch (action.type) {
            case 'stats.update':
                return action.value;
            default: 
                break;
        }

        return stats;
    }

    return reducer;
}
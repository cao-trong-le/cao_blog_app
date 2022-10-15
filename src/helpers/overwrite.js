/* eslint-disable */

export const OverwriteObject = (origin, update) => {
    for (let key of Object.keys(origin)) {
        if (typeof(origin[key]) === "object") {
            let origin_value = JSON.stringify(origin[key])
            let update_value = JSON.stringify(update[key])
            if (origin_value !== update_value) {
                origin[key] = update[key]
            }
        }

        else if (Array.isArray(origin[key])) {
            let origin_value = JSON.stringify(origin[key])
            let update_value = JSON.stringify(update[key])
            if (origin_value !== update_value) {
                origin[key] = [...update[key]]
            }
        }

        else {
            if (origin[key] !== update[key]) 
                origin[key] = update[key]
        }
    }

    return origin
}
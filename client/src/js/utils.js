// Merge two objects with nested objects
function nestedObjectAssign(obj1, obj2) {
    for (const key of Object.keys(obj2)) {
        if (key in obj1) {
            // Nested merge
            obj1[key] = Object.assign(obj1[key], obj2[key]);
        } else {
            // Simple copy
            obj1[key] = obj2[key];
        }
    }

    return obj1;
}

export { nestedObjectAssign };
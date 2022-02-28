function managerEntries(entry = []) {
    return [...entry, require.resolve("./dist/esm/preset/manager")]
}

function config(entry = []) {
    return [...entry, require.resolve("./dist/esm/preset/preview")]
}

module.exports = { managerEntries, config };

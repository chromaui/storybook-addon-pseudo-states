function managerEntries(entry = []) {
  return [...entry, require.resolve("./preset/manager")]
}

function config(entry = []) {
  return [...entry, require.resolve("./preset/preview")]
}

module.exports = { managerEntries, config }

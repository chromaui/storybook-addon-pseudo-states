export function config(entry = []) {
  return [...entry, require.resolve("./addDecorator")]
}

export function managerEntries(entry = []) {
  return [...entry, require.resolve("./register")]
}

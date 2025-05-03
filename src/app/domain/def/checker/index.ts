export function hasValueChanged(oldVal: unknown, newVal: unknown): boolean {

  if ((newVal == null || newVal == '') && (oldVal == null || oldVal == '')) {
    return false
  }
  if (oldVal == null || newVal == null) {
    return oldVal !== newVal
  }

  if (oldVal === undefined || newVal === undefined) {
    return oldVal !== newVal
  }

  // Type check
  if (typeof oldVal !== typeof newVal) return true

  // Handle primitives (including symbols)
  if (typeof oldVal !== 'object' && typeof oldVal !== 'function') {
    return !Object.is(oldVal, newVal)
  }

  // Handle function comparison
  if (typeof oldVal === 'function') {
    return oldVal !== newVal
  }

  // Handle object type mismatches
  if (oldVal.constructor !== newVal.constructor) return true

  // Special object handling
  if (oldVal instanceof Date) {
    return (oldVal as Date).getTime() !== (newVal as Date).getTime()
  }

  if (oldVal instanceof RegExp) {
    return oldVal.toString() !== newVal.toString()
  }

  if (Array.isArray(oldVal)) {
    if (oldVal.length !== (newVal as unknown[]).length) return true
    return oldVal.some((item, index) => hasValueChanged(item, (newVal as unknown[])[index]))
  }

  if (oldVal instanceof Set) {
    if (oldVal.size !== (newVal as Set<unknown>).size) return true
    return Array.from(oldVal).some((item, index) => hasValueChanged(item, Array.from(newVal as Set<unknown>)[index]))
  }

  if (oldVal instanceof Map) {
    if (oldVal.size !== (newVal as Map<unknown, unknown>).size) return true
    return Array.from(oldVal.entries()).some(([key, value], index) => {
      const newEntries = Array.from((newVal as Map<unknown, unknown>).entries())
      return hasValueChanged(key, newEntries[index][0]) || hasValueChanged(value, newEntries[index][1])
    })
  }

  // Handle plain objects
  const oldKeys = Object.keys(oldVal)
  const newKeys = Object.keys(newVal as object)

  if (oldKeys.length !== newKeys.length) return true
  if (!oldKeys.every(key => newKeys.includes(key))) return true

  return oldKeys.some(key => hasValueChanged((oldVal as Record<string, unknown>)[key], (newVal as Record<string, unknown>)[key]))
}

const TECH_SCROLL_START = 0.45
const TECH_SCROLL_END = 0.79

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = value => value * value * (3 - 2 * value)

export function getTechFocus(progress, cardCount, visibleCount = 2) {
  const maxFocus = Math.max(0, cardCount - visibleCount)
  const linearProgress = clamp((progress - TECH_SCROLL_START) / (TECH_SCROLL_END - TECH_SCROLL_START))
  return ease(linearProgress) * maxFocus
}

function inverseEase(value) {
  let min = 0
  let max = 1
  for (let index = 0; index < 24; index += 1) {
    const middle = (min + max) / 2
    if (ease(middle) < value) min = middle
    else max = middle
  }
  return (min + max) / 2
}

export function getTechSnapProgress(progress, cardCount, visibleCount = 2) {
  if (progress < TECH_SCROLL_START || progress > TECH_SCROLL_END) return null
  const maxFocus = Math.max(0, cardCount - visibleCount)
  if (maxFocus === 0) return TECH_SCROLL_START
  const snappedFocus = Math.round(getTechFocus(progress, cardCount, visibleCount))
  const linearProgress = inverseEase(snappedFocus / maxFocus)
  return TECH_SCROLL_START + linearProgress * (TECH_SCROLL_END - TECH_SCROLL_START)
}

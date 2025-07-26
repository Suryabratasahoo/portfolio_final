export function calculateParallax(element: HTMLElement | null, speed = 0.1, direction: "up" | "down" = "up"): number {
  if (!element) return 0

  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // Calculate how far the element is from the center of the viewport
  const elementCenter = rect.top + rect.height / 2
  const distanceFromCenter = elementCenter - windowHeight / 2

  // Apply parallax effect
  const parallaxOffset = distanceFromCenter * speed

  return direction === "up" ? -parallaxOffset : parallaxOffset
}

export function applyParallaxToElement(
  element: HTMLElement | null,
  speed = 0.1,
  direction: "up" | "down" = "up",
): void {
  if (!element) return

  const offset = calculateParallax(element, speed, direction)
  element.style.transform = `translateY(${offset}px)`
}


interface DocumentWithViewTransition {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>
    ready: Promise<void>
    updateCallbackDone: Promise<void>
  }
}

export function tryStartViewTransition(
  updateCallback: () => void,
  options?: {
    skipPrefersReducedMotionCheck?: boolean
  },
): {
  finished: Promise<void>
} {
  const startViewTransition = (document as DocumentWithViewTransition)
    .startViewTransition

  if (
    !startViewTransition ||
    (options?.skipPrefersReducedMotionCheck !== true &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  ) {
    updateCallback()
    return {
      finished: Promise.resolve(),
    }
  }

  return startViewTransition.call(document, updateCallback)
}

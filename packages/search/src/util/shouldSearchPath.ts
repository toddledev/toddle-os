export function shouldSearchPath(
  path: (string | number)[],
  pathsToVisit: string[][] = [],
) {
  return (
    pathsToVisit.length === 0 ||
    pathsToVisit.some((pathToVisit) =>
      pathToVisit.every((p1, i) => path[i] === p1),
    )
  )
}

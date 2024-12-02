export function getDragData(event: Event) {
  if (event instanceof DragEvent) {
    return Array.from(event.dataTransfer?.items ?? []).reduce<
      Record<string, any>
    >((dragData, item) => {
      dragData[item.type] = event.dataTransfer?.getData(item.type)
      return dragData
    }, {})
  }
  return
}

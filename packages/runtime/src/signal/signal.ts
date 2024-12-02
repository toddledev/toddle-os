import deepEqual from 'fast-deep-equal'

const signals: Set<Signal<any>> = ((window as any).currentSignals =
  (window as any).currentSignals ?? new Set<Signal<any>>())

export class Signal<T> {
  value: T
  subscribers: Array<{
    notify: (value: T) => void
    destroy?: () => void
  }>
  subscriptions: Array<() => void>

  constructor(value: T) {
    this.value = value
    this.subscribers = []
    this.subscriptions = []
    signals?.add(this)
  }
  get() {
    return this.value
  }
  set(value: T) {
    if (deepEqual(value, this.value) === false) {
      this.value = value
      this.subscribers.forEach(({ notify }) => notify(this.value))
    }
  }

  update(f: (current: T) => T) {
    this.set(f(this.value))
  }
  subscribe(notify: (value: T) => void, config?: { destroy?: () => void }) {
    this.subscribers.push({ notify, destroy: config?.destroy })
    notify(this.value)
    return () => {
      this.subscribers = this.subscribers.filter((sub) => notify != sub.notify)
    }
  }
  destroy() {
    signals.delete(this)
    this.subscribers.forEach(({ destroy }) => {
      destroy?.()
    })
    this.subscribers = []
    this.subscriptions?.forEach((f) => f())
  }
  cleanSubscribers() {
    this.subscribers.forEach(({ destroy }) => {
      destroy?.()
    })
    this.subscribers = []
  }
  map<T2>(f: (value: T) => T2): Signal<T2> {
    const signal2 = signal(f(this.value))
    signal2.subscriptions.push(
      this.subscribe((value) => signal2.set(f(value)), {
        destroy: () => signal2.destroy(),
      }),
    )
    signals.add(signal2)
    return signal2
  }
}

export function signal<T>(value: T) {
  return new Signal(value)
}

if (typeof window !== 'undefined') {
  ;(window as any).signal = signal
  ;(window as any).deepEqual = deepEqual
}

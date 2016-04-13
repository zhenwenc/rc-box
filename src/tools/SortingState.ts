import { Map } from 'immutable'
import { SortOrder } from '../plugins'

const DEV = process.env.NODE_ENV === 'development'

const { NONE, ASC, DESC } = SortOrder

export class SortingState {

  private states: Map<string, SortOrder>

  constructor(targets: string[]) {
    if (typeof targets === 'undefined')
      throw new Error(
        `[RCBOX] ${this.constructor.name} must has at lease one target key.`
      )

    this.states = targets.reduce(
      (rs, nextKey) => rs.set(nextKey, NONE),
      Map<string, SortOrder>()
    )
  }

  getFn(key: string) {
    return () => this.get(key)
  }

  get(key: string) {
    this.checkKey(key)
    return this.states.get(key)
  }

  set(key: string, order: SortOrder) {
    this.checkKey(key)
    this.checkOrder(order)
    this.states = this.states.set(key, order)
    return this
  }

  next(key: string) {
    const current = this.get(key)
    const next = current === NONE
      ? ASC
      : current === ASC
        ? DESC
        : ASC
    this.resetAll()
    this.set(key, next)
    return this
  }

  reset(key: string) {
    this.checkKey(key)
    this.set(key, NONE)
    return this
  }

  resetAll() {
    this.states.keySeq().forEach(this.reset.bind(this))
    return this
  }

  private checkKey(key: string) {
    if (!this.states.has(key) && DEV) {
      throw new Error(`[RCBOX] No state found with sorting key: [${key}]`)
    }
  }

  private checkOrder(order: SortOrder) {
    if (typeof order === 'undefined') {
      throw new Error(`[RCBOX] Invalid sorting order: [${order}]`)
    }
  }
}

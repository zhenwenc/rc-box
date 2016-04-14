import * as _ from 'lodash'
import { Map } from 'immutable'
import { check } from '../utils'
import { SortingOrder } from './SortingOrder'
import { SortingPlugin } from './SortingPlugin'

const DEV = process.env.NODE_ENV === 'development'

const { NONE, ASC, DESC } = SortingOrder

export class SortingState {
  private plugin: SortingPlugin
  private states: Map<string, SortingOrder>

  constructor(
    self: SortingPlugin,
    keys: (string | [string, SortingOrder])[] = []
  ) {
    check(keys, `SortingState must have at lease one target key`)

    this.plugin = self
    this.states = keys.reduce((rs, nextKey) => {
      if (typeof nextKey === 'string') {
        return rs.set(nextKey, NONE)
      } else {
        const [key, order] = nextKey
        rs.set(key, order)
      }
    }, Map<string, SortingOrder>())
  }

  fnGet(key: string) {
    return () => this.get(key)
  }

  get(key: string) {
    this.checkKey(key)
    return this.states.get(key)
  }

  set(key: string, order: SortingOrder) {
    this.checkKey(key)
    this.checkOrder(order)
    this.states = this.states.set(key, order)
    return this.plugin
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
    return this.plugin
  }

  reset(key: string) {
    this.checkKey(key)
    this.set(key, NONE)
    return this.plugin
  }

  resetAll() {
    this.states.keySeq().forEach(this.reset.bind(this))
    return this.plugin
  }

  private checkKey(key: string) {
    check(this.states.has(key) || DEV,
      `No state found with sorting key: [${key}]`)
  }

  private checkOrder(order: SortingOrder) {
    check(!_.isUndefined(order),
      `Invalid sorting order: [${order}]`)
  }
}

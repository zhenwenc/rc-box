import * as _ from 'lodash'
import { Map, List } from 'immutable'
import { check } from '../utils'
import { SortingOrder } from './SortingOrder'
import { TableSorter } from './TableSorters'
import { SortingPluginImpl } from './SortingPluginImpl'

const DEV = process.env.NODE_ENV === 'development'

const { NONE, ASC, DESC } = SortingOrder

export class SortingPlugin extends SortingPluginImpl {

  private states: Map<string, SortingOrder>

  protected readonly sorters: List<TableSorter>
  protected readonly multiSortable: boolean

  constructor({
    keys,
    sorters,
    multiSortable,
  }: {
    keys: (string | [string, SortingOrder])[]
    sorters?: TableSorter[]
    multiSortable?: boolean
  } = {
    keys: []
  }) {
    super()
    check(keys, `SortingState must have at lease one target key`)

    this.sorters = List(sorters)
    this.multiSortable = multiSortable
    this.states = keys.reduce((rs, nextKey) => {
      if (typeof nextKey === 'string') {
        return rs.set(nextKey, NONE)
      } else {
        const [key, order] = nextKey
        rs.set(key, order)
      }
    }, Map<string, SortingOrder>())
  }

  get(key: string) {
    this.checkKey(key)
    return this.states.get(key)
  }

  fnGet(key: string) {
    return () => this.get(key)
  }

  set(key: string, order: SortingOrder, forceUpdate = true) {
    this.checkKey(key)
    this.checkOrder(order)
    this.states = this.states.set(key, order)
    this.notifyUpdate(forceUpdate)
    return this
  }

  next(key: string, forceUpdate = true) {
    const current = this.get(key)
    const next = current === NONE
      ? ASC
      : current === ASC
        ? DESC
        : ASC
    this.resetAll(false)
    return this.set(key, next, forceUpdate)
  }

  reset(key: string, forceUpdate = true) {
    return this.set(key, NONE, forceUpdate)
  }

  resetAll(forceUpdate = true) {
    this.states.keySeq().forEach(
      key => this.reset.bind(this)(key, false)
    )
    this.notifyUpdate(forceUpdate)
    return this
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

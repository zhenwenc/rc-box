import * as _ from 'lodash'
import { List } from 'immutable'
import { check } from '../utils'
import { PaginationPluginImpl } from './PaginationPluginImpl'

export const PAGE_MIN_INDEX = 1
export const PAGE_DEFAULT_SIZE = 10
export const PAGE_DEFAULT_SIZE_LIST = [
  [10, '10 Rows'],
  [25, '25 Rows'],
  [30, '30 Rows'],
  [50, '50 Rows'],
]

export class PaginationPlugin extends PaginationPluginImpl {
  private _pageSize: number
  private _currPage: number
  private _maxPage: number

  constructor({
    initPage,
    pageSize,
  } : {
    pageSize?: number
    initPage?: number
  } = {}) {
    super()
    this.setPageSize(pageSize || PAGE_DEFAULT_SIZE, false)
    this.setPageIndex(initPage || PAGE_MIN_INDEX, false)
  }

  get pageSize() {
    return this._pageSize
  }

  setPageSize(size: number, forceUpdate = true) {
    check(size > 0 && Number.isInteger(size),
      `Page size must be positive integer, but got [${size}]`)
    this._pageSize = size
    this.notifyUpdate(forceUpdate)
    return this
  }

  get pageIndex() {
    return this._currPage
  }

  setPageIndex(index: number, forceUpdate = true) {
    check(index > 0 && Number.isInteger(index),
      `Page number must greater than 0, but got ${index}`)
    this._currPage = index
    this.notifyUpdate(forceUpdate)
    return this
  }

  get maxIndex() {
    return this._maxPage
  }

  protected setMaxIndex(maxIndex: number) {
    this._maxPage = maxIndex
  }

  get prevPageIndex(): number {
    return this.pageIndex % this._maxPage + 1
  }

  get nextPageIndex(): number {
    const maxPage = this._maxPage
    const index   = (this.pageIndex - 1) % maxPage
    return index > 0 ? index : maxPage
  }

  get toNextPage() {
    return this.setPageIndex(this.prevPageIndex)
  }

  get toPrevPage() {
    return this.setPageIndex(this.nextPageIndex)
  }

  get toFirstPage() {
    return this.setPageIndex(1)
  }

  get toLastPage() {
    return this.setPageIndex(this._maxPage)
  }

  /**
   * Generate a list of page size options for the given options.
   */
  createPageSizeList(pageSizeList?: [number, string][]) {
    const sizeList = List<[number, string]>(
      pageSizeList || PAGE_DEFAULT_SIZE_LIST)

    return sizeList.map(pair => {
      const [pageSize, label] = pair
      return {
        value: pageSize,
        label: label,
        active: _.eq(pageSize, this.pageSize),
        onChange: () => this.setPageSize(pageSize),
      }
    })
  }

  /**
   * Generate a list of page navigation controls with format:
   *
   * [first][prev][1, 2, 3, ...][next][last]
   */
  createPageList(includePrevNext = true, includeFirstLast = false) {
    let pages = _.range(1, this.maxIndex + 1)
      .map(index => ({
        key: _.toString(index),
        active: _.eq(index, this.pageIndex),
        handler: () => this.setPageIndex(index),
      })
    )

    if (includePrevNext) {
      const [prev, next] = this.createPagePrevNext()
      pages = _.flatten([[prev], pages, [next]])
    }

    if (includeFirstLast) {
      const [first, last] = this.createPageFirstLast()
      pages = _.flatten([[first], pages, [last]])
    }

    return List(pages)
  }

  createPagePrevNext() {
    return [
      {
        key: 'PREV',
        active: _.eq(PAGE_MIN_INDEX, this.pageIndex),
        handler: () => this.toPrevPage,
      }, {
        key: 'NEXT',
        active: _.eq(this.maxIndex, this.pageIndex),
        handler: () => this.toNextPage,
      },
    ]
  }

  createPageFirstLast() {
    return [
      {
        key: 'FIRST',
        active: _.eq(PAGE_MIN_INDEX, this.pageIndex),
        handler: () => this.toFirstPage,
      }, {
        key: 'LAST',
        active: _.eq(this.maxIndex, this.pageIndex),
        handler: () => this.toLastPage,
      },
    ]
  }
}

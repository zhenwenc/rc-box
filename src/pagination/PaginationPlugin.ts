import { check } from '../utils'
import { PaginationPluginImpl } from './PaginationPluginImpl'

export class PaginationPlugin extends PaginationPluginImpl {
  private _pageSize: number
  private _currPage: number
  private _maxPage: number

  constructor({
    pageSize,
    initPage,
  } : {
    pageSize?: number
    initPage?: number
  } = {}) {
    super()
    this.setPageSize(pageSize || 10)
    this.setCurrentPage(initPage || 1)
  }

  getCurrentPage() {
    return this._currPage
  }

  setCurrentPage(index: number) {
    check(index > 0 && Number.isInteger(index),
      `Page number must greater than 0, but got ${index}`)
    this._currPage = index
    return this
  }

  getPageSize() {
    return this._pageSize
  }

  setPageSize(size: number) {
    check(size > 0 && Number.isInteger(size),
      `Page size must be positive integer, but got [${size}]`)
    this._pageSize = size
    return this
  }

  setMaxIndex(maxIndex: number) {
    this._maxPage = maxIndex
  }

  nextPage() {
    const index = this.getCurrentPage() % this._maxPage + 1
    return this.setCurrentPage(index)
  }

  prevPage() {
    const maxPage = this._maxPage
    const index   = (this.getCurrentPage() - 1) % maxPage
    return this.setCurrentPage(index > 0 ? index : maxPage)
  }

  firstPage() {
    return this.setCurrentPage(1)
  }

  lastPage() {
    return this.setCurrentPage(this._maxPage)
  }
}

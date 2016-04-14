import { check, checkOption } from '../utils'
import { Pagination } from './PaginationPlugin'

export class PaginationState implements Pagination {
  private _pageSize: number
  private _currPage: number

  private fnTableSize: () => number

  constructor({
    fnTableSize,
    fnPageSize,
    initPage,
  } : {
    fnTableSize: () => number
    fnPageSize?: number
    initPage?: number
  }) {
    checkOption(this, fnTableSize, 'fnTableSize')

    this.fnTableSize = fnTableSize
    this._pageSize = Math.round(fnPageSize) || 10
    this._currPage = Math.round(initPage) || 1
  }

  get currPage() {
    return this._currPage
  }

  get pageSize() {
    return this._pageSize
  }

  get tableSize() {
    const size = this.fnTableSize()
    check(size >= 0, `Table size must be >= 0, but got ${size}`)
    return size
  }

  get maxPage() {
    return Math.ceil(this.tableSize / this.pageSize)
  }

  setCurrentPage(index: number) {
    const maxPage = this.maxPage
    check(index > 0 && index < maxPage && Number.isInteger(index),
      `Page number must in range [1, ${maxPage}], but got ${index}`)
    this._currPage = index
    return this
  }

  setPageSize(size: number) {
    check(size > 0 && Number.isInteger(size),
      `Page size must be positive integer, but got [${size}]`)
    this._pageSize = size
    return this
  }

  nextPage() {
    const index = this.currPage % this.maxPage + 1
    return this.setCurrentPage(index)
  }

  prevPage() {
    const maxPage = this.maxPage
    const index   = (this.currPage - 1) % maxPage
    return this.setCurrentPage(index > 0 ? index : maxPage)
  }

  firstPage() {
    return this.setCurrentPage(1)
  }

  lastPage() {
    return this.setCurrentPage(this.maxPage)
  }
}

import * as _ from 'lodash'
import { List } from 'immutable'
import { TablePlugin } from './TablePlugin'
import { TableData } from './TableManager'
import { ColumnDef } from '../components'
import { check } from '../utils'

const DEV = process.env.NODE_ENV === 'development'

export interface TablePagination {
  /**
   * A function that returns the number of items / rows in each page.
   */
  pageSize: number
  /**
   * A function that returns the current page number, start from 1.
   */
  currPage: number
}

export class TablePaginationPlugin implements TablePlugin {
  constructor(
    private state: () => TablePagination
  ) {}

  get priority() { return 100 }

  process(tableData: TableData, columns: List<ColumnDef>) {
    const pageSize = this.getPageSize()
    const maxIndex = Math.ceil(tableData.size / pageSize)
    const currPage = this.getCurrentPage(maxIndex)
    const offset   = pageSize * (currPage - 1)

    return tableData.slice(offset, offset + pageSize)
  }

  private getState() {
    const state = this.state()
    check(_.isObject(state), `Pagination state must be object, but got ${state}`)
    return state
  }

  private getPageSize() {
    const num = Number(this.getState().pageSize)
    if (_.isNaN(num) || num <= 0) {
      check(!DEV, `Page size must be positive, but got [${num}]`)
      return 1 // fallback
    }
    return num
  }

  private getCurrentPage(max: number) {
    const num = Number(this.getState().currPage)
    if (_.isNaN(num) || num < 1) {
      check(!DEV, `Expected page number in range [1, ${max}], but got [${num}]`)
      return 1 // fallback
    }
    return Math.min(num, max)
  }
}

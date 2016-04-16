import * as _ from 'lodash'
import { List } from 'immutable'
import { TablePluginBase, TableData, ColumnDef } from '../core'

export abstract class PaginationPluginImpl extends TablePluginBase {

  protected abstract get pageSize(): number
  protected abstract get pageIndex(): number
  protected abstract setMaxIndex(maxIndex: number): void

  protected calMaxIndex(dataSize: number, pageSize: number) {
    return Math.ceil(dataSize / pageSize)
  }

  get priority() { return 100 }

  register(_, initData: TableData) {
    super.register(_, initData)
    this.setMaxIndex(this.calMaxIndex(initData.size, this.pageSize))
  }

  process(tableData: TableData, columns: List<ColumnDef>) {
    const pageSize = this.pageSize
    const maxIndex = this.calMaxIndex(tableData.size, pageSize)
    const currPage = Math.min(this.pageIndex, maxIndex)
    const offset   = pageSize * (currPage - 1)

    // Update pagination states base on the current table data
    this.setMaxIndex(maxIndex)

    return tableData.slice(offset, offset + pageSize)
  }
}

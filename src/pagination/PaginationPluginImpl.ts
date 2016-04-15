import * as _ from 'lodash'
import { List } from 'immutable'
import { TablePluginBase, TableData, ColumnDef } from '../core'

export abstract class PaginationPluginImpl extends TablePluginBase {

  protected abstract getPageSize(): number
  protected abstract getCurrentPage(): number
  protected abstract setMaxIndex(maxIndex: number): void

  get priority() { return 100 }

  process(tableData: TableData, columns: List<ColumnDef>) {
    const pageSize = this.getPageSize()
    const maxIndex = Math.ceil(tableData.size / pageSize)
    const currPage = Math.min(this.getCurrentPage(), maxIndex)
    const offset   = pageSize * (currPage - 1)

    const result = tableData.slice(offset, offset + pageSize)
    this.setMaxIndex(result.size)

    return result
  }
}

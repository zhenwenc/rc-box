import { List } from 'immutable'
import { ColumnDef } from './TableColumn'
import { TableData, TableManager } from './TableManager'

export interface TablePlugin {
  register?: {
    (manager: TableManager): void
  }
  priority: number,
  process: {
    (data: TableData, columns: List<ColumnDef>): TableData
  }
}

export default TablePlugin

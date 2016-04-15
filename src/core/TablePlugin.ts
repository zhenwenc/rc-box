import { List } from 'immutable'
import { DataTable } from './DataTable'
import { ColumnDef } from './TableColumn'
import { TableData } from './TableManager'

export interface TablePlugin {
  register?: {
    (dataTable: DataTable): void
  }
  priority: number,
  process: {
    (data: TableData, columns: List<ColumnDef>): TableData
  }
}

export default TablePlugin

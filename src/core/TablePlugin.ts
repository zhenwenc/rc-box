import { List } from 'immutable'
import { ColumnDef } from './TableColumn'
import { TableData } from './TableManager'

export interface TablePlugin {
  register?: {
    (onStateUpdate: StateUpdateCallback): void
  }
  priority: number,
  process: {
    (data: TableData, columns: List<ColumnDef>): TableData
  }
}

export interface StateUpdateCallback {
  (targetName: string, target: TablePlugin): any
}

export default TablePlugin

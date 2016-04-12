import { List } from 'immutable'
import { ColumnDef } from '../components'
import { TableData } from './TableManager'

export interface TablePlugin {
  priority: number,
  process: {
    (data: TableData, columns: List<ColumnDef>)
  }
}

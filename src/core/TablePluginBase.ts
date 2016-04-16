import { List } from 'immutable'

import { TablePlugin } from './TablePlugin'
import { TableData, TableManager } from './TableManager'
import { ColumnDef } from './TableColumn'
import { check } from '../utils'

export abstract class TablePluginBase implements TablePlugin {
  // Will be defined in register method
  private manager: TableManager

  register(manager: TableManager, initData?: TableData) {
    check(!this.manager, `Unexpected method call: ` +
      `'register' method should only be called by TableManager! ` +
      `Please check implementation of ${this.constructor.name}.`)
    this.manager = manager
  }

  notifyUpdate(forceUpdate = true) {
    if (forceUpdate) {
      this.manager.forceUpdateTable(this)
    }
  }

  abstract get priority(): number
  abstract process(data: TableData, columns: List<ColumnDef>): TableData
}

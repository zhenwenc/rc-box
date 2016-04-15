import { List } from 'immutable'

import { TablePlugin, StateUpdateCallback } from './TablePlugin'
import { TableData } from './TableManager'
import { ColumnDef } from './TableColumn'
import { check } from '../utils'

export abstract class TablePluginBase implements TablePlugin {
  // Will be defined in register method
  private updateCallback: StateUpdateCallback

  register(updateCallback: StateUpdateCallback) {
    check(!this.updateCallback, `Unexpected method call: ` +
      `'register' method should only be called internally!`)
    this.updateCallback = updateCallback
  }

  notifyUpdate() {
    check(this.updateCallback, `Unexpected method call: ` +
      `You have stateful plugin in your data table, but there is ` +
      `no plugin state update callback function. ` +
      `See DataTableProps#onStateUpdate property for more details. ` +
      `Please check implementation of ${this.constructor.name}.`)
    if (this.updateCallback)
      this.updateCallback(this.constructor.name, this)
  }

  abstract get priority(): number
  abstract process(data: TableData, columns: List<ColumnDef>): TableData
}

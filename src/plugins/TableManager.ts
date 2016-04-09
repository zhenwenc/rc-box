import * as _ from 'lodash'
import { List, Seq } from 'immutable'

import { TableFilterPlugin } from './TableFilterPlugin'
import { ColumnDef } from '../components/TableColumn'

export type RawTableData = Seq<number, any> | any[]
export type TableData = Seq<number, any>

export interface TablePlugin {
  priority: number,
}

export class TableManager {
  private plugins: List<TablePlugin>
  private columns: List<ColumnDef>

  constructor(plugins: List<TablePlugin>, columns: List<ColumnDef>) {
    // Sort plugins by priority DESC
    this.plugins = plugins.sort(
      (a, b) => b.priority - a.priority
    ).toList()
    this.columns = columns
  }

  get shouldProcess() {
    return true // TODO
  }

  // TODO receive an argument to indicate which plugin triggers
  //      the reprocess, so that we can skip processing some of
  //      the plugins, which can be determined by the plugin
  //      priority.

  asyncProcess(srcData: RawTableData): Promise<TableData> {
    return new Promise((resolve, reject) => {
      const data = (srcData instanceof Seq)
                ? srcData as Seq<number, any>
                : Seq(srcData)
      resolve(this.process(data))
    })
  }

  private process(data: TableData): TableData {
    const reducer = (result: TableData, plugin: TablePlugin) => {
      if (plugin instanceof TableFilterPlugin) {
        return this.processTableFilter(plugin, data)
      }
      else if (process.env.ENV === 'development') {
        throw new Error(`[RCBOX] Unknown plugin [${plugin}]`)
      }
      else return result
    }
    // TODO Can we rewrite this with ImmutableJS functions?
    return _.reduce(this.plugins.toArray(), reducer, data)
  }

  private processTableFilter(plugin: TableFilterPlugin, data: TableData) {
    const selector = rowData => this.columns.map(s => s.field(rowData))
    return plugin.handleFilter(data, selector)
  }
}

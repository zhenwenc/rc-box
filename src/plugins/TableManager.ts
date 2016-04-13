import { Iterable, List, Seq } from 'immutable'

import { ColumnDef } from '../components'
import { TablePlugin } from './TablePlugin'

export type RawTableData = Seq<number, any> | any[]
export type TableData = Iterable<number, any>

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
    return this.plugins.reduce(
      (result, plugin) =>
        plugin.process(result, this.columns)
      ,
      data
    )
  }
}

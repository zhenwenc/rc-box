import { Iterable, List, Seq } from 'immutable'

import { check } from '../utils'
import { DataTable } from './DataTable'
import { ColumnDef } from './TableColumn'
import { TablePlugin } from './TablePlugin'

export type RawTableData = Seq<number, any> | any[]
export type TableData = Iterable<number, any>

export class TableManager {
  private dataTable: DataTable
  private plugins: List<TablePlugin>
  private columns: List<ColumnDef>

  constructor(
    dataTable: DataTable,
    plugins: List<TablePlugin>,
    columns: List<ColumnDef>
  ) {
    this.dataTable = dataTable
    this.columns = columns

    // Sort plugins by priority DESC
    this.plugins = plugins.sort(
      (a, b) => b.priority - a.priority
    ).toList()
    // Register root element to each plugin
    this.plugins
      .filter(p => !!p.register)
      .forEach(p => p.register(this))
  }

  hasPlugin(plugin: TablePlugin) {
    return this.plugins.contains(plugin)
  }

  /**
   * A function that triggers datatable update with the existing
   * source data.
   *
   * This function typically used by managed stateful plugins to
   * force datatable rerender after state changed.
   *
   * WARNING: This function is intended to only be called by
   *          managed plugins.
   */
  forceUpdateTable(target: TablePlugin) {
    const { updateTableData, rawData } = this.dataTable

    check(this.hasPlugin(target),
      `Unexpected 'notifyPluginUpdate' method called by ` +
      `${target.constructor.name}, where no such plugin ` +
      `specified in datatable.`)

    updateTableData.bind(this.dataTable)(rawData)
  }

  // TODO receive an argument to indicate which plugin triggers
  //      the reprocess, so that we can skip processing some of
  //      the plugins, which can be determined by the plugin
  //      priority.

  process(rawData: RawTableData): TableData {
    const data = (rawData instanceof Iterable)
               ? rawData as Iterable<number, any>
               : Seq(rawData)
    return this.plugins.reduce(
      (result, plugin) => plugin.process(result, this.columns),
      data
    )
  }
}

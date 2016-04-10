/**
 * This is designed as a plugin for the React DataTable component to
 * provide functionality that filter by single column. This plugin
 * should also compatible with most other component, such as List.
 */

import * as _ from 'lodash'
import { List, Iterable } from 'immutable'
import { TablePlugin, TableData } from './TableManager'
import { ColumnDef } from '../components/TableColumn'

export interface TableColumnSorter {
  enabled: boolean | (() => boolean)
  comparator?: (a: any, b: any) => number
}

export interface TableSorter {
  enabled: boolean | (() => boolean)
  selector: (rowData: any) => any
  comparator: (a: any, b: any) => number
}

export const defaultTableColumnSorter = {
  enabled: false,
  comparator: undefined,
}

const defaultComparator = (a: any, b: any) => {
  return a === b ? 0 : a < b ? -1 : 1
}

export class TableSortPlugin implements TablePlugin {
  constructor(
    private sorters = List<TableSorter>(),
    private multiSortable = false
  ) {}

  get priority() { return 200 }

  /**
   * Function that intented to be used by the table plugin manager to
   * perform the sorting process. It supports sorting with mutiple sorter,
   * which will be performed in ASC order.
   *
   * NOTE: the sorting process will short circuit on any non-zero sorter
   *       result.
   */
  process(tableData: TableData, columns: List<ColumnDef>) {
    const columnSorters: Iterable<number, TableSorter> = columns
      .map(columnDef => {
        const sorter     = columnDef.sortable
        const selector   = columnDef.field
        const enabled    = sorter.enabled
        const comparator = sorter.comparator || defaultComparator

        return { enabled, selector, comparator }
      })

    const sorters = this.sorters.concat(columnSorters)
      .filter(s => _.isBoolean(s.enabled) ? s.enabled : s.enabled())

    const sorted = tableData.sort((row1, row2) => {
      const reducer = (result: number, sorter: TableSorter) => {
        const selector = sorter.selector
        const comparator = sorter.comparator
        return result !== 0
          ? result
          : comparator(selector(row1), selector(row2))
      }
      return sorters.reduce(reducer, 0)
    })

    return sorted
  }
}

/**
 * Returns an instance of table sort plugin.
 *
 * @param sorters       Optional list of custom sorters. NOTE: here is the
 *                      place where you can perform customized table sorting
 *                      functionality, i.e. sort with business logic.
 * @param multiSortable Enable the plugin to sort by multiple sorter if
 *                      possible, default false.
 */
export function createTableSortPlugin(settings: {
  sorters?: TableSorter[]
  multiSortable?: boolean
}) {
  return new TableSortPlugin(
    List(settings.sorters || []),
    settings.multiSortable
  )
}

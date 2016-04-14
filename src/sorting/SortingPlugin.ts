/**
 * This is designed as a plugin for the React DataTable component to
 * provide functionality that filter by single column. This plugin
 * should also compatible with most other component, such as List.
 *
 * How it works?
 *
 * There are 2 ways to set up sorting table sorting handlers:
 *
 * 1. Sort by column, which you need to specify `sortable` property
 *    in the DataTable Column component, see #ColumnSorter for
 *    available configurations. This is the typical usage for this
 *    plugin.
 *
 * 2. Sort by whatever you like! In some case an application need to
 *    sort table data with complicated business logic. If thats the
 *    case, you need to specify the list of custom sorters when
 *    initializing this plugin, see #TableSorter for available
 *    configurations.
 *
 * Q: How to define my custom sorter?
 *
 *  - The custom sorter needs to implements the TableSorter interface,
 *    and specify in this plugin's constructor.
 *
 * Q: How to enable sort by multiple sorter?
 *
 *  - Set `options#multiSortable` to `true` when initializing the
 *    plugin. The sorters are processed in the order that it is
 *    been defined, while custom sorter have the highest priority.
 *
 * Q: What function the table used to perform sorting?
 *
 *  - This plugin is using Iterable#sort function in ImmutableJS.
 */

import * as _ from 'lodash'
import { List, Iterable } from 'immutable'
import { TablePlugin, TableData, ColumnDef } from '../core'
import { SortingOrder } from './SortingOrder'
import { SortingState } from './SortingState'

const { NONE, DESC } = SortingOrder

export interface TableSortOrder {
  (): SortingOrder
}

export interface ColumnSorter {
  /**
   * A function that returns the order the column should be sorted.
   * The default value is SortOrder#NONE.
   *
   * NOTE: The sorting order should be stored in the DataTable
   *       component's state, so that the table will be rerendered
   *       when the order from any sorter is changed.
   */
  order: TableSortOrder
  /**
   * Optional comparator function which is used to determin the order
   * of each value pair.
   *
   * If this property is not set, the plugin will choose a default
   * comparator base on the column's datatype.
   */
  comparator?: (a: any, b: any) => number
}

export interface TableSorter {
  /**
   * A function that returns the order the column should be sorted.
   * The same logic is applied as ColumnSorter#order.
   */
  order: TableSortOrder
  /**
   * A function that retruns the value from each table row data to be
   * used in the sorting / comparator function.
   *
   * Unlike the ColumnSorter where we can use the selector function
   * defined in each Column component, the custom sorter let you choose
   * what data you needed to perform sorting.
   */
  selector: (rowData: any) => any
  /**
   * A comparator function which is used to determin the order of each
   * value pair.
   */
  comparator: (a: any, b: any) => number
}

const defaultComparator = (a: any, b: any) => {
  return _.eq(a, b) ? 0 : a < b ? -1 : 1
}

const numberComparator = (a: any, b: any) => {
  const [va, vb] = [_.toNumber(a), _.toNumber(b)]
  return va === vb ? 1 : _.lt(va, vb) ? -1 : 1
}

export class SortingPlugin implements TablePlugin {
  /**
   * Optional list of custom sorters. NOTE: here is the place
   * where you can perform customized table sorting functionality,
   * i.e. sort with complex business logic.
   */
  private sorters: List<TableSorter>

  /**
   * Enable the plugin to sort by multiple sorter if possible,
   * The default value is false.
   */
  private multiSortable: boolean

  /**
   * Table sorting state helper.
   */
  private sortingState: SortingState

  constructor(options: {
    keys: (string | [string, SortingOrder])[]
    sorters?: TableSorter[]
    multiSortable?: boolean
  }) {
    this.sorters = List(options.sorters)
    this.multiSortable = options.multiSortable
    this.sortingState = new SortingState(this, options.keys)
  }

  get priority() { return 200 }

  get state() { return this.sortingState }

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
      .filterNot(s => _.isUndefined(s.sortable))
      .map(columnDef => {
        const sorter     = columnDef.sortable
        const selector   = columnDef.field
        const type       = columnDef.type
        const order      = sorter.order
        const comparator = sorter.comparator || this.getComparator(type)

        return { order, selector, comparator }
      })

    const sorters = this.sorters.concat(columnSorters)
      .filter(s => this.getSortOrder(s.order) !== NONE)

    if (sorters.size > 1 && !this.multiSortable) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`[RCBOX] Found multiple sorter enabled while this` +
          `feature is disabled. To enable this feature, set 'multiSortable' ` +
          `property to 'true' on TableSortPlugin. Those unexpected sorters ` +
          `are: ${sorters.toJS()}`)
      }
      // NOTE: Returns unsorted table data as fallback to avoid uncertain
      //       data will be used in production environment.
      return tableData
    }

    const sorted = tableData.sort((row1, row2) => {
      const reducer = (result: number, sorter: TableSorter) => {
        const { selector, comparator } = sorter
        const order = this.getSortOrder(sorter.order)
        const factor = order === DESC ? -1 : 1

        return result !== 0
          ? result
          : comparator(selector(row1), selector(row2)) * factor
      }
      return sorters.reduce(reducer, 0)
    })

    return sorted
  }

  private getComparator(columnType: string) {
    switch (_.toLower(columnType)) {
      case 'number':
        return numberComparator
      default:
        return defaultComparator
    }
  }

  private getSortOrder(order: TableSortOrder) {
    return _.isUndefined(order)
      ? NONE
      : order() || NONE
  }
}

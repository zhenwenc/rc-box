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
import { TablePluginBase } from '../core/TablePluginBase'
import { TableData, ColumnDef } from '../core'
import { SortingOrder } from './SortingOrder'
import { TableSorter, TableSortOrder } from './TableSorters'

const { NONE, DESC } = SortingOrder

const defaultComparator = (a: any, b: any) => {
  return _.eq(a, b) ? 0 : a < b ? -1 : 1
}

const numberComparator = (a: any, b: any) => {
  const [va, vb] = [_.toNumber(a), _.toNumber(b)]
  return va === vb ? 1 : _.lt(va, vb) ? -1 : 1
}

export abstract class SortingPluginImpl extends TablePluginBase {
  /**
   * Optional list of custom sorters. NOTE: here is the place
   * where you can perform customized table sorting functionality,
   * i.e. sort with complex business logic.
   */
  protected abstract sorters: List<TableSorter>

  /**
   * Enable the plugin to sort by multiple sorter if possible,
   * The default value is false.
   */
  protected abstract multiSortable: boolean

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

export default SortingPluginImpl

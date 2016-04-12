/**
 * This is designed as a plugin for the React DataTable component to
 * provide functionality that filter by single column. This plugin
 * should also compatible with most other component, such as List.
 */

import * as _ from 'lodash'
import { List, Iterable } from 'immutable'
import { TablePlugin } from './TablePlugin'
import { TableData } from './TableManager'
import { ColumnDef } from '../components/TableColumn'

export enum SortOrder { NONE, ASC, DESC }

export type TableSortOrder = () => SortOrder

export interface TableColumnSorter {
  order: TableSortOrder
  comparator?: (a: any, b: any) => number
}

export interface TableSorter {
  order: TableSortOrder
  selector: (rowData: any) => any
  comparator: (a: any, b: any) => number
}

const defaultComparator = (a: any, b: any) => {
  return _.eq(a, b) ? 0 : a < b ? -1 : 1
}

const numberComparator = (a: any, b: any) => {
  const [va, vb] = [_.toNumber(a), _.toNumber(b)]
  return va === vb ? 1 : _.lt(va, vb) ? -1 : 1
}

export class TableSortPlugin implements TablePlugin {
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

  constructor(options: {
    sorters?: TableSorter[]
    multiSortable?: boolean
  } = {}) {
    this.sorters = List(options.sorters)
    this.multiSortable = options.multiSortable
  }

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
      .filter(s => this.getSortOrder(s.order) !== SortOrder.NONE)

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
        const factor = order === SortOrder.DESC ? -1 : 1

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
      ? SortOrder.NONE
      : order() || SortOrder.NONE
  }
}

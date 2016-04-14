/**
 * This is designed as a plugin for the React DataTable component to
 * provide table-wide filter functionality. This plugin should also
 * compatible with most other components, such as List.
 *
 * How it works?
 *
 * Q: How to notify the plugin when the search term changes?
 *
 * 1. Store the updated search term in the table's parent;
 * 2. Specify the getTerm function to this plugin.
 *
 * so that when the state of the table's parent component is changed,
 * React will triger the whole component to rerender, then the table
 * data will be filtered with the updated search term which is returned
 * by the getTerm function.
 *
 * @providesModule FilterPlugin
 */

import * as _ from 'lodash'
import { List } from 'immutable'
import { TablePlugin, TableData, ColumnDef } from '../core'
import { FilterState } from './FilterState'

export interface FilterPredicate {
  (x: any, term: any): boolean
}

/**
 * The default function to compare each table row data with the given
 * search term.
 *
 * - If both sides are string type, it returns if the row data contains
 *   the given term, case insensitively;
 * - Otherwise, it returns if they are equivalent, we use lodash#eq to
 *   perform the comparison.
 */
const defaultPredicate = (x: any, term: any) => {
  if (typeof x === 'string' && typeof term === 'string') {
    return x.toLowerCase().indexOf(term.toLowerCase()) > -1
  }
  return _.eq(x, term)
}

export class FilterPlugin implements TablePlugin {
  /**
   * The function that returns the filter term. Commonly the filter
   * term will be stored in the parent component's state.
   */
  private term: () => any

  /**
   * The function that returns a boolean by comparing each table data
   * element with the given filter term. This is the place where you
   * can specify the custom filter function, otherwise the default
   * comparator will be used.
   */
  private predicate: FilterPredicate

  /**
   * Table filter state helper.
   */
  private filterState: FilterState

  constructor(options: {
    initTerm?: string
    predicate?: FilterPredicate
  } = {}) {
    this.filterState = new FilterState(this, options.initTerm)
    this.term = this.filterState.fnTerm
    this.predicate = options.predicate || defaultPredicate
  }

  get priority() { return 300 }

  get state() { return this.filterState }

  /**
   * Function that intented to be used by the table plugin manager to
   * perform the filter process. If the filter term is undefined or
   * is empty (see lodash#isEmpty), no filter operation will be performed.
   *
   * @param tableData The source data set to be filtered, recommended
   *                  to be immutable lazy sequence.
   * @param selector  The function to select the values in each table
   *                  row data to compare.
   */
  process(tableData: TableData, columns: List<ColumnDef>) {
    const term = this.term()
    const selector = rowData => columns.map(s => s.field(rowData))

    if (_.isUndefined(term) || _.isEmpty(term)) {
      return tableData // no filter
    }

    const predicate = v => this.predicate(v, term)
    const filtered = tableData.filter(rowData =>
      !selector(rowData).filter(predicate).isEmpty()
    )

    return filtered
  }
}

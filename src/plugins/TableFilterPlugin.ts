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
 * @providesModule TableFilterPlugin
 */

import * as _ from 'lodash'
import { Iterable, List } from 'immutable'
import { TablePlugin, TableData } from './TableManager'
import { ColumnDef } from '../components/TableColumn'

export interface TableFilterSelector {
  (rowData: any): Iterable<number, any>
}

export interface TableFilterPredicate {
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

export class TableFilterPlugin implements TablePlugin {
  constructor(
    private getTerm: () => any,
    private predicate = defaultPredicate
  ) {
    if (typeof this.getTerm === 'undefined') {
      throw new Error('[RCBOX] Expected getTerm function for filter plugin!')
    }
  }

  get priority() { return 300 }

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
    const term = this.getTerm()
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

/**
 * Returns an instance of table filter plugin.
 *
 * @param getTerm   The function that returns the filter term. Commonly
 *                  the filter term will be stored in the parent
 *                  component's state.
 * @param predicate The function that returns a boolean by comparing
 *                  each table data element with the given filter term.
 *                  This is the place where you can specify the custom
 *                  filter function, otherwise the default comparator
 *                  will be used.
 */
export function createTableFilterPlugin(settings: {
  getTerm: () => any
  predicate?: TableFilterPredicate
}) {
  return new TableFilterPlugin(
    settings.getTerm,
    settings.predicate
  )
}

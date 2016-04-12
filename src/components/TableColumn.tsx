import * as _ from 'lodash'
import * as React from 'react'

import { Component } from 'react'
import {
  TableColumnSorter,
  defaultTableColumnSorter,
} from '../plugins/TableSortPlugin'

export interface ColumnDef {
  /**
   * Header label for this column.
   */
  header: any

  /**
   * Function to read value from the source data.
   */
  field: (rowData: any) => any

  /**
   * If true, table column can be sorted. If multiple column sorting
   * is desired, enable multiSortable in TableSortPlugin. The default
   * value is false.
   *
   * NOTE: TableSortPlugin is required.
   */
  sortable?: TableColumnSorter

  /**
   * The data type of the column. The default value is String.
   */
  type?: ColumnType
}

const defaultColumnDef = {
  sortable: defaultTableColumnSorter,
  type: ColumnType.String,
}

export class Column extends Component<ColumnDef, any> {
  static __DataTableColumn__ = true

  render() {
    if ('development' === process.env.NODE_ENV) {
      throw new Error('<TableColumn /> should never be rendered!')
    }
    return null
  }
}

export function mapColumnDef(child: any): ColumnDef {
  if (!child.type.__DataTableColumn__) {
    throw new Error('DataTable: children should be <Column />')
  }
  return _.merge({}, defaultColumnDef, child.props)
}

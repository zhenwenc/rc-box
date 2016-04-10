import * as _ from 'lodash'
import * as React from 'react'
import { Component } from 'react'

export interface ColumnDef {
  /**
   * Header label for this column.
   */
  header: any

  /**
   * Function to read value from the source data.
   */
  field: (rowData: any) => any
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

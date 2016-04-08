import * as _ from 'lodash'
import * as React from 'react'

import { Component } from 'react'
import { Iterable, Seq, List } from 'immutable'

import {
  ColumnDef,
  mapColumnDef
} from './DataTableColumn'
import {
  renderTableHeader,
  renderTableRow,
  renderTable
} from '../renderers'

export interface TableColumnData {
  /**
   * Data for this table cell.
   */
  cellData: any

  /**
   * Definition object for this column.
   */
  columnDef: ColumnDef
}

export interface DataTableProps {

  /**
   * Source of data to render.
   * Recommented to use lazy sequence.
   */
  data: Seq<number, any> | any[]

  /**
   * Definition for each table column.
   *
   * Can we make this property type-safe?
   */
  children?: any

  /**
   * Renderer function for the final elements.
   */
  renderer?: {
    (
      headerColumn: JSX.Element,
      rowColumns: JSX.Element[]
    ): JSX.Element
  }

  /**
   * Renderer function for each row.
   */
  rowRenderer?: {
    (data: TableColumnData[], rowIndex: number): JSX.Element
  }

  /**
   * Renderer function for the table header columns.
   */
  headerRenderer?: {
    (data: TableColumnData[]): JSX.Element
  }

}

export class DataTable extends Component<DataTableProps, any> {
  private data: Seq<number, any>
  private columns: List<ColumnDef>

  constructor(props: DataTableProps) {
    super()
    this.data = (props.data instanceof Seq)
              ? props.data as Seq<number, any>
              : Seq(props.data)
    this.columns = List(React.Children
      .map(props.children, mapColumnDef))
  }

  get header() {
    const { headerRenderer } = this.props
    const renderer = headerRenderer || renderTableHeader
    const headerDataList = this.columns.map(columnDef => ({
      cellData: columnDef.header, columnDef,
    }))
    return renderer(headerDataList.toArray())
  }

  get rows() {
    const { rowRenderer } = this.props
    const renderer = rowRenderer || renderTableRow
    return this.data.map((rowData, rowIndex) => {
      const columnDataList = this.columns.map(columnDef => ({
        cellData: columnDef.field(rowData), columnDef,
      }))
      return renderer(columnDataList.toArray(), rowIndex)
    })
  }

  render() {
    const renderer = this.props.renderer || renderTable
    return renderer(this.header, this.rows.toArray())
  }

}

import * as React from 'react'

import {
  Table,
  TableHeaderColumn,
  TableRow,
  TableHeader,
  TableRowColumn,
  TableBody,
} from 'material-ui'

import { ColumnData, DataTableState } from '../core'
import { SortingOrder } from '../sorting'

const sortingImage = new Map([
  [SortingOrder.NONE, require('./images/sorting-both.png')],
  [SortingOrder.DESC, require('./images/sorting-desc.png')],
  [SortingOrder.ASC,  require('./images/sorting-asc.png')],
])

export module MuiTable {

  export const renderTableHeader = (
    data: ColumnData[]
  ) => (
    <TableRow>
    {data.map((headerData, index) => {
      const { cellData, columnDef } = headerData
      const { sortable, onHeaderTouch } = columnDef
      const order = sortable && sortable.order()

      const styles = {content: {
        cursor: !!sortable
          ? 'pointer'
          : 'auto',
        backgroundImage: typeof order !== 'undefined'
          ? `url('${sortingImage.get(order)}')`
          : undefined,
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
        textDecoration: 'none',
      }}

      return (
        <TableHeaderColumn key={`col-${index}`}>
          <div style={styles.content} onClick={onHeaderTouch}>
            {cellData}
          </div>
        </TableHeaderColumn>
      )
    })}
    </TableRow>
  )

  export const renderTableRow = (
    data: ColumnData[],
    rowIndex: number
  ) => (
    <TableRow key={rowIndex}>
    {data.map((columnData, index) => {
      const { cellData } = columnData
      return (
        <TableRowColumn key={`col-${index}`}>
          {cellData}
        </TableRowColumn>
      )
    })}
    </TableRow>
  )

  export const renderTable = (
    tableHeader: JSX.Element,
    tableRows: JSX.Element[],
    rendererProps: any,
    tableStates: DataTableState
  ) => (
    <Table selectable={false}>
      <TableHeader
        adjustForCheckbox={false}
        displaySelectAll={false}
        enableSelectAll={false}
      >
        {tableHeader}
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {tableRows}
      </TableBody>
    </Table>
  )

}

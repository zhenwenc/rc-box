import * as React from 'react'

import {
  Table,
  TableHeaderColumn,
  TableRow,
  TableHeader,
  TableRowColumn,
  TableBody,
} from 'material-ui'

import {
  ColumnData,
  DataTableState,
} from '../components'

export module MuiTable {

  export const renderTableHeader = (
    data: ColumnData[]
  ) => (
    <TableRow>
    {data.map((headerData, index) => {
      const { cellData } = headerData
      return (
        <TableHeaderColumn key={`col-${index}`}>
          {cellData}
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

  export const sortableHeader = (
    cellData: any, onSortChange: Function
  ) => (
    <div onClick={onSortChange}>{cellData}</div>
  )

}

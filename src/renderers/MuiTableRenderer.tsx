import * as React from 'react'

import {
  Table,
  TableHeaderColumn,
  TableRow,
  TableHeader,
  TableRowColumn,
  TableBody,
  CircularProgress,
} from 'material-ui'
import {
  TableColumnData,
  DataTableState,
} from '../components'

export function renderTableHeader(
  data: TableColumnData[]
) {
  return (
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
}

export function renderTableRow(
  data: TableColumnData[],
  rowIndex: number
) {
  return (
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
}

export function renderTable(
  tableHeader: JSX.Element,
  tableRows: JSX.Element[],
  rendererProps: any,
  tableStates: DataTableState
) {
  return (
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

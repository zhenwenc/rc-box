import * as React from 'react'

import { Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody } from 'material-ui'
import { TableColumnData } from './DataTable'

export function renderTableHeader(data: TableColumnData[]) {
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

export function renderTableRow(data: TableColumnData[], rowIndex: number) {
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

export function renderTable(headerColumns: JSX.Element, rowColumns: JSX.Element[]) {
  return (
    <Table selectable={false}>
      <TableHeader
        adjustForCheckbox={false}
        displaySelectAll={false}
        enableSelectAll={false}
      >
        {headerColumns}
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {rowColumns}
      </TableBody>
    </Table>
  )
}

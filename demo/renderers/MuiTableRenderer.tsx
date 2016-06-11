import * as React from 'react'

import {
  Table,
  TableHeaderColumn,
  TableRow,
  TableHeader,
  TableRowColumn,
  TableBody,
} from 'material-ui'

import { Iterable } from 'immutable'
import { ColumnData, SortingOrder } from '../../src'

const sortingImage = new Map([
  [SortingOrder.NONE, require('./images/sorting-both.png')],
  [SortingOrder.DESC, require('./images/sorting-desc.png')],
  [SortingOrder.ASC,  require('./images/sorting-asc.png')],
])

export const renderTableHeader = (
  data: Iterable<number, ColumnData>
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
  data: Iterable<number, ColumnData>,
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
  tableRows: Iterable<number, JSX.Element>
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

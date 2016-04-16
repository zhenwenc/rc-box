import * as _ from 'lodash'
import * as React from 'react'
import { Component } from 'react'
import { List } from 'immutable'

import {
  Divider,
} from 'material-ui'

import {
  DataTable,
  Column,
  ColumnData,
  FilterPlugin,
  PaginationPlugin,
  SortingPlugin,
  MuiTable,
} from '../src/index'

const tableRows = [
  {id: '1', name: 'John Smith', status: {content: 'Employed'}},
  {id: '3', name: 'Adam Moore', status: {content: 'Employed'}},
  {id: '4', name: 'Adam Moore', status: {content: 'Unemployed'}},
  {id: '2', name: 'Steve Brown', status: {content: 'Employed'}},
  {id: '5', name: 'Steve Brown', status: {content: 'Employed'}},
  {id: '6', name: 'Fake', status: {content: 'Employed'}},
  {id: '7', name: 'Fake', status: {content: 'Employed'}},
  {id: '8', name: 'Fake', status: {content: 'Employed'}},
  {id: '9', name: 'Fake', status: {content: 'Employed'}},
  {id: '10', name: 'Fake', status: {content: 'Employed'}},
  {id: '11', name: 'Fake', status: {content: 'Employed'}},
  {id: '12', name: 'Fake', status: {content: 'Employed'}},
  {id: '13', name: 'Fake', status: {content: 'Employed'}},
  {id: '14', name: 'Fake', status: {content: 'Employed'}},
  {id: '15', name: 'Fake', status: {content: 'Employed'}},
  {id: '16', name: 'Fake', status: {content: 'Employed'}},
]

export interface SampleTableState {
  pagination?: PaginationPlugin
  filter?: FilterPlugin
  sorting?: SortingPlugin
  [key: string]: any
}

export class SampleTable extends Component<{}, SampleTableState> {

  handleSearchChange = (event: React.FormEvent, term: string) => {
    this.state.filter.setTerm(term)
  }

  handlePageSizeChange = (_, index?, value?) => {
    this.state.pagination.setPageSize(value)
  }

  componentWillMount() {
    this.setState({
      pagination: new PaginationPlugin(),
      filter: new FilterPlugin(),
      sorting: new SortingPlugin({
        keys: ['id', 'name'],
      }),
    })
  }

  renderTable(
    headerData: List<ColumnData>,
    rowsData: List<List<ColumnData>>
  ) {
    const { pagination } = this.state

    return (
      <div>
        <MuiTable.Toolbar
          onSearchChange={this.handleSearchChange}
        />
        <Divider />
        {MuiTable.renderTable(
          MuiTable.renderTableHeader(headerData),
          rowsData.map(MuiTable.renderTableRow)
        )}
        <Divider />
        <MuiTable.Footer
          pageList={pagination.createPageList()}
          pageSizeList={pagination.createPageSizeList()}
          onPageSizeChange={this.handlePageSizeChange}
        />
      </div>
    )
  }

  render() {
    const { filter, sorting, pagination } = this.state

    return (
      <DataTable
        data={tableRows}
        plugins={[filter, sorting, pagination]}
        renderer={this.renderTable.bind(this)}
      >
        <Column
          header="ID"
          field={row => row.id}
          type="number"
          sortable={{order: sorting.fnGet('id')}}
          onHeaderTouch={() => this.state.sorting.next('id')}
        />
        <Column
          header="Name"
          field={row => row.name}
          sortable={{order: sorting.fnGet('name')}}
          onHeaderTouch={() => this.state.sorting.next('name')}
        />
        <Column
          header="Status"
          field={row => row.status.content}
        />
      </DataTable>
    )
  }
}

export default SampleTable

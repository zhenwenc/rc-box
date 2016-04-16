import * as _ from 'lodash'
import * as React from 'react'
import { Component } from 'react'

import {
  Divider,
} from 'material-ui'

import {
  DataTable,
  Column,
  TableToolbar,
  TableFooter,
  FilterPlugin,
  PaginationPlugin,
  SortingPlugin,
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
    this.setState(({ filter }) => ({
      filter: filter.setTerm(term)
    }))
  }

  handlePageChange(pageIndex: number) {
    return () => this.state.pagination.setPageIndex(pageIndex)
  }

  componentWillMount() {
    this.setState({
      pagination: new PaginationPlugin({ initDataSize: tableRows.length }),
      filter: new FilterPlugin(),
      sorting: new SortingPlugin({ keys: ['id', 'name'] }),
    })
  }

  render() {
    const { filter, sorting, pagination } = this.state

    return (
      <div>
        <TableToolbar onSearchChange={this.handleSearchChange} />
        <Divider />
        <DataTable
          data={tableRows}
          plugins={[filter, sorting, pagination]}
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
        <Divider />
        <TableFooter pages={pagination.createPageNavigations()} />
      </div>
    )
  }
}

export default SampleTable

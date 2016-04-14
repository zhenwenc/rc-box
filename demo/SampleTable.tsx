import * as React from 'react'
import { Component } from 'react'

import {
  Divider,
} from 'material-ui'

import {
  DataTable,
  Column,
  TablePlugin,
  TableToolbar,
  TableFooter,
  FilterPlugin,
  PaginationPlugin,
  TableSortPlugin,
  SortingState,
  PaginationState,
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
  filterTerm?: string
  sortColumn?: SortingState
  pagination?: PaginationState
  plugins?: TablePlugin[]
}

export class SampleTable extends Component<{}, SampleTableState> {

  handleSearchChange(event: React.FormEvent, term: string) {
    this.setState({
      filterTerm: term,
    })
  }

  handleSortChange(key: string) {
    return (event: React.TouchEvent) => {
      this.setState(({ sortColumn }) => ({
        sortColumn: sortColumn.next(key),
      }))
    }
  }

  componentWillMount() {
    const sortingState = new SortingState(['id', 'name'])
    const paginationState = new PaginationState({
      fnTableSize: () => tableRows.length
    })

    const plugins = [
      new FilterPlugin({
        term: () => this.state.filterTerm,
      }),
      new PaginationPlugin(() => this.state.pagination),
      new TableSortPlugin(),
    ]

    this.setState({
      filterTerm: '',
      sortColumn: sortingState,
      pagination: paginationState,
      plugins: plugins,
    })
  }

  render() {
    const { sortColumn, plugins } = this.state

    return (
      <div>
        <TableToolbar onSearchChange={this.handleSearchChange.bind(this)} />
        <Divider />
        <DataTable data={tableRows} plugins={plugins}>
          <Column
            header="ID"
            field={row => row.id}
            type="number"
            sortable={{order: sortColumn.getFn('id')}}
            onHeaderTouch={this.handleSortChange('id')}
          />
          <Column
            header="Name"
            field={row => row.name}
            sortable={{order: sortColumn.getFn('name')}}
            onHeaderTouch={this.handleSortChange('name')}
          />
          <Column
            header="Status"
            field={row => row.status.content}
          />
        </DataTable>
        <Divider />
        <TableFooter />
      </div>
    )
  }
}

export default SampleTable

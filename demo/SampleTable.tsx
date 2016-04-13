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
  TableFilterPlugin,
  TableSortPlugin,
  SortingState,
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
}

export class SampleTable extends Component<{}, SampleTableState> {

  plugins = [
    new TableFilterPlugin({
      term: () => this.state.filterTerm,
    }),
    new TableSortPlugin()
  ]

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
    this.setState({
      filterTerm: '',
      sortColumn: new SortingState(['id', 'name'])
    })
  }

  render() {
    return (
      <div>
        <TableToolbar onSearchChange={this.handleSearchChange.bind(this)} />
        <Divider />
        <DataTable data={tableRows} plugins={this.plugins}>
          <Column
            header="ID"
            field={row => row.id}
            type="number"
            sortable={{order: () =>  this.state.sortColumn.get('id')}}
            onHeaderTouch={this.handleSortChange('id')}
          />
          <Column
            header="Name"
            field={row => row.name}
            sortable={{order: () => this.state.sortColumn.get('name')}}
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

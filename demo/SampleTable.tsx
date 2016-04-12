import * as React from 'react'
import { Component } from 'react'
import { Map, List } from 'immutable'

import {
  Divider,
} from 'material-ui'

import {
  DataTable,
  Column,
  TableToolbar,
  TableFilterPlugin,
  TableSortPlugin,
  SortOrder,
  MuiTable,
} from '../src/index'

const { sortableHeader } = MuiTable

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
  sortColumn?: Map<string, SortOrder>
}

export class SampleTable extends Component<{}, SampleTableState> {

  handleSearchChange = (event: React.FormEvent, term: string) => {
    this.setState({ filterTerm: term })
  }

  plugins = [
    new TableFilterPlugin({
      readTerm: () => this.state.filterTerm,
    }),
    new TableSortPlugin()
  ]

  handleSortChange(key: string) {
    return (event: React.TouchEvent) => {
      console.log('yo! touched!');
      this.setState(({ sortColumn }) => ({
        sortColumn: sortColumn.set(key, sortColumn.get(key) === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC),
      }))
    }
  }

  componentWillMount() {
    this.setState({
      filterTerm: '',
      sortColumn: Map({
        'id': SortOrder.NONE,
        'name:': SortOrder.NONE,
        'status': SortOrder.NONE,
      }),
    })
  }

  render() {
    return (
      <div>
        <TableToolbar onSearchChange={this.handleSearchChange} />
        <Divider />
        <DataTable data={tableRows} plugins={this.plugins}>
          <Column
            header={sortableHeader('ID', this.handleSortChange('id'))}
            field={row => row.id}
            type={'number'}
            sortable={{
              order: () => this.state.sortColumn.get('id'),
            }}
          />
          <Column
            header={sortableHeader('Name', this.handleSortChange('name'))}
            field={row => row.name}
          />
          <Column
            header={sortableHeader('Status', this.handleSortChange('status'))}
            field={row => row.status.content}
          />
        </DataTable>
      </div>
    )
  }
}

export default SampleTable

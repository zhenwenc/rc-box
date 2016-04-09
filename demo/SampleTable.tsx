import * as React from 'react'
import { Component } from 'react'

import {
  Divider,
} from 'material-ui'

import {
  DataTable,
  Column,
  TableFilterPlugin,
  TableToolbar,
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

export class SampleTable extends Component<any, any> {

  handleSearchChange = (event: React.FormEvent, term: string) => {
    this.setState({ filterTable: term })
  }

  getTerm = () => {
    return this.state.filterTable
  }

  plugins = [
    new TableFilterPlugin(this.getTerm)
  ]

  componentWillMount() {
    this.setState({
      filterTable: '',
    })
  }

  render() {
    return (
      <div>
        <TableToolbar onSearchChange={this.handleSearchChange} />
        <Divider />
        <DataTable data={tableRows} plugins={this.plugins}>
          <Column header="ID" field={row => row.id} />
          <Column header="Name" field={row => row.name} />
          <Column header="Status" field={row => row.status.content} />
        </DataTable>
      </div>
    )
  }
}

export default SampleTable

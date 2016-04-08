import * as React from 'react'
import { Component } from 'react'

import { DataTable, Column } from '../src/index'

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
  render() {
    return (
      <DataTable data={tableRows}>
        <Column header="ID" field={row => row.id} />
        <Column header="Name" field={row => row.name} />
        <Column header="Status" field={row => row.status.content} />
      </DataTable>
    )
  }
}

export default SampleTable

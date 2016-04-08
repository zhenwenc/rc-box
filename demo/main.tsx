import * as React from 'react'
import * as ReactDOM from 'react-dom'

// NOTE: react-material required plugin, remove in the future
import injectTapEventPlugin = require('react-tap-event-plugin')
injectTapEventPlugin()

import { Component } from 'react'
import { AppBar, Paper } from 'material-ui'

import { SampleTable } from './SampleTable'

class App extends Component<any, any> {
  render() {
    return (
      <div>
        <AppBar title="RC-Box Demo" showMenuIconButton={false} />
        <Table />
      </div>
    )
  }
}

class Table extends Component<any, any> {
  render() {
    return (
      <div style={{margin: '48px 72px'}}>
        <Paper style={{backgroundColor: '#ffffff'}} rounded={true}>
          <SampleTable />
        </Paper>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('content'))

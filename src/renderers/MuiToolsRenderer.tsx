import * as React from 'react'

import { Component } from 'react'
import {
  GridList,
  TextField,
} from 'material-ui'

export interface TableToolbarProps {
  /**
   * Callback function that is fired when the search textfield'search
   * value changes.
   */
  onSearchChange: {
    (event: React.FormEvent, term?: string): void
  }
}

export class TableToolbar extends Component<TableToolbarProps, any> {

  get styles() {
    return {
      base: {
        display: 'flex',
        flexWrap: 'wrap',
        height: 'auto',
        borderRadius: '0 0 2px 0',
        padding: '5px 24px 5px',
      },
      filterContainer: {
        textAlign: 'right',
      },
      filter: {

      },
    }
  }

  render() {
    const { onSearchChange } = this.props

    return (
      <GridList cols={2} cellHeight={40} style={this.styles.base}>
        <div />
        <div style={this.styles.filterContainer}>
          <TextField onChange={onSearchChange} style={this.styles.filter} hintText="Filter" />
        </div>
      </GridList>
    )
  }
}

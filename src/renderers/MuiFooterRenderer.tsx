import * as React from 'react'
import { Component } from 'react'
import {
  GridList,
  RaisedButton,
  SelectField,
  MenuItem,
} from 'material-ui'

export interface TableFooterProps {

}

export class TableFooter extends Component<TableFooterProps, any> {

  get styles() {
    return {
      base: {
        display: 'flex',
        flexWrap: 'wrap',
        textAlign: 'right',
        height: 'auto',
        borderRadius: '0 0 2px 0',
        padding: '10px 24px 5px',
      },
      pageLength: {
        container: {
          textAlign: 'left',
        },
        select: {
          width: 128,
        },
      },
      pageNumber: {
        container: {
          textAlign: 'right',
        },
        button: {
          minWidth: 16,
          marginLeft: 1
        }
      }
    }
  }

  render() {
    return (
      <GridList cols={2} cellHeight={40} style={this.styles.base}>
        <div style={this.styles.pageLength.container}>
          <SelectField style={this.styles.pageLength.select} value="10">
            <MenuItem value={10} primaryText="10" />
            <MenuItem value={20} primaryText="20" />
            <MenuItem value={30} primaryText="30" />
          </SelectField>
        </div>
        <div style={this.styles.pageNumber.container}>
          <RaisedButton style={this.styles.pageNumber.button} label="1" />
          <RaisedButton style={this.styles.pageNumber.button} label="2" />
          <RaisedButton style={this.styles.pageNumber.button} label="3" />
          <RaisedButton style={this.styles.pageNumber.button} label="4" />
          <RaisedButton style={this.styles.pageNumber.button} label="5" />
        </div>
      </GridList>
    )
  }

}

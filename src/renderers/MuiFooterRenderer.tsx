import * as React from 'react'
import { Component } from 'react'
import { Iterable } from 'immutable'

import {
  GridList,
  RaisedButton,
  SelectField,
  MenuItem,
} from 'material-ui'


export interface FooterProps {
  pages: Iterable<number, {
    key: any,
    active: boolean,
    handleTouch: React.TouchEventHandler
  }>
}

export class Footer extends Component<FooterProps, any> {
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
          <SelectField autoWidth={true} style={this.styles.pageLength.select} value={10}>
            <MenuItem value={10} primaryText="10 Rows" />
            <MenuItem value={20} primaryText="20 Rows" />
            <MenuItem value={30} primaryText="30 Rows" />
          </SelectField>
        </div>
        <div style={this.styles.pageNumber.container}>
        {this.props.pages.map(page => (
          <RaisedButton
            key={page.key}
            style={this.styles.pageNumber.button}
            label={page.key}
            disabled={page.active}
            onTouchTap={page.handleTouch}
          />
        ))}
        </div>
      </GridList>
    )
  }
}

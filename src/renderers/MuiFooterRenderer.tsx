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
  pageList: Iterable<number, {
    key: any,
    active: boolean,
    handler: React.TouchEventHandler
  }>,
  pageSizeList: Iterable<number, {
    value: number,
    label: any,
    active: boolean,
  }>,
  onPageSizeChange: React.TouchEventHandler
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
    const { pageList, pageSizeList, onPageSizeChange } = this.props
    const pageSize = pageSizeList.find(x => x.active)

    return (
      <GridList cols={2} cellHeight={40} style={this.styles.base}>
        <div style={this.styles.pageLength.container}>
          <SelectField
            autoWidth={true}
            style={this.styles.pageLength.select}
            value={pageSize && pageSize.value}
            onChange={onPageSizeChange}
          >
          {pageSizeList.map((pageSize, index) => (
            <MenuItem
              key={index}
              value={pageSize.value}
              primaryText={pageSize.label}
            />
          ))}
          </SelectField>
        </div>
        <div style={this.styles.pageNumber.container}>
        {pageList.map((page, index) => (
          <RaisedButton
            key={index}
            style={this.styles.pageNumber.button}
            label={page.key}
            disabled={page.active}
            onTouchTap={page.handler}
          />
        ))}
        </div>
      </GridList>
    )
  }
}

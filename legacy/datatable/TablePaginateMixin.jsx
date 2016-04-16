/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  * 
  * @providesModule TablePaginateMixin
  */

'use strict'

var React = require('react')
var ClassNames = require('classnames')

var MixinTypeKey = 'TablePaginateMixin'

module.exports = function(srcRowsKey, destRowsKey, options) {

  if (typeof srcRowsKey !== 'string') {
    throw new TypeError('Illegal source rows state key: ' + srcRowsKey)
  }

  if (typeof destRowsKey === 'undefined') {
    destRowsKey = 'pagedRows'
  }

  var { PerPage } = Object.assign({

    /**
     * A list of row count per page options
     */
    PerPage: ['10', '25', '50', '100', 'All'],

  }, options)

  return {

    getInitialState: function() {
      var newState = {
        pageInfo: {
          current: 1, // current page number, start from 1
          perPage: Number(PerPage[0]) || Number.MAX_VALUE,
        },
      }
      newState[destRowsKey] = null
      return newState
    },

    componentWillMount: function() {
      var manager = this.state.tableManager
      if (typeof manager === 'undefined') {
        this.updatePagedRows()
      }
    },

    updatePagedRows(/*number*/ pageNumber) {

      this.setState(function(prevState, prevProps) {

        const info = prevState.pageInfo
        
        if (typeof pageNumber === 'undefined') {
          pageNumber = info.current
        }

        if (!Number.isInteger(pageNumber)) {
          throw new Error('Invalid number format: ' + pageNumber)
        }

        const srcRows   = prevState[srcRowsKey]
        const pageTotal = parseInt(srcRows.length / info.perPage) + 1
        const pageIndex = Math.min(Number.parseInt(pageNumber), pageTotal)

        const offset   = info.perPage * (pageIndex - 1)
        const destRows = Array.isArray(srcRows) 
                       ? srcRows.slice(offset, offset + info.perPage) 
                       : []

        var newState = {
          pageInfo: Object.assign(info, {
            current: pageNumber,
          }),
        }
        newState[destRowsKey] = destRows

        return newState
      })

      // Notify updated to table manager if there is any
      var manager = this.state.tableManager
      if (typeof manager !== 'undefined') {
        manager.notifyUpdated(this, MixinTypeKey)
      }
    },

    _handlePaginationChange(/*number*/ nextPage) {
      this.updatePagedRows(nextPage)
    },

    _handlePaginationLengthChange(/*number*/ newPerPage) {
      this.setState({
        pageInfo: Object.assign(this.state.pageInfo, {
          perPage: Number(newPerPage) || Number.MAX_VALUE,
        }),
      })
      this.updatePagedRows()
    },

    _renderPaginationListItem(/*string*/ label, /*number*/ nextPage, /*any*/ itemClass) {
      return (
        <li key={label} className={ClassNames(itemClass)}>
          <a onClick={this._handlePaginationChange.bind(null, nextPage)}>
            {label}
          </a>
        </li>
      )
    },

    /**
     * Returns the React component for displaying the pagination
     * available page list for navigating between pages.
     *
     * @param {String} listClass The style class for the list
     * @param {Number} available Number of available pages
     */
    renderPaginationList(/*string*/ listClass, /*number*/ available) {

      const count = this.state[srcRowsKey].length
      const info  = this.state.pageInfo
      const min   = 1
      const max   = Math.floor(count / info.perPage) + 1
      const ava   = available || 2 // availables on each side

      var current = Math.max(Math.min(info.current, max), min)
      var x1, x2

      if (current < min + ava) {
        x1 = min
        x2 = Math.min(max, min + ava * 2)
      } else if (current > max - ava) {
        x1 = Math.max(max - ava * 2, min)
        x2 = max
      } else {
        x1 = Math.max(min, current - ava)
        x2 = Math.min(current + ava, max)
      }

      return (
        <ul className={ClassNames('nc-pagination', listClass)}>

          {this._renderPaginationListItem('<<', min, {disabled: current === min})}
          {this._renderPaginationListItem('<', current - 1, {disabled: current === min})}

          {Array.apply(null, {length: x2 - x1 + 1}).map(Number.call, d => d + x1).map(d => {
            return this._renderPaginationListItem(d, d, {active: d === current})
          })}

          {this._renderPaginationListItem('>', current + 1, {disabled: current === max})}
          {this._renderPaginationListItem('>>', max, {disabled: current === max})}

        </ul>
      )
    },

    _renderPaginationLengthToggle(/*string*/ buttonClass) {

      const info = this.state.pageInfo
      const text = info.perPage < Number.MAX_VALUE ? info.perPage : 'All'

      return (
        <button className={ClassNames('dropdown-toggle', buttonClass)} data-toggle={'dropdown'}>
          <span>{text}</span>
          <span className={'caret'}/>
        </button>
      )
    },

    _renderPaginationLengthList(/*string*/ listClass) {

      var current = this.state.pageInfo.perPage

      return (
        <ul className={ClassNames('dropdown-menu', listClass)}>
          {PerPage.map(val => {
            var numValue = Number(val) || Number.MAX_VALUE
            return (
              <li key={val} className={ClassNames({ active : numValue === current })}>
                <a onClick={this._handlePaginationLengthChange.bind(null, val)}>{val}</a>
              </li>
            )
          })}
        </ul>
      )
    },

    _renderPaginationLengthDropdown(/*string*/ dropdownClass) {
      return (
        <span className={ClassNames('btn-group dropup', dropdownClass)}>
          {this._renderPaginationLengthToggle('btn btn-default')}
          {this._renderPaginationLengthList()}
        </span>
      )
    },

    /**
     * Returns the React component to display the current pagination
     * detail. The output will looks like:
     *
     *  Showing x to y of z rows (n) records per page
     * 
     * @param  {String} containerClass The style class for container
     */
    renderPaginationDetail(/*string*/ containerClass) {

      const count   = this.state[srcRowsKey].length
      const info    = this.state.pageInfo
      const total   = parseInt(count / info.perPage) + 1
      const current = Math.min(info.current, total)
      const start   = info.perPage * (current - 1) + 1
      const end     = start + Math.min(count - start, info.perPage) - 1

      return (
        <div className={ClassNames('nc-pagination-detail', containerClass)}>

          <span className={'pagination-info'}>
            {'Showing ' + start + ' to ' + end + ' of ' + count + ' rows'}
          </span>

          <span className={'pagination-length'}>
            {this._renderPaginationLengthDropdown()}
            {' records per page'}
          </span>

        </div>
      )
    },

  }
}

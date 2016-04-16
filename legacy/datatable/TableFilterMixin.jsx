/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  * 
  * This is designed as a plug-in for the React Data Table that provides
  * table rows filter functionality. This plug-in also compatible
  * with Facebook fixed-data-table module.
  *
  * NOTE: the original rows data won't be changed by this plug-in.
  *
  * Usage of this plug-in:
  *
  * #1: Mix DataTableFilterMixin into your React component:
  *       var YourTable = React.createClass({
  *         mixins: [TableFilterMixin(srcRowsKey, destRowsKey)]
  *       })
  * 
  * #2: Use this.renderFilterInput function to render the header
  *     for each column of your table.
  *
  * == State ==================================================================
  *
  * {filterText}      - The current text to filter with.
  *
  * {filteredRows}    - The filtered result rows.
  *
  * == Options ================================================================
  *
  * {fnTableFilter}   - Specify custom filter function for specific columns by
  *                     defining fnTableFilter field on your React component,
  *                     where it can be an object of form:
  *
  *                       { <cell-key> : <filter-function> },
  *                     
  *                     or a function of form:
  *
  *                       function(string:cellKey) : <filter-function> or null
  *
  *                     The returned filter function must in the form
  *
  *                       function (data:object, filterText:string) : boolean
  *
  *                     where <data> is the value to be checked:
  *
  *                       data <= rowData[filterCellKey].
  *
  * {filterCellKeys}  - Specify custom range of cell data to filter by defining
  *                     filterCellKeys field on your React component, where it
  *                     can be an array cell keys or a function of form:
  *                     
  *                       function() : array of cell keys
  *                     
  *                     only the returned cell keys are been considered when
  *                     performing the filter function. By default, all cell 
  *                     keys are been considered, but only the cell data with 
  *                     non-object type will be used to filter.
  *
  * == Methods ================================================================
  *
  * {filterRows}        - Manually trigger the filter with the given text.
  *
  *                       @param {string} filterText text to filter
  *
  * {renderFilterInput} - Returns a input component which can be used to trigger
  *                       the filter function on input.
  *
  *                       @param {object} inputProps properties for the element
  * 
  * ===========================================================================
  * 
  * @providesModule DataTableFilterMixin
  */

'use strict'

var React = require('react')

var MixinTypeKey = 'TableFilterMixin'

module.exports = function(srcRowsKey, destRowsKey) {

  if (typeof srcRowsKey !== 'string') {
    throw new TypeError('Illegal source rows state key: ' + srcRowsKey)
  }

  if (typeof destRowsKey === 'undefined') {
    destRowsKey = 'filteredRows'
  }

  return {

    getInitialState: function() {
      var newState = { filterText: null }
      newState[destRowsKey] = null
      return newState
    },

    componentWillMount: function() {
      var manager = this.state.tableManager
      if (typeof manager === 'undefined') {
        this.filterRows(this.state.filterText)
      }
    },

    /**
     * Note:  This function allows specific columns to be filtered
     *        by custom defined functions.
     * Usage: define fnTableFilter: { <cellKey>:<filter function> }.
     */
    _getFnFilter(/*string*/ filterCellKey) {
      if (typeof this.fnTableFilter === 'object') {
        return this.fnTableFilter[filterCellKey]
      }
      if (typeof this.fnTableFilter === 'function') {
        return this.fnTableFilter.call(filterCellKey, filterCellKey)
      }
      return null
    },

    _isDoFilter(/*string*/ filterCellKey) {
      if (typeof this.filterCellKeys === 'object') {
        return this.filterCellKeys.indexOf(filterCellKey) > -1
      }
      if (typeof this.filterCellKeys === 'function') {
        var cellKeys = this.filterCellKeys.call(null)
        if (typeof cellKeys !== 'array') {
          return !console.warn('Unexpected filter keys.')
        }
        return cellKeys.indexOf(filterCellKey) > -1
      }
      return true
    },

    _filterRows(/*array*/ array, /*string*/ filterText) {

      // Return the shadow copy of the original array if the filter
      // text is empty.
      if (!filterText || filterText.trim().length === 0) {
        return array.slice()
      }

      var that = this

      return array.filter(function(row) {
        return undefined !== Object.keys(row).find(key => {

          if (!that._isDoFilter(key)) return false
          if (typeof row[key] === 'undefined') return false

          var fnFilter = that._getFnFilter(key) || function(a, b) {
            if (!a || !b) return false
            if (typeof a === 'object') return false
            if (typeof b === 'object') return false
            var sa = a.toString().toLowerCase()
            var sb = b.toString().toLowerCase()
            return sa.indexOf(sb) >= 0
          }

          return fnFilter.call(null, row[key], filterText)
        })
      })
    },

    filterRows(/*string*/ filterText) {

      this.setState(function(prevState, prevProps) {

        if (typeof filterText === 'undefined') {
          filterText = prevState.filterText
        }

        if (typeof prevState[srcRowsKey] !== 'object') {
          throw new TypeError('Expects "' + srcRowsKey + '" state.')
        }
        if (filterText && typeof filterText !== 'string') {
          throw new TypeError('Invalid type: filterText.')
        }

        var newState = { filterText: filterText }
        newState[destRowsKey] = this._filterRows(prevState[srcRowsKey], filterText)
        return newState
      })

      // Notify updated to table manager if there is any
      var manager = this.state.tableManager
      if (typeof manager !== 'undefined') {
        manager.notifyUpdated(this, MixinTypeKey)
      }
    },

    _handleFilterChange(/*object*/ event) {
      this.filterRows(event.target.value)
    },

    renderFilterInput(/*object*/ inputProps) {
      var props = Object.assign({
        type       : 'text',
        placeholder: 'Search',
      }, inputProps || {})
      return (
        <input {...props} onInput={this._handleFilterChange}/>
      )
    },

  }
}

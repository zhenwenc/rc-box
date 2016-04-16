/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  * 
  * This is designed as a plug-in for the React Data Table that provides
  * single column table sorting functionality. This plug-in also compatible
  * with Facebook fixed-data-table module.
  *
  * Usage of this plug-in:
  *
  * #1: Mix DataTableSortMixin into your React component:
  *       var YourTable = React.createClass({
  *         mixins: [TableSortMixin(srcRowsKey, destRowsKey)]
  *       })
  * 
  * #2: Use this.renderSortLink function to render the header
  *     for each column of your table.
  *
  * == Variables ==============================================================
  *
  * {SortTypes}      - The set of sorting type.
  *
  * == State ==================================================================
  *
  * {sortType}       - The current sorting type.
  *
  * {sortCellKey}    - The current sorting field key.
  *
  * == Options ================================================================
  *
  * {fnTableSort}    - Specify custom sorting function for specific columns by
  *                    defining a fnTableSort field on your React component, 
  *                    where it can be an object of form:
  *
  *                       { <cell-key> : <sort-function> },
  *                    
  *                    or a function of form:
  *
  *                       function(string:cellKey) : <sort-function> or null
  *                    
  *                    The returned <sort-function> must in the form
  *
  *                       function(a:object, b:object) : integer
  *
  *                    where <a> and <b> are the pair of data to compare:
  *
  *                       a <= rowData[sortCellKey].
  *                    
  * == Methods ================================================================
  *
  * {sortRows}       - Manually trigger the sorting on the given cell key with 
  *                    the given sort type.
  *                    
  *                    @param {string}   sortCellKey the data field to be sorted
  *                    @param {SortType} sortType    the sorting type
  *
  * {renderSortLink} - Returns a link component which can be used to trigger
  *                    the sorting function on click.
  *
  *                    @param {any}    label       label of the column header
  *                    @param {string} sortCellKey cell key of the data to sort
  * 
  * ===========================================================================
  * 
  * @providesModule DataTableSortMixin
  */

'use strict'

var React = require('react')

var MixinTypeKey = 'TableSortMixin'

var SortTypes = {
  ASC : {className: 'sortable asc'},
  DESC: {className: 'sortable desc'},
  NONE: {className: 'sortable both'},
}

function fnCompareString(a, b) {
  var sa = a.toString()
  var sb = b.toString()
  if (sa < sb) return -1
  if (sa > sb) return +1
  return 0
}

function fnCompareNumber(a, b) {
  var na = Number(a)
  var nb = Number(b)
  if (na < nb) return -1
  if (na > nb) return +1
  return 0
}

module.exports = function(srcRowsKey, destRowsKey) {

  if (typeof srcRowsKey !== 'string') {
    throw new TypeError('Illegal source rows state key: ' + srcRowsKey)
  }

  if (typeof destRowsKey === 'undefined') {
    destRowsKey = srcRowsKey
  }

  return {

    getInitialState: function() {
      var newState = {
        sortCellKey: undefined,
        sortType: SortTypes.NONE,
      }
      if (srcRowsKey !== destRowsKey) {
        newState[destRowsKey] = null
      }
      return newState
    },

    componentWillMount: function() {
      var manager = this.state.tableManager
      if (typeof manager === 'undefined') {
        this.sortRows()
      }
    },

    SortTypes: SortTypes,

    /**
     * Note:  This function allows specific columns to be sorted
     *        by custom defined functions.
     * Usage: define fnTableSort: { <sortCellKey>:<sort function> }.
     */
    _getFnSort(/*string*/ sortCellKey) {
      if (typeof this.fnTableSort === 'object') {
        return this.fnTableSort[sortCellKey]
      }
      if (typeof this.fnTableSort === 'function') {
        return this.fnTableSort.call(sortCellKey, sortCellKey)
      }
      return null
    },

    _sortRows(/*array*/ array, /*string*/ sortCellKey, /*object*/ sortType) {

      var fnCompare = this._getFnSort(sortCellKey) || function(a, b) {
        if (!isNaN(a) && !isNaN(b)) return fnCompareNumber(a, b)
        else return fnCompareString(a, b)
      }

      array.sort(function(u, v) {
        var val = fnCompare.call(null, u[sortCellKey], v[sortCellKey])
        return sortType === SortTypes.ASC ? val : val * -1
      })

      return array
    },

    sortRows(/*string*/ sortCellKey, /*object*/ sortType) {

      this.setState(function(prevState, prevProps) {

        // Apply current value if parameter not set
        if (typeof sortCellKey === 'undefined') {
          sortCellKey = prevState.sortCellKey
        }
        if (typeof sortType === 'undefined') {
          sortType = prevState.sortType
        }

        if (typeof prevState[srcRowsKey] !== 'object') {
          throw new TypeError('Expects "' + srcRowsKey + '" state.')
        }
        if (sortCellKey && typeof sortCellKey !== 'string') {
          throw new TypeError('Invalid type: sortCellKey.')
        }
        if (typeof sortType === 'undefined') {
          throw new TypeError('Unknown sort type: ' + sortType)
        }

        var srcRows  = prevState[srcRowsKey]
        var destRows = srcRows

        if (typeof sortCellKey !== 'undefined' && srcRows) {
          destRows = this._sortRows(srcRows, sortCellKey, sortType)
        }

        var newState = {
          sortType    : sortType,
          sortCellKey : sortCellKey,
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

    _getSortTypeForColumn(/*string*/ sortCellKey) {
      return (this.state.sortCellKey === sortCellKey) ? this.state.sortType : SortTypes.NONE
    },

    _handleSortClick(/*string*/ sortCellKey) {
      var sortType = this._getSortTypeForColumn(sortCellKey)
      var nextType = (sortType === SortTypes.ASC) ? SortTypes.DESC : SortTypes.ASC
      this.sortRows(sortCellKey, nextType)
    },

    renderSortLink(/*string*/ label, /*string*/ sortCellKey) {
      var sortType = this._getSortTypeForColumn(sortCellKey)
      return (
        <a onClick={this._handleSortClick.bind(null, sortCellKey)}
          className={sortType.className}>
          {label}
        </a>
      )
    },

  }

}

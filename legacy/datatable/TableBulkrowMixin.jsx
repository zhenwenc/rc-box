/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  * 
  * @providesModule TablePaginateMixin
  */

'use strict'

var React = require('react')
var ClassNames = require('classnames')

var MixinTypeKey = 'TableBulkrowMixin'

module.exports = function(srcRowsKey, destRowsKey, options) {

  if (typeof srcRowsKey !== 'string') {
    throw new TypeError('Illegal source rows state key: ' + srcRowsKey)
  }

  if (typeof destRowsKey === 'undefined') {
    destRowsKey = srcRowsKey
  }

  return {

    getInitialState: function() {
      var newState = {/* No extra state */}
      if (srcRowsKey !== destRowsKey) {
        newState[destRowsKey] = null
      }
      return newState
    },

    componentWillMount: function() {
      var manager = this.state.tableManager
      if (typeof manager === 'undefined') {
        this.updateBulkRows()
      }
    },

    updateBulkRows() {

      this.setState(function(prevState, prevProps) {
        const rows     = prevState[srcRowsKey]
        const newState = {}
        newState[destRowsKey] = rows
        return newState
      })

      // Notify updated to table manager if there is any
      var manager = this.state.tableManager
      if (typeof manager !== 'undefined') {
        manager.notifyUpdated(this, MixinTypeKey)
      }
    },

    _updateBulkrowCheckedState(/*object*/ changedRow, /*boolean*/ checked) {

      if (typeof changedRow !== 'object') {
        throw new TypeError('Unexpected row object.')
      }

      changedRow._CHECKED = !!checked
      this.updateBulkRows()
    },

    /**
     * Function that checks if the given row is selected.
     * @param  {Object}  row Row object to check.
     * @return {Boolean}     True if the row is selected with the logic
     *                            of this mixin.
     */
    isRowSelected(/*object*/ row) {

      if (typeof row !== 'object') {
        throw new TypeError('Unexpected row object.')
      }

      return !!row._CHECKED
    },

    /**
     * Returns a React component which is binded a click event to
     * control the selected (bulk) rows. 
     * 
     * The typical usage is to render a button to delete selected rows.
     *
     * @param {Object} params Options: {
     * 
     *   component:  {String}    The component to render, this can be any
     *                           component type. Default: <button>.
     *
     *   props:      {Object}    Custom properties for the component.
     *
     *   children:   {Object}    The children of this component. This can
     *                           be either a single object or an array of
     *                           objects.
     *
     *   rowsGetter: {Function}  A function that returns the list of current
     *                           visible row objects.
     *
     *   onClick:    {Function}  The event handler while the component has
     *                           been clicked. The callback function takes
     *                           two parameters:
     *                             - the click event
     *                             - the array of selected rows.
     * }
     */
    renderBulkrowControl(/*object*/ params) {

      var { 
        component, 
        props, 
        children, 
        rowsGetter, 
        onClick,
      } = Object.assign({
        component: 'button',
      }, params)

      if (typeof component !== 'string') {
        throw new TypeError('Expecting string component type.')
      }

      if (typeof rowsGetter !== 'function') {
        throw new TypeError('Expecting rows getter function.')
      }

      if (typeof onClick !== 'function') {
        throw new TypeError('Expecting onClick function.')
      }

      function onClickHandler(e) {
        var rows = rowsGetter.call(null)
        if (!Array.isArray(rows)) {
          throw new Error('Unexpected rows array.')
        }

        var selected = rows.filter(this.isRowSelected)
        onClick.call(this, e, selected)
      }

      props = Object.assign({}, props, {
        onClick: onClickHandler.bind(this),
      })

      return React.createElement(
        component, props, children
      )
    },

    renderBulkrowCheckSingle(/*any*/ thisRow, /*string*/ checkboxClass) {

      var rows = this.state[srcRowsKey]
      var row  = undefined

      switch (typeof thisRow) {
        case 'object': row = thisRow; break
        case 'function': row = rows.find(thisRow); break
        default: throw new TypeError('Illegal checked row reference.')
      }

      if (typeof row !== 'object') {
        throw new TypeError('Unexpected row object.')
      }

      function handleCheckboxChange(e) {
        this._updateBulkrowCheckedState(row, !!e.target.checked)
      }

      return (
        <input 
          type="checkbox"
          name="nc-select"
          checked={!!row._CHECKED}
          onChange={handleCheckboxChange.bind(this)}
          className={ClassNames(checkboxClass)}/>
      )
    },

    renderBulkrowCheckAll(/*string*/ checkboxClass) {

      const rows    = this.state[srcRowsKey]
      const checked = rows.length > 0 && rows.every(row => !!row._CHECKED)

      function handleCheckAllChange(e) {
        rows.forEach(row => {
          this._updateBulkrowCheckedState(row, !!e.target.checked)
        })
      }

      return (
        <input
          type="checkbox"
          name="nc-select-all"
          checked={checked}
          onChange={handleCheckAllChange.bind(this)}
          className={ClassNames(checkboxClass)}/>
      )
    },

  }

}

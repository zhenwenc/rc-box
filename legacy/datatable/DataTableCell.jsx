/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  *
  * @providesModule DataTableCell
  */

'use strict'

var React = require('react')

var {PropTypes} = React

var DataTableCell = React.createClass({

  propTypes: {

    /**
     * The cell data. This can ba given in any form.
     */
    data: function(props, propName, componentName) {
      if (typeof props.data === 'undefined' && 
          typeof props.renderer !== 'function') {
        throw new Error('Must provide either \'data\' or \'renderer\'.')
      }
    },

    /**
     * Index of the parent table row.
     */
    rowIndex: PropTypes.number.isRequired,

    /**
     * The JSON data for the parent table row.
     */
    rowData: PropTypes.object.isRequired,

    /**
     * Custom renderer function.
     */
    renderer: PropTypes.func,

  },

  _defaultRenderer(cellData, rowIndex, rowData) {
    return <span>{cellData}</span>
  },

  render() {

    var data     = this.props.data
    var rowData  = this.props.rowData
    var rowIndex = this.props.rowIndex
    var renderer = this.props.renderer || this._defaultRenderer

    return (
      <td>
        {renderer.call(null, data, rowIndex, rowData)}
      </td>
    )
  },

})

module.exports = DataTableCell

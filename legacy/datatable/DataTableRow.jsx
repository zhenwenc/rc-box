/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  *
  * @providesModule DataTableCell
  */

'use strict'

var React         = require('react')
var DataTableCell = require('DataTableCell')

var {PropTypes} = React

var DataTableRow = React.createClass({

  propTypes: {

    /**
     * Custom classes for the row.
     */
    className: PropTypes.string,

    /**
     * Custom style for this row.
     */
    style: PropTypes.object,

    /**
     * Index of this row.
     */
    index: PropTypes.index.isRequired,

  },

  render() {
    return (
      <tr
        className={this.props.className}
        style={this.props.style}
        key={this.props.index}>

        

      </tr>
    )
  },

})

module.exports = DataTableRow

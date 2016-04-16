/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  * 
  * This React Data Table module is inspired by fixed-data-table
  * and reactable libraries. 
  * 
  * This module is aimed to provide a convient module that renders 
  * standard HTML <table> with similar feature of fixed-data-table.
  *
  * @providesModule DataTable
  */

'use strict'

var React         = require('react')
var ClassNames    = require('classnames')
var DataTableCell = require('./DataTableCell')

var {PropTypes} = React

var DataTable = React.createClass({

  propTypes: {

    /**
     * Custom classes for top level <table>.
     */
    className: PropTypes.string,

    /**
     * Custom styles for top level <table>.
     */
    style: PropTypes.object,

    /**
     * Custom classes for each <tr>.
     */
    rowClassName: PropTypes.object,

    /**
     * Custom styles for each <tr>.
     */
    rowStyle: PropTypes.object,

    /**
     * The total number of rows in the JSON data source.
     */
    rowsCount: PropTypes.number.isRequired,

    /**
     * The offset of rows in the JSON data source. Default 0.
     * This property can be used to implement pagination and 
     * table content scroll bar.
     */
    rowOffset: PropTypes.number,

    /**
     * To get rows to display in table.
     */
    rowGetter: PropTypes.func.isRequired,

    /**
     * The function to render the <tr> for each row data. The
     * function takes three parameters:
     * - data:  the row data from the JSON data source
     * - index: numberic index of the row data
     * - defo:  the default row renderer function. 
     */
    rowRenderer: PropTypes.func,

    /**
     * Definition of each column.
     */
    columns: PropTypes.arrayOf(PropTypes.shape({

      /**
       * The key/index of data to be readed from the JSON data
       * source property. This can be given in a number of 
       * different form.
       */
      field: PropTypes.oneOfType([

        /**
         * treated as an array index for the data source.
         */
        PropTypes.number,

        /**
         * read an object property from the data source.
         */
        PropTypes.string,

        /**
         * If this property doesn't defined, must provide the renderer
         * function for each cell of this column.
         */
        function(props, propName, componentName) {
          if (typeof props.renderer !== 'function') {
            throw new Error('Must provide either \'field\' or \'renderer\'.')
          }
        },

      ]),

      /**
       * The cell renderer function for this column. The function
       * takes two parameters:
       * - data: the field value from JSON data source
       * - index: the row index
       * - rowData: the JSON data of the parent row.
       */
      renderer: PropTypes.func,

      /**
       * The column header label text.
       */
      label: PropTypes.oneOfType([

        /**
         * text to be displayed.
         */
        PropTypes.string,

        /**
         * If this property doesn't defined, must provide the renderer
         * function for the column title.
         */
        function(props, propName, componentName) {
          if (typeof props.headerRenderer !== 'function') {
            throw new Error('Must provide either \'label\' or \'headerRenderer\'.')
          }
        },

      ]),

      /**
       * The header renderer function for this column. The function
       * takes two parameters:
       * - label: the header text (columns.label)
       * - field: the key/index of data for this column (columns.field)
       */
      headerRenderer: PropTypes.func,

      /**
       * Defining the width of the column, this expects a string
       * that can be any CSS value.
       */
      width: PropTypes.string.isRequired,

      /**
       * The column class name, only for column cells.
       */
      className: PropTypes.string,

    })).isRequired,

  },

  getDefaultProps() {
    return {
      rowOffset: 0,
    }
  },

  render() {
    return (
      <table
        className={ClassNames(
          'nc-data-table',
          this.props.className)
        }
        style={Object.assign({
          width: '100%',
        }, this.props.style)}>

        {/* Render table header */}
        <thead>
          {this._renderHeader()}
        </thead>

        {/* Render each table row */}
        <tbody>
          {this._renderRows(this.props.rowOffset)}
        </tbody>

      </table>
    )
  },

  _renderHeader() {

    function defaultRenderer(label, field) {
      return label // plain text label
    }

    var headers = this.props.columns.map(function(column, index) {
      var renderer = column.headerRenderer || defaultRenderer
      return (
        <th key={index} width={column.width}>
          {renderer.call(null, column.label, column.field)}
        </th>
      )
    })

    return (
      <tr>{headers}</tr>
    )
  },

  _renderRows(/*number*/ offset) {

    var rowArray  = []
    var rowsCount = this.props.rowsCount
    var renderer  = this.props.rowRenderer || this._renderRow

    for (var index = offset; index < rowsCount; index++) {

      var rowData = this.props.rowGetter(index)

      if (typeof rowData !== 'object') {
        throw new TypeError('Illegal table data.')
      }

      // NOTE: the content can be a single react element, or an array of 
      //       react elements. E.g: this can be used to implement expanded 
      //       row details. (see TableRowExpandMixin)
      var content = renderer.call(null, rowData, index)

      if (Array.isArray(content)) {
        content.forEach(o => rowArray.push(o))
      } else {
        rowArray.push(content)
      }
    }

    return rowArray
  },

  _renderRow(/*object*/ rowData, /*number*/ rowIndex) {
    return (
      <tr
        className={this.props.rowClassName}
        style={this.props.rowStyle}
        key={rowIndex}>

        {this.props.columns.map((column, index) => {

          var cellData = rowData[column.field]
          var renderer = column.renderer || this.defaultRenderer

          return (
            <DataTableCell 
              key={index} 
              data={cellData} 
              index={index} 
              rowData={rowData}
              rowIndex={rowIndex}
              renderer={renderer}
            />
          )
        })}

      </tr>
    )
  },

})

module.exports = DataTable

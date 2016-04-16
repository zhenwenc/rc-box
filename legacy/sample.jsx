'use strict'

const React  = require('react')
const Reflux = require('reflux')

let DataTable          = require('./datatable/DataTable')
let TableManager       = require('./datatable/TableManagerMixin')
let TableSortMixin     = require('./datatable/TableSortMixin')
let TableFilterMixin   = require('./datatable/TableFilterMixin')
let TableBulkrowMixin  = require('./datatable/TableBulkrowMixin')
let TablePaginateMixin = require('./datatable/TablePaginateMixin')

let RaisedButton       = require('material-ui/lib/raised-button')

let TableActions = Reflux.createActions([
  'updateRows',
  'deleteRows',
])

let TableStore = Reflux.createStore({
  listenables: [TableActions],
  _tableRows: undefined,

  getInitialState: function() {
    return this._tableRows = [
      {id: '1', name: 'John Smith', status: {content: 'Employed'}},
      {id: '3', name: 'Adam Moore', status: {content: 'Employed'}},
      {id: '4', name: 'Adam Moore', status: {content: 'Unemployed'}},
      {id: '2', name: 'Steve Brown', status: {content: 'Employed'}},
      {id: '5', name: 'Steve Brown', status: {content: 'Employed'}},
      {id: '6', name: 'Fake', status: {content: 'Employed'}},
      {id: '7', name: 'Fake', status: {content: 'Employed'}},
      {id: '8', name: 'Fake', status: {content: 'Employed'}},
      {id: '9', name: 'Fake', status: {content: 'Employed'}},
      {id: '10', name: 'Fake', status: {content: 'Employed'}},
      {id: '11', name: 'Fake', status: {content: 'Employed'}},
      {id: '12', name: 'Fake', status: {content: 'Employed'}},
      {id: '13', name: 'Fake', status: {content: 'Employed'}},
      {id: '14', name: 'Fake', status: {content: 'Employed'}},
      {id: '15', name: 'Fake', status: {content: 'Employed'}},
      {id: '16', name: 'Fake', status: {content: 'Employed'}},
    ]
  },

  onUpdateRows: function() {
    this.updateRows(this._tableRows)
  },

  onDeleteRows: function(/*array*/ deleted) {

    if (!Array.isArray(deleted)) {
      return console.warn('Expected array or rows, but', deleted)
    }

    let newRows = this._tableRows.filter(row => {
      return deleted.indexOf(row) < 0
    })

    this.updateRows(newRows)
  },

  updateRows: function(newRows) {
    this._tableRows = newRows
    this.trigger(this._tableRows)
  },

})

/** Table component */
let SampleDataTable = React.createClass({

  mixins: [
    Reflux.listenTo(TableStore, 'onTableRowsChange'),
  ].concat(TableManager('rows', 'pagedRows', [
    TableSortMixin,
    TableFilterMixin,
    TableBulkrowMixin,
    TablePaginateMixin,
  ])),

  getInitialState: function() {
    return {
      rows: TableStore.getInitialState(),
    }
  },

  getDefaultProps: function() {
    return {
      width: 600,
      maxHeight: 600,
    }
  },

  handleButtonClick: function() {
    console.info('Clicked button')
    TableActions.updateRows()
  },

  fnTableSort: function(sortCellKey) {
    if (sortCellKey === 'status') {
      return function(a, b) {
        if (a.content < b.content) return -1
        else if (a.content > b.content) return +1
        else return 0
      }
    }
  },

  fnTableFilter: function(filterCellKey) {
    if (filterCellKey === 'status') {
      return function(o, filterText) {
        let a = o.content.toLowerCase()
        let b = filterText.toLowerCase()
        return a.indexOf(b) >= 0
      }
    }
  },

  getAllRows: function() {
    return this.state.pagedRows
  },

  getRow: function(/*number*/ rowIndex) {
    return this.getAllRows()[rowIndex]
  },

  render: function() {
    return (
      <div style={{width: '100%'}}>

        <div className={'table-toolbar'}>

          {this.renderBulkrowControl({
            props: {
              className: 'btn btn-danger',
            },
            children: 'Delete',
            rowsGetter: this.getAllRows,
            onClick: function(e, selected) {
              TableActions.deleteRows(selected)
            },
          })}

          <div className={'pull-right search'}>
            {this.renderFilterInput({
              className: 'form-control',
            })}
          </div>

        </div>

        <div className={'table-container'}>
          <DataTable
            className={'table table table-hover table-bordered'}
            rowGetter={this.getRow}
            rowsCount={this.state.pagedRows.length}
            columns={[{
              width: '1%',
              headerRenderer: this.renderBulkrowCheckAll,
              renderer: (o, i) => this.renderBulkrowCheckSingle(this.getRow(i)),
            }, {
              label: 'ID',
              field: 'id',
              width: '15%',
              headerRenderer: this.renderSortLink,
            }, {
              label: 'Name',
              field: 'name',
              width: '50%',
              headerRenderer: this.renderSortLink,
            }, {
              label: 'Status',
              field: 'status',
              width: '35%',
              headerRenderer: this.renderSortLink,
              renderer: (o) => <a>{o.content}</a>,
            }]} />
        </div>

        <div className={'table-pagination'}>

          <div className={'pull-left pagination-detail'}>
            {this.renderPaginationDetail()}
          </div>

          <div className={'pull-right'}>
            {this.renderPaginationList('pagination')}
          </div>

        </div>

      </div>
    )
  },

})

module.exports = SampleDataTable

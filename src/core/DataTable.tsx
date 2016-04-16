import * as _ from 'lodash'
import * as React from 'react'

import { Component } from 'react'
import { Seq, List } from 'immutable'

import { check } from '../utils'
import { ColumnDef, ColumnData, mapColumnDef } from './TableColumn'
import { TableManager, RawTableData, TableData } from './TableManager'
import { TablePlugin } from './TablePlugin'

export interface DataTableProps {

  /**
   * Source of data to render.
   * Recommented to use lazy sequence.
   */
  data: RawTableData

  /**
   * Definition for each table column.
   *
   * Can we make this property type-safe?
   */
  children?: any

  /**
   * Renderer function for the final elements.
   */
  renderer: {
    (
      header: List<ColumnData>,
      rows: List<List<ColumnData>>,
      props?: Object,
      states?: DataTableState
    ): JSX.Element
  }

  /**
   * Optional custom properties which will be given to the
   * renderer functions.
   *
   * NOTE: DataTable itself won't use these properties. Since
   *       you are responsible to take care of the rendering
   *       of the components, here is the place where you can
   *       pass necessary properties to rendering the table.
   */
  rendererProps?: Object

  /**
   * Callback function that fired when failed on processing
   * table data with the specified plugins.
   */
  onProcessFailed?: {
    (reason: any): void
  }

  /**
   * Callback function that fired when the table data has changed.
   *
   * As the datatable only handle rerender it's own components on
   * data state changed, threfore you should trigger rerendering
   * other related components in this function.
   *
   * i.e: Rerender pagination navigation controls after data table
   *      is updated.
   *
   * NOTE: This property is useful if you have stateful plugin,
   *       otherwise you can set this to undefined.
   */
  onTableUpdate?: {
    (data: TableData): void
  }

  /**
   * Plugins for manipulating the table data.
   */
  plugins?: TablePlugin[]
}

export interface DataTableState {
  /**
   * Indicates if data table is processing the data.
   */
  isProcessing: boolean
  /**
   * Last update timestamp.
   */
  lastUpdate?: number
  /**
   * Processed table data.
   */
  tableData: TableData
}

export class DataTable extends Component<DataTableProps, DataTableState> {
  private columns: List<ColumnDef>
  private manager: TableManager

  constructor(props: DataTableProps) {
    super()
    const { children, plugins } = props
    this.columns = List(React.Children.map(children, mapColumnDef))
    this.manager = new TableManager(this, List(plugins), this.columns)
  }

  get header() {
    return this.columns.map(columnDef => ({
      cellData: columnDef.header,
      columnDef,
    })).toList()
  }

  get rows() {
    return this.state.tableData.map((rowData, rowIndex) => (
      this.columns.map(columnDef => ({
        cellData: columnDef.field(rowData),
        columnDef,
      })).toList()
    )).toList()
  }

  get rawData() {
    return this.props.data
  }

  updateTableData(srcData: RawTableData) {
    const { onProcessFailed } = this.props
    try {
      const now = Date.now()
      const data = this.manager.process(srcData)
      this.setState({
        lastUpdate: now,
        isProcessing: false,
        tableData: data,
      })
      this.notifyTableUpdate(data)
    } catch (err) {
      onProcessFailed(err)
    }
  }

  notifyTableUpdate(data: TableData) {
    const { onTableUpdate } = this.props
    if (!_.isUndefined(onTableUpdate)) onTableUpdate(data)
  }

  componentWillMount() {
    this.setState({
      lastUpdate: 0,
      isProcessing: true,
      tableData: Seq<number, any>(),
    })
  }

  componentDidMount() {
    // NOTE: We trigger this async operation here to ensure it
    //       will be processed in client side.
    this.updateTableData(this.props.data)
  }

  componentWillReceiveProps(nextProps: DataTableProps) {
    this.updateTableData(nextProps.data)
  }

  render() {
    const renderer      = this.props.renderer
    const rendererProps = this.props.rendererProps
    const tableHeader   = this.header
    const tableRows     = this.rows
    const tableStates   = _.clone(this.state)

    check(renderer, `Must specify renderer function for DataTable. ` +
      `Please see DataTable#renderer property for more details.`)

    return renderer(tableHeader, tableRows, rendererProps, tableStates)
  }
}

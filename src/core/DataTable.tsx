import * as _ from 'lodash'
import * as React from 'react'

import { Component } from 'react'
import { Seq, List } from 'immutable'

import { ColumnDef, ColumnData, mapColumnDef } from './TableColumn'
import { TableManager, RawTableData } from './TableManager'
import { TablePlugin, StateUpdateCallback } from './TablePlugin'
import { MuiTable } from '../renderers'

const {
  renderTableHeader,
  renderTableRow,
  renderTable,
} = MuiTable

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
   * Renderer function for the table header columns.
   */
  headerRenderer?: {
    (data: ColumnData[]): JSX.Element
  }

  /**
   * Renderer function for the final elements.
   */
  renderer?: {
    (
      headerColumn: JSX.Element,
      rowColumns: JSX.Element[]
    ): JSX.Element
  }

  /**
   * Renderer function for each row.
   */
  rowRenderer?: {
    (data: ColumnData[], rowIndex: number): JSX.Element
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
  rendererProps?: any

  /**
   * Callback function that fired when failed on processing
   * table data with the specified plugins.
   */
  onProcessFailed?: {
    (reason: any): void
  }

  /**
   * Callback function that fired when the plugin managed state
   * has changed. You should trigger component update in this
   * function.
   *
   * NOTE: This property is required if you have stateful plugin,
   *       otherwise you can set this to undefined.
   */
  onStateUpdate?: StateUpdateCallback

  /**
   * Plugins for manipulating the table data.
   */
  plugins?: TablePlugin[]

  /**
   * Component that rendered when processing the table data.
   */
  progressIndicator?: JSX.Element
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
  tableData: Seq<number, any>
}

export class DataTable extends Component<DataTableProps, DataTableState> {
  private columns: List<ColumnDef>
  private manager: TableManager

  constructor(props: DataTableProps) {
    super()
    const { children, plugins, onStateUpdate } = props
    this.columns = List(React.Children.map(children, mapColumnDef))
    this.manager = new TableManager(onStateUpdate, List(plugins), this.columns)
  }

  get header() {
    const { headerRenderer } = this.props
    const renderer = headerRenderer || renderTableHeader
    const headerDataList = this.columns.map(columnDef => ({
      cellData: columnDef.header, columnDef,
    }))
    return renderer(headerDataList.toArray())
  }

  get rows() {
    const { rowRenderer } = this.props
    const renderer = rowRenderer || renderTableRow
    return this.state.tableData.map((rowData, rowIndex) => {
      const columnDataList = this.columns.map(columnDef => ({
        cellData: columnDef.field(rowData), columnDef,
      }))
      return renderer(columnDataList.toArray(), rowIndex)
    })
  }

  asyncUpdateTableData(srcData: RawTableData) {
    const { onProcessFailed } = this.props

    const now = Date.now()

    const notifyUpdate = data => {
      // TODO only update state if the nonce value is matched
      this.setState({
        isProcessing: false,
        tableData: data as Seq<number, any>,
      })
    }

    if (this.manager.shouldProcess) {
      this.setState({
        lastUpdate: now,
        isProcessing: true,
        tableData: Seq<number, any>(),
      })
      this.manager.asyncProcess(srcData)
        .then(notifyUpdate)
        .catch(onProcessFailed)
    }
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
    this.asyncUpdateTableData(this.props.data)
  }

  componentWillReceiveProps(nextProps: DataTableProps) {
    this.asyncUpdateTableData(nextProps.data)
  }

  render() {
    const renderer      = this.props.renderer || renderTable
    const rendererProps = this.props
    const tableHeader   = this.header
    const tableRows     = this.rows.toArray()
    const tableStates   = _.clone(this.state)

    return renderer(tableHeader, tableRows, rendererProps, tableStates)
  }
}

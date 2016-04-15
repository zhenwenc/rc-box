import { SortingOrder } from './SortingOrder'

export interface TableSortOrder {
  (): SortingOrder
}

export interface ColumnSorter {
  /**
   * A function that returns the order the column should be sorted.
   * The default value is SortOrder#NONE.
   *
   * NOTE: The sorting order should be stored in the DataTable
   *       component's state, so that the table will be rerendered
   *       when the order from any sorter is changed.
   */
  order: TableSortOrder
  /**
   * Optional comparator function which is used to determin the order
   * of each value pair.
   *
   * If this property is not set, the plugin will choose a default
   * comparator base on the column's datatype.
   */
  comparator?: (a: any, b: any) => number
}

export interface TableSorter {
  /**
   * A function that returns the order the column should be sorted.
   * The same logic is applied as ColumnSorter#order.
   */
  order: TableSortOrder
  /**
   * A function that retruns the value from each table row data to be
   * used in the sorting / comparator function.
   *
   * Unlike the ColumnSorter where we can use the selector function
   * defined in each Column component, the custom sorter let you choose
   * what data you needed to perform sorting.
   */
  selector: (rowData: any) => any
  /**
   * A comparator function which is used to determin the order of each
   * value pair.
   */
  comparator: (a: any, b: any) => number
}

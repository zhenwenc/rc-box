/**
  * Copyright © 2015, Zhenwen Cai
  * All rights reserved.
  * 
  * @providesModule TableManagerMixin
  */

'use strict'

var TableBulkrowMixin  = require('./TableBulkrowMixin')
var TableFilterMixin   = require('./TableFilterMixin')
var TablePaginateMixin = require('./TablePaginateMixin')
var TableSortMixin     = require('./TableSortMixin')

var Mixins = {
  TableBulkrowMixin: {
    fn: TableBulkrowMixin,
    priority: 5,
    trigger: 'updateBulkRows',
    destRowsKey: '_bulkedRows',
  },
  TableFilterMixin: {
    fn: TableFilterMixin,
    priority: 30,
    trigger: 'filterRows',
    destRowsKey: '_filteredRows',
  },
  TablePaginateMixin: {
    fn: TablePaginateMixin,
    priority: 10,
    trigger: 'updatePagedRows',
    destRowsKey: '_pagedRows',
  },
  TableSortMixin: {
    fn: TableSortMixin,
    priority: 20,
    trigger: 'sortRows',
    destRowsKey: '_sortedRows',
  }, 
}

class DataTableManager {

  constructor(srcRowsKey, destRowsKey, mixins) {
    this.srcRowsKey = srcRowsKey
    this.destRowsKey = destRowsKey
    this.registered = [/* mixin types */]
  }

  /**
   * Static method that returns the React component compatible mixin
   * object for the given data table manager instance.
   * 
   * @param  {object} manager Instance of data table manager
   * @return {object}         The mixin object
   */
  static generateMixin(/*object*/ manager) {
    return {

      getInitialState: function() {
        return { tableManager: manager }
      },

      componentWillMount: function() {
        this.triggerTableManager()
      },

      onTableRowsChange: function(newRows) {
        this.setState({
          rows: newRows,
        }, function() {
          this.triggerTableManager()
        })
      },

      /**
       * Trigger the highest priority mixin action to update the
       * output rows. This function should be called whenever
       * the array of source row is updated.
       *
       * Hint: this is typically useful with FLUX pattern.
       */
      triggerTableManager() {
        var first = manager.getRegisteredMixinTypes()[0]
        this[first.trigger].call(null)
      },

    }
  }

  /**
   * Internal function that checks the given key is an valid
   * mixin type key.
   * 
   * @param  {String} mixinTypeKey The mixin type key
   * @return {Boolean}              True if the key is valid
   */
  _checkMixinTypeKey(/*string*/ mixinTypeKey) {

    if (typeof mixinTypeKey !== 'string') {
      throw new TypeError('Illegal mixin type: ' + mixinTypeKey)
    }
    if (!Mixins.hasOwnProperty(mixinTypeKey)) {
      throw new Error('Unknown mixin type: ' + mixinTypeKey)
    }
  }

  /**
   * Internal method for registering a table mixin. This method
   * is expected to be called by table mixins.
   *  
   * @param  {String} mixinTypeKey The unique mixin type key
   */
  _register(/*string*/ mixinTypeKey) {

    this._checkMixinTypeKey(mixinTypeKey)

    if (this._isMixinTypeRegistered(mixinTypeKey)) {
      return console.warn('"' + mixinTypeKey + '" already registered.')
    }

    this.registered.push(mixinTypeKey)
  }

  _isMixinTypeRegistered(/*string*/ mixinTypeKey) {
    return this.registered.indexOf(mixinTypeKey) > -1
  }

  /**
   * Returns a shadow copy of the registered mixin type keys. The
   * results are sorted by mixin priority from highest to lowest.
   * 
   * @return {Array} An array of mixin type key strings
   */
  getRegisteredMixinTypes() {

    return this.registered.map(key => Mixins[key]).sort((a, b) => {
      // sort by mixin dependencies
      return a.priority < b.priority ? 1 : -1 
    })
  }

  /**
   * Function that should be called by each mixin when its core
   * action has been triggered.
   * 
   * @param  {String} mixinTypeKey The caller mixin type key
   */
  notifyUpdated(/*object*/ caller, /*string*/ mixinTypeKey) {

    this._checkMixinTypeKey(mixinTypeKey)

    if (!this._isMixinTypeRegistered(mixinTypeKey)) {
      throw new Error('Unexpected update notification from "' + 
        mixinTypeKey + '", mixin does not registered.')
    }

    var registered = this.getRegisteredMixinTypes()
    var typeIndex = registered.indexOf(Mixins[mixinTypeKey])

    // Trigger the predecessor mixin to update if there is any
    if (typeIndex + 1 < registered.length) {
      var mixinType = registered[typeIndex + 1]
      caller[mixinType.trigger].call(null)
    }
  }

}

function TableManagerMixin(srcRowsKey, destRowsKey, mixins, mixinOpts) {

  
  // Must specify the state key for source rows
  if (typeof srcRowsKey !== 'string') {
    throw new TypeError('Illegal source state key "' + srcRowsKey + '".')
  }

  // Must specify the state key for destination rows
  if (typeof destRowsKey !== 'string') {
    throw new TypeError('Illegal destination state key "' + destRowsKey + '".')
  }

  // Must have at lease one mixin to manage
  if (!Array.isArray(mixins) || mixins.length === 0) {
    throw new TypeError('No table mixins to manage.')
  }

  var manager   = new DataTableManager(srcRowsKey, destRowsKey, mixins)
  var instances = [] // instances of each given mixin class

  // Ensure all given mixin functions (class) are in right type
  mixins.forEach(function(fnMixin) {

    // Map mixin type with its function (class)
    var mixinTypeKey = Object.keys(Mixins).find(key => {
      return fnMixin === Mixins[key].fn
    })

    if (typeof mixinTypeKey === 'undefined') {
      throw new TypeError('Unknown mixin: ' + fnMixin)
    }

    // Register the mixin type to manager
    manager._register(mixinTypeKey)
  })

  // Instantiate each registered mixin class
  manager.getRegisteredMixinTypes().forEach((that, index, array) => {

    var prev = index < 1 ? undefined : array[index - 1]
    var next = index >= array.length - 1 ? undefined : array[index + 1]

    var src  = prev !== undefined ? prev.destRowsKey : srcRowsKey
    var dest = next !== undefined ? that.destRowsKey : destRowsKey

    instances.push(that.fn(src, dest, mixinOpts))
  })

  return [DataTableManager.generateMixin(manager)].concat(instances)
}

module.exports = TableManagerMixin

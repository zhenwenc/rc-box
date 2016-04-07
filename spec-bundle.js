'use strict'

Error.stackTraceLimit = Infinity

var helpers = require('./helpers')

// any file that ends with spec.js and get its path, recursively
var testContext = require.context(
  '../test', true, /\.spec\.tsx?/
)

// get all the files, for each file, call the context function
// that will require the file and load it up here. Context will
// loop and require those spec files here
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext)
}

var modules = requireAll(testContext) //eslint-disable-line no-unused-vars

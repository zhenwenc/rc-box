import * as _ from 'lodash'
import {
  FilterPluginImpl,
  FilterPredicate,
  defaultPredicate,
} from './FilterPluginImpl'

export class FilterPlugin extends FilterPluginImpl {
  private filterTerm: any
  private filterPredicate: FilterPredicate

  constructor({
    initTerm,
    predicate,
  }: {
    initTerm?: string,
    predicate?: FilterPredicate
  } = {
    initTerm: '',
    predicate: defaultPredicate,
  }) {
    super()
    this.filterTerm = initTerm
    this.filterPredicate = predicate
  }

  get term() {
    return this.filterTerm
  }

  get predicate() {
    return this.filterPredicate
  }

  setTerm(term: string, forceUpdate = true) {
    this.filterTerm = _.trim(term)
    return this
  }
}


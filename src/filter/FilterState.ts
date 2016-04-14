import * as _ from 'lodash'
import { FilterPlugin } from './FilterPlugin'

export class FilterState {
  private plugin: FilterPlugin
  private filterTerm: string

  constructor(
    self: FilterPlugin,
    term: string
  ) {
    this.plugin = self
    this.filterTerm = term || ''
  }

  get term() {
    return this.filterTerm
  }

  get fnTerm() {
    return () => this.term
  }

  setTerm(term: string) {
    this.filterTerm = _.trim(term)
    return this.plugin
  }
}


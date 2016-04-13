import * as _ from 'lodash'

export function checkOption(self: any, option: any, name: string) {
  if (_.isUndefined(option))
    throw new Error(
      `[RCBOX] Option [${name}] is required in ${self.constructor.name}.`
    )
  return option
}

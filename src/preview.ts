import { PARAM_KEY } from "./constants"
import { withPseudoState } from "./preview/withPseudoState"

export const decorators = [withPseudoState]
export const globals = { [PARAM_KEY]: false }

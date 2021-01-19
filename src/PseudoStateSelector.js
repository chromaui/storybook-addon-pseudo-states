import React, { useCallback, useMemo } from "react"
import { useGlobals } from "@storybook/api"
import { Icons, IconButton, WithTooltip, TooltipLinkList } from "@storybook/components"
import { styled, color } from "@storybook/theming"

import { PSEUDO_STATES } from "./constants"

const LinkTitle = styled.span(({ active }) => ({
  color: active ? color.secondary : "inherit",
}))

const LinkIcon = styled(Icons)(({ active }) => ({
  opacity: active ? 1 : 0,
  path: { fill: active ? color.secondary : "inherit" },
}))

const options = Object.keys(PSEUDO_STATES).sort()

export const PseudoStateSelector = () => {
  const [{ pseudo }, updateGlobals] = useGlobals()
  const hasSelection = useMemo(() => !!pseudo && Object.values(pseudo).includes(true), [pseudo])
  const getValue = useCallback((option) => (pseudo ? pseudo[option] : false), [pseudo])

  const toggleOption = useCallback(
    (option) => () => updateGlobals({ pseudo: { ...pseudo, [option]: !getValue(option) } }),
    [pseudo, getValue]
  )

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={() => (
        <TooltipLinkList
          links={options.map((option) => ({
            id: option,
            title: <LinkTitle active={getValue(option)}>:{PSEUDO_STATES[option]}</LinkTitle>,
            right: <LinkIcon icon="check" width={12} height={12} active={getValue(option)} />,
            onClick: toggleOption(option),
            active: getValue(option),
          }))}
        />
      )}
    >
      <IconButton key="pseudo-state" title="Select CSS pseudo states" active={hasSelection}>
        <Icons icon="button" />
      </IconButton>
    </WithTooltip>
  )
}

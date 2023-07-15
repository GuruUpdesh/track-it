import * as UITooltip from "@radix-ui/react-tooltip"
import React from "react"

type Props = {
	children: React.ReactNode
	text: string
	disabled?: boolean
}

const Tooltip = ({ children, text, disabled = false }: Props) => {
	return (
		<UITooltip.Provider>
			<UITooltip.Root defaultOpen={false}>
				<UITooltip.Trigger asChild>{children}</UITooltip.Trigger>
				<UITooltip.Portal>
					{!disabled ? (
						<UITooltip.Content
							className="Tooltip-content"
							side="bottom"
							data-testid="Tooltip-content"
						>
							<UITooltip.Arrow className="arrow translate-y-[1px] fill-indigo-400/50" />
							{text}
						</UITooltip.Content>
					) : null}
				</UITooltip.Portal>
			</UITooltip.Root>
		</UITooltip.Provider>
	)
}

export default Tooltip

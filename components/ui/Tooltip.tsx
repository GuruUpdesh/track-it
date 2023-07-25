import * as UITooltip from "@radix-ui/react-tooltip"
import React from "react"
import { Balancer } from "react-wrap-balancer"

type Props = {
	children: React.ReactNode
	title: string
	disabled?: boolean
}

const Tooltip = ({ children, title, disabled = false }: Props) => {
	return (
		<UITooltip.Provider>
			<UITooltip.Root defaultOpen={false} delayDuration={350}>
				<UITooltip.Trigger asChild>{children}</UITooltip.Trigger>
				<UITooltip.Portal>
					{!disabled ? (
						<UITooltip.Content
							className="Tooltip-content"
							side="bottom"
							data-testid="Tooltip-content"
						>
							<UITooltip.Arrow className="arrow z-10 fill-black stroke-yellow-50/50" />
							<Balancer>{title}</Balancer>
						</UITooltip.Content>
					) : null}
				</UITooltip.Portal>
			</UITooltip.Root>
		</UITooltip.Provider>
	)
}

export default Tooltip

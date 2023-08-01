import React from "react"
import { TMenuItem, renderMenuItem, renderRadioOption } from "./Menu"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { BsChevronRight } from "react-icons/bs"
import { cn } from "@/lib/utils"

type Props = {
	menuItem: TMenuItem
}

const SubMenu = ({ menuItem }: Props) => {
	function renderRadioGroup(
		radioGroup: TMenuItem["radioGroup"]
	): React.ReactNode {
		if (!radioGroup?.enabled) {
			return null
		}

		return (
			<DropdownMenu.RadioGroup
				value={radioGroup.value}
				onValueChange={radioGroup.onChange}
			>
				{radioGroup.options.map((option, index) =>
					renderRadioOption(option, index)
				)}
			</DropdownMenu.RadioGroup>
		)
	}

	function renderMenuItems(
		menuItems: TMenuItem[] | undefined
	): React.ReactNode {
		if (!menuItems) {
			return null
		}
		return menuItems.map((item, index) =>
			renderMenuItem(item, index, menuItems)
		)
	}

	if (!menuItem.children && !menuItem.radioGroup?.enabled) {
		return null
	}

	return (
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger
				className={cn(
					"DropdownMenu-item",
					menuItem.variant === "danger"
						? "bg-red-500/25 text-red-500"
						: menuItem.variant === "warning"
						? "bg-orange-400/25 text-orange-400"
						: ""
				)}
			>
				{menuItem.icon}
				{menuItem.label}
				<div className="float-right">
					<BsChevronRight />
				</div>
			</DropdownMenu.SubTrigger>
			<DropdownMenu.Portal>
				<DropdownMenu.SubContent
					className="DropdownMenu-content"
					sideOffset={5}
					alignOffset={-5}
				>
					{menuItem.radioGroup?.enabled
						? renderRadioGroup(menuItem.radioGroup)
						: renderMenuItems(menuItem.children)}
				</DropdownMenu.SubContent>
			</DropdownMenu.Portal>
		</DropdownMenu.Sub>
	)
}

export default SubMenu

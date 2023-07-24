"use client"

import React, { createContext, useContext } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import CloseButton from "./CloseButton"

type Props = {
	open: boolean
	setOpen: (open: boolean) => void
	children: React.ReactNode
}

type ModalContextType = {
	open: boolean
	setOpen: (open: boolean) => void
}

const ModalContext = createContext<ModalContextType>({
	open: false,
	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	setOpen: (open: boolean) => {},
})

export const useModalContext = () => useContext(ModalContext)

const Modal = ({ open, setOpen, children }: Props) => {
	return (
		<ModalContext.Provider value={{ open, setOpen }}>
			<Dialog.Root open={open} onOpenChange={setOpen} modal={true}>
				<Dialog.Portal>
					<Dialog.Overlay className="Modal-overlay absolute left-0 top-0 z-40 h-full w-full" />
					<Dialog.Content className="Modal-content absolute left-[50%] top-[50%] z-50 min-h-[200px] translate-x-[-50%] translate-y-[-50%] p-6">
						<CloseButton />
						{children}
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</ModalContext.Provider>
	)
}

export default Modal

import React, { useLayoutEffect } from "react"

export type TModal = "bible" | "christian-harp" | "more"

export default function ModalManager({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }): React.JSX.Element | null {
    useLayoutEffect((): () => void => {
        if (isOpen) {
            document.body.style.overflow = "hidden"

            const handleEscape = (event: KeyboardEvent): void => {
                if (event.key === "Escape") {
                    onClose()
                }
            }

            document.addEventListener("keydown", handleEscape)

            return () => {
                document.removeEventListener("keydown", handleEscape)
                document.body.style.overflow = "unset"
            }
        }
    }, [isOpen, onClose])

    const handleBackdropClick = (event: React.MouseEvent): void => {
        const { target, currentTarget } = event

        if (target === currentTarget) {
            onClose()
        }
    }

    if (isOpen) {
        return (
            <div onClick={handleBackdropClick}>
                <div onClick={(event): void => event.stopPropagation()}>
                    <div>
                        <strong>{title}</strong>
                        <button onClick={onClose} aria-label="Fechar modal">
                            X
                        </button>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    return null
}

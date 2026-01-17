import React, { createElement, useLayoutEffect } from "react"
import IconManager from "../../icons/IconManager"

export type TModal = "bible" | "christian-harp" | "more"

export default function ModalManager({ name, isOpen, onClose, children, title }: { name: TModal, isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }): React.JSX.Element | null {
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
            <div className="modal-backdrop" onClick={handleBackdropClick}>
                <div className="modal-container" onClick={(event): void => event.stopPropagation()}>
                    <div className="modal-header">
                        <strong>{title}</strong>
                        <button onClick={onClose} aria-label="Fechar modal">
                            {createElement(IconManager.get("close"))}
                        </button>
                    </div>
                    <div id={`${name}-modal`} className="modal-content">
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    return null
}

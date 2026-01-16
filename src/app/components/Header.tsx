"use client"

import React, { createElement, useState } from "react"
import ModalManager, { TModal } from "./modals/main/ModalManager"
import BibleModal from "./modals/BibleModal"
import ChristianHarpModal from "./modals/ChristianHarpModal"
import MoreModal from "./modals/MoreModal"
import IconManager, { IconName } from "./icons/IconManager"

export default function Header(): React.JSX.Element {
    const [activeModal, setActiveModal] = useState<TModal>()

    const transformIconNameToModalName = (iconName: string): TModal => {
        return iconName.replaceAll(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() as TModal
    }

    function NavbarItem({ icon, text, ...props }: { icon: IconName; text: string } & Omit<React.HTMLAttributes<HTMLButtonElement>, "children">): React.JSX.Element {
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
            if (props.onClick) {
                props.onClick(event)
            }

            setActiveModal(transformIconNameToModalName(icon))
        }

        return (
            <div className="navbar-item">
                <button name={transformIconNameToModalName(icon)} className="navbar-item-button" onClick={handleClick} {...props}>
                    {createElement(IconManager.get(icon))}
                    {text}
                </button>
            </div>
        )
    }

    const handleCloseModal = (): void => {
        setActiveModal(undefined)
    }

    return (
        <React.Fragment>
            <header>
                <h1 className="logo">
                    <span>MP</span> Bible
                </h1>
                <nav className="navbar">
                    <NavbarItem icon="bible" text="Bíblia" />
                    <NavbarItem icon="christianHarp" text="Harpa Cristã"/>
                    <NavbarItem icon="more" text="Mais"/>
                </nav>
            </header>

            {activeModal && ((): React.JSX.Element => {
                const modalConfig: { title: string; modal: React.JSX.Element } = {
                    "bible": {
                        title: "Bíblia",
                        modal: <BibleModal />
                    },
                    "christian-harp": {
                        title: "Harpa Cristã",
                        modal: <ChristianHarpModal />
                    },
                    "more": {
                        title: "Mais",
                        modal: <MoreModal />
                    }
                }[activeModal]

                return (
                    <ModalManager isOpen={Boolean(activeModal)} onClose={handleCloseModal} title={modalConfig.title}>
                        {modalConfig.modal}
                    </ModalManager>
                )
            })()}
        </React.Fragment>
    )
}

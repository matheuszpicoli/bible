import React, { createElement } from "react"
import IconManager, { IconName } from "./icons/IconManager"

export default function Header(): React.JSX.Element {
    function NavbarItem({ icon, text, ...props }: { icon: IconName; text: string } & Omit<React.HTMLAttributes<HTMLDivElement>, "children">): React.JSX.Element {
        return (
            <div className="navbar-item" {...props}>
                 {createElement(IconManager.get(icon))}
                {text}
            </div>
        )
    }

    return (
        <header>
            <h1 className="logo"><span>MP</span> Bible</h1>
            <nav className="navbar">
                <NavbarItem icon="bible" text="Bíblia" />
                <NavbarItem icon="christianHarp" text="Harpa Cristã" />
                <NavbarItem icon="more" text="Mais" />
            </nav>
        </header>
    )
}

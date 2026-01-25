"use client"

import React, { createElement, useState, useLayoutEffect, useRef } from "react"
import IconManager, { TIconName } from "./icons/IconManager"

type TAlignment = "left" | "justify" | "center" | "right"

export default function ChapterOptions(): React.JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [alignmentIndex, setAlignmentIndex] = useState<number>(0)
    const [fontSize, setFontSize] = useState<number>(null)
    const offcanvas: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const container: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

    const toggleOffcanvas = (): void => setIsOpen(!isOpen)
    const closeOffcanvas = (): void => setIsOpen(false)
    const toggleAlignment = (): void => {
        const newIndex: number = (alignmentIndex + 1) % alignmentOptions.length
        
        setAlignmentIndex(newIndex)
        changeVersesStyle("alignment", alignmentOptions[newIndex].alignment)
    }

    const toggleFontSize = (type: "increase" | "decrease"): void => {
        const newSize: number = {
            increase: Math.min(24, fontSize + 1),
            decrease: Math.max(12, fontSize - 1)
        }[type]

        setFontSize(newSize)
        changeVersesStyle("fontSize", newSize)
    }

    const alignmentOptions: Array<{ label: string; icon: TIconName; alignment: TAlignment }> = [
        { label: "Esquerda", icon: "alignLeft", alignment: "left" },
        { label: "Justificado", icon: "alignJustify", alignment: "justify" },
        { label: "Centralizado", icon: "alignCenter", alignment: "center" },
        { label: "Direita", icon: "alignRight", alignment: "right" }
    ]

    const changeVersesStyle = (type: "alignment" | "fontSize", property: TAlignment | number): void => {
        const verses: NodeListOf<Element> = document.querySelectorAll(".verse")
        
        verses.forEach(
            (verse: HTMLElement): void => Object.assign(
                verse.style, {
                    alignment: { textAlign: property as TAlignment },
                    fontSize: { fontSize: `${property as number}px` }
                }[type]
            )
        )
    }

    useLayoutEffect((): void => { 
        changeVersesStyle("alignment", alignmentOptions[alignmentIndex].alignment)
        changeVersesStyle("fontSize", fontSize)
    }, [])
    
    useLayoutEffect((): () => void => {
        const handleEsc = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                closeOffcanvas()
            }
        }
        
        if (isOpen) {
            document.addEventListener("keydown", handleEsc)
            document.body.style.overflow = "hidden"
        }
        
        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <React.Fragment>
            <button onClick={toggleOffcanvas}>
                {createElement(IconManager.get("dots"))}
            </button>
            
            {isOpen && (
                <div className="offcanvas" onClick={closeOffcanvas} ref={offcanvas}>
                    <div className="container" onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => event.stopPropagation()} ref={container}>
                        <div className="content">
                            <button aria-label="Diminuir" onClick={(): void => toggleFontSize("decrease")}>
                                {createElement(IconManager.get("font"))}
                            </button>
                            <button aria-label="Aumentar" onClick={(): void => toggleFontSize("increase")}>
                                {createElement(IconManager.get("font"))}
                            </button>
                            <button aria-label={alignmentOptions[alignmentIndex].label} onClick={toggleAlignment}>
                                {createElement(IconManager.get(alignmentOptions[alignmentIndex].icon))}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

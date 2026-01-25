"use client"

import React, { createElement, useState } from "react"
import IconManager from "./icons/IconManager"
import type { IBibleResponse } from "../../../types/types"

export default function AudioPlayerButton({ verses, book, chapter }: Omit<IBibleResponse, "abbreviation" | "verse" | "text" | "range" | "totalVerses">): React.JSX.Element {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const toggleSpeech = (): void => {
        if ("speechSynthesis" in window) {
            if (isPlaying) {
                window.speechSynthesis.cancel()
                setIsPlaying(false)
            } else {
                const fullText: string = `${book} Capítulo ${chapter}\n\n`.concat(verses.map((text: string, index: number): string => `Versículo ${index + 1}: ${text}`).join("\n"))
                const voice: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(fullText)
                voice.lang = "pt-BR"
                voice.rate = 1.0
                
                window.speechSynthesis.cancel()
                
                voice.onstart = (): void => setIsPlaying(true)
                voice.onend = (): void => setIsPlaying(false)
                voice.onerror = (): void => setIsPlaying(false)
                
                window.speechSynthesis.speak(voice)
            }
        } else {
            alert("Seu navegador não suporta leitura de texto.")
    
            return
        }
    }

    return (
        <button onClick={toggleSpeech}>
            {createElement(IconManager.get(isPlaying ? "stop" : "play"))}
        </button>
    )
}

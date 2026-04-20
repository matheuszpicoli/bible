"use client"

import { RefObject, useLayoutEffect, useRef } from "react"
import type { IBibleResponse } from "../../../types/types"
import Formatter from "../utils/Formatter"

export default function RedLetterHighlighter(props: Pick<IBibleResponse, "abbreviation" | "chapter" | "totalVerses">): React.JSX.Element {
    const { abbreviation, chapter, totalVerses } = props
    
    const formatterRef  : RefObject<Formatter> = useRef<Formatter>(null)
    const hasAppliedRef : RefObject<boolean>   = useRef<boolean>(false)

    useLayoutEffect((): void => {
        const applyRedLetters = (): boolean => {
            if (hasAppliedRef.current) {
                return false
            }
        
            if (!formatterRef.current) {
                formatterRef.current = new Formatter("ARC")
            }

            for (let verseNumber = 1; verseNumber <= totalVerses; verseNumber++) {
                formatterRef.current.formatText(abbreviation, chapter, verseNumber)
            }
            
            hasAppliedRef.current = true
            
            return true
        }

        applyRedLetters()
    }, [abbreviation, chapter, totalVerses])

    return null
}

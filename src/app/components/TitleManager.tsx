"use client"

import { useLayoutEffect } from "react"

export default function TitleManager({ title }: { title: string }): null {
    useLayoutEffect((): void => { document.title = title }, [title])
    
    return null
}

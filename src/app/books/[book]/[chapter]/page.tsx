import React from "react"
import { IBibleResponse } from "../../../../../types/types"
import Link from "next/link"

export default async function Books({ params }: { params: Promise<{ book: string; chapter: string }> }): Promise<React.JSX.Element> {
    const { book, chapter } = await params
    const response: Response = await fetch(`http://localhost:3000/api/bible/${book}/${chapter}`)
    const chapterData: IBibleResponse = await response.json()
    
    return (
        <div className="chapter-container">
            <header className="chapter-header">
                <h1>
                    {chapterData.book} {chapterData.chapter}
                    {chapterData.range && <span className="verse-range"> ({chapterData.range})</span>}
                </h1>
                {chapterData.abbreviation && (
                    <p className="book-abbreviation">
                        {chapterData.abbreviation.toUpperCase()}
                    </p>
                )}
                <p className="chapter-info">
                    Total de versículos: {chapterData.totalVerses || chapterData.verses.length}
                </p>
            </header>
            
            <div className="verses-container">
                {chapterData.verses.map((verseText: string, index: number): React.JSX.Element => {
                    const verseNumber = index + 1
                    
                    return (
                        <div key={verseNumber} className="verse">
                            <sup className="verse-number">{verseNumber}</sup>
                            <span className="verse-text">{verseText}</span>
                        </div>
                    )
                })}
            </div>
            
            <nav className="chapter-navigation">
                <div className="nav-buttons">
                    {parseInt(chapter) > 1 && (
                        <Link href={`/books/${book}/${parseInt(chapter) - 1}`} className="nav-button prev">
                            ← Capítulo {parseInt(chapter) - 1}
                        </Link>
                    )}
                    
                    <Link href={`/books/${book}/${parseInt(chapter) + 1}`} className="nav-button next">
                        Capítulo {parseInt(chapter) + 1} →
                    </Link>
                </div>
            </nav>
        </div>
    )
}

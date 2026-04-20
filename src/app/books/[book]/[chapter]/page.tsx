import React, { createElement } from "react"
import Link from "next/link"
import type { IBibleBook, IBibleResponse } from "../../../../../types/types"
import AudioPlayerButton from "../../../components/AudioPlayerButton"
import ChapterOptions from "../../../components/ChapterOptions"
import IconManager from "../../../components/icons/IconManager"
import TitleManager from "../../../components/TitleManager"
import RedLetterHighlighter from "../../../components/RedLetterHighlighter"

type TDirection = "previous" | "next"

interface INavigation {
    info: Pick<IBibleResponse, "abbreviation" | "chapter">
    link: string | null
}

export default async function Books({ params }: { params: Promise<{ book: string; chapter: string }> }): Promise<React.JSX.Element> {
    const { book, chapter } = await params

    const baseAPIURL     : string = "http://localhost:3000/api/bible"
    const currentChapter : number = parseInt(chapter)
    
    const [chapterResponse, booksResponse] = await Promise.all([fetch(`${baseAPIURL}/${book.toLowerCase()}/${currentChapter}`), fetch(baseAPIURL)])
    
    const chapterData: IBibleResponse = await chapterResponse.json()
    
    const allBooksData: { books: Array<IBibleBook> } = await booksResponse.json()
    
    const currentBook              : IBibleBook = allBooksData.books.find((currentBook: IBibleBook): boolean => currentBook.book.toLowerCase() === chapterData.book.toLowerCase() || currentBook.abbreviation.toLowerCase() === chapterData.abbreviation.toLowerCase())
    const currentBookIndex         : number     = allBooksData.books.indexOf(currentBook)
    const currentBookTotalChapters : number     = currentBook.chapters.length
    
    function navigationHandler(direction: TDirection): INavigation {
        let abbreviation : IBibleResponse["abbreviation"] | null = null
        let chapter      : number | null = null

        switch (direction) {
            case "previous":
                if (currentChapter > 1) {
                    abbreviation = currentBook.abbreviation
                    chapter      = currentChapter - 1
                } else if (currentBookIndex > 0) {
                    const previousBook = allBooksData.books[currentBookIndex - 1]

                    abbreviation = previousBook.abbreviation
                    chapter      = previousBook.chapters.length
                }

                break
                
            case "next":
                if (currentChapter < currentBookTotalChapters) {
                    abbreviation = currentBook.abbreviation
                    chapter      = currentChapter + 1
                } else if (currentBookIndex < allBooksData.books.length - 1) {
                    const nextBook = allBooksData.books[currentBookIndex + 1]

                    abbreviation = nextBook.abbreviation
                    chapter      = 1
                }

                break
        }

        const link = abbreviation && chapter
            ? `/books/${encodeURIComponent(abbreviation.toLowerCase())}/${chapter}`
            : null
        
        return {
            info: {
                abbreviation,
                chapter
            },
            link
        }
    }

    function NavigationButton({ direction, data, ...props }: { direction: TDirection; data: INavigation } & Omit<React.HTMLAttributes<HTMLAnchorElement>, "children">): React.JSX.Element {
        if (data.link && data.info) {
            const isPrevious: boolean = direction === "previous"
            
            return (
                <Link href={data.link} className={`navigation-button ${direction}`} prefetch={true} {...props}>
                    {createElement(IconManager.get(isPrevious ? "arrowLeft" : "arrowRight"))}
                </Link>
            )
        }
        
        return null
    }

    const previousChapter : INavigation = navigationHandler("previous")
    const nextChapter     : INavigation = navigationHandler("next")

    return (
        <React.Fragment>
            <TitleManager title={`${chapterData.book} ${chapterData.chapter} (ARC)`} />            
            <main className="book-bible-page">
                <div className="options">
                    <select disabled aria-label="Versão da Bíblia">
                        <option value="ARC">ARC</option>
                    </select>
                    <AudioPlayerButton 
                        verses={chapterData.verses} 
                        book={chapterData.book} 
                        chapter={chapterData.chapter} 
                    />
                    <ChapterOptions />
                </div>
                <h1 className="chapter">
                    {chapterData.book} 
                    <span className="chapter-number">{chapterData.chapter}</span>
                </h1>
                <section className="verses" aria-label={`${chapterData.book} - Capítulo ${chapterData.chapter}`}>
                    {chapterData.verses.map((text: string, index: number): React.JSX.Element => {
                        const verseNumber: number = index + 1
                        
                        return (
                            <article
                                key={verseNumber}
                                className={`ARC ${chapterData.abbreviation} c${chapterData.chapter}v${verseNumber}`}
                                aria-label={`Versículo ${verseNumber}`}
                            >
                                <sup className="verse-number" aria-hidden="true">{verseNumber}</sup>
                                <p className="verse-text">
                                    {text.split(" ").map((word: string, index: number): React.JSX.Element => (
                                        <span key={index} className="word">
                                            {word}{index < text.split(" ").length - 1 && " "}
                                        </span>
                                    ))}
                                </p>
                            </article>
                        )
                    })}
                </section>    
                <nav className="navigation" aria-label="Navegação entre capítulos">
                    <NavigationButton 
                        direction="previous" 
                        data={previousChapter} 
                        aria-label={`Capítulo ${previousChapter.info.chapter}`}
                        aria-details={`${previousChapter.info.chapter}`}
                    />                       
                    <NavigationButton 
                        direction="next" 
                        data={nextChapter} 
                        aria-label={`Capítulo ${nextChapter.info.chapter}`}
                        aria-details={`${nextChapter.info.chapter}`}
                    />
                </nav>
            </main>
            <RedLetterHighlighter 
                abbreviation={chapterData.abbreviation}
                chapter={chapterData.chapter}
                totalVerses={chapterData.verses.length}
            />
        </React.Fragment>
    )
}

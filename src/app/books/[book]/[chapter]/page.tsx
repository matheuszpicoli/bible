import React, { createElement } from "react"
import type { IBibleBook, IBibleResponse } from "../../../../../types/types"
import IconManager from "../../../components/icons/IconManager"
import Link from "next/link"
import TitleManager from "../../../components/TitleManager"
import AudioPlayerButton from "../../../components/AudioPlayerButton"
import ChapterOptions from "../../../components/ChapterOptions"

type TDirection = "previous" | "next"

interface IChapterInfo {
    bookAbbreviation: string
    chapterNumber: number
}

interface INavigation {
    info: Partial<IChapterInfo>
    link: Partial<string>
}

export default async function Books({ params }: { params: Promise<{ book: string; chapter: string }> }): Promise<React.JSX.Element> {
    const { book, chapter } = await params

    const baseAPIURL: string = "http://localhost:3000/api/bible"
    const currentChapter: number = parseInt(chapter)
    const [chapterResponse, booksResponse] = await Promise.all([fetch(`${baseAPIURL}/${book.toLowerCase()}/${currentChapter}`), fetch(baseAPIURL)])
    const chapterData: IBibleResponse = await chapterResponse.json()
    const allBooksData: { books: Array<IBibleBook> } = await booksResponse.json()
    const currentBook: IBibleBook = allBooksData.books.find((currentBook: IBibleBook): boolean => currentBook.book.toLowerCase() === chapterData.book.toLowerCase() || currentBook.abbreviation.toLowerCase() === chapterData.abbreviation.toLowerCase())
    const currentBookIndex: number = allBooksData.books.indexOf(currentBook)
    const currentBookTotalChapters: number = currentBook.chapters.length
    
    function navigationHandler(direction: TDirection): INavigation {
        let chapterInfo: IChapterInfo | null = null

        switch (direction) {
            case "previous":
                if (currentChapter > 1) {
                    chapterInfo = {
                        bookAbbreviation: currentBook.abbreviation,
                        chapterNumber: currentChapter - 1
                    }
                } else if (currentBookIndex > 0) {
                    const previousBook: IBibleBook = allBooksData.books[currentBookIndex - 1]
                    const previousBookTotalChapters: number = previousBook.chapters.length
                
                    chapterInfo = {
                        bookAbbreviation: previousBook.abbreviation,
                        chapterNumber: previousBookTotalChapters
                    }
                }

                break
                
            case "next":
                if (currentChapter < currentBookTotalChapters) {
                    chapterInfo = {
                        bookAbbreviation: currentBook.abbreviation,
                        chapterNumber: currentChapter + 1
                    }
                } else if (currentBookIndex < allBooksData.books.length - 1) {
                    const nextBook: IBibleBook = allBooksData.books[currentBookIndex + 1]
                    
                    chapterInfo = {
                        bookAbbreviation: nextBook.abbreviation,
                        chapterNumber: 1
                    }
                }

                break
        }
        
        if (chapterInfo) {
            const link: string = `/books/${encodeURIComponent(chapterInfo.bookAbbreviation.toLowerCase())}/${chapterInfo.chapterNumber}`
            
            return {
                info: chapterInfo,
                link
            }
        }
        
        return {
            info: null,
            link: null
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

    return (
        <React.Fragment>
            <TitleManager title={`${chapterData.book} ${chapterData.chapter} (ARC)`} />
            <section className="book-bible-page">
                <div className="container">
                    <div className="options">
                        <select disabled>
                            <option value="ARC">ARC</option>
                        </select>
                        <AudioPlayerButton verses={chapterData.verses} book={chapterData.book} chapter={chapterData.chapter} />
                        <ChapterOptions />
                    </div>
                    <div className="chapter">
                        <h1>{chapterData.book} <span className="chapter-number">{chapterData.chapter}</span></h1>
                    </div>
                    <div className="content">
                        <NavigationButton direction="previous" data={navigationHandler("previous")} aria-label={`${navigationHandler("previous").info.chapterNumber}`} />
                        <div className="verses">
                            {chapterData.verses.map((text: string, index: number): React.JSX.Element => {
                                const verse: number = index + 1
                                
                                return (
                                    <div className="verse" key={verse} style={{ animation: `appear-from-top 500ms ease ${verse * 25}ms both` }}>
                                        <sup className="number">{verse}</sup>
                                        <p className="text">{text}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <NavigationButton direction="next" data={navigationHandler("next")} aria-label={`${navigationHandler("next").info.chapterNumber}`} />
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

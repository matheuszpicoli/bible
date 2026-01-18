import React, { createElement } from "react"
import type { IBibleBook, IBibleResponse } from "../../../../../types/types"
import IconManager from "../../../components/icons/IconManager"
import Link from "next/link"
import TitleManager from "../../../components/TitleManager"

type TDirection = "previous" | "next"

interface IChapterInfo {
    bookName: string
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
                        bookName: currentBook.book,
                        chapterNumber: currentChapter - 1
                    }
                } else if (currentBookIndex > 0) {
                    const previousBook: IBibleBook = allBooksData.books[currentBookIndex - 1]
                    const previousBookTotalChapters: number = previousBook.chapters.length
                
                    chapterInfo = {
                        bookName: previousBook.book,
                        chapterNumber: previousBookTotalChapters
                    }
                }

                break
                
            case "next":
                if (currentChapter < currentBookTotalChapters) {
                    chapterInfo = {
                        bookName: currentBook.book,
                        chapterNumber: currentChapter + 1
                    }
                } else if (currentBookIndex < allBooksData.books.length - 1) {
                    const nextBook: IBibleBook = allBooksData.books[currentBookIndex + 1]
                    
                    chapterInfo = {
                        bookName: nextBook.book,
                        chapterNumber: 1
                    }
                }

                break
        }
        
        if (chapterInfo) {
            const link: string = `/books/${encodeURIComponent(chapterInfo.bookName.toLowerCase())}/${chapterInfo.chapterNumber}`
            
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

    function NavigationButton({ direction, data }: { direction: TDirection; data: INavigation }): React.JSX.Element {
        if (data.link && data.info) {
            const { bookName, chapterNumber } = data.info
            const isPrevious: boolean = direction === "previous"
            
            return (
                <Link href={data.link} className={`navigation-button ${direction}`} aria-label={`${bookName} ${chapterNumber}`} prefetch={true}>
                    {createElement(IconManager.get(isPrevious ? "arrowLeft" : "arrowRight"))}
                </Link>
            )
        }
        
        return null
    }

    return (
        <React.Fragment>
            {/* <TitleManager title={`${chapterData.book} ${chapterData.chapter} (ARC)`} /> */}
            <section className="book-bible">
                <div className="container">
                    <div className="options">
                        <select disabled>
                            <option value="ARC">ARC</option>
                        </select>
                        <button>
                            {createElement(IconManager.get("volume"))}
                        </button>
                        <button>
                            {createElement(IconManager.get("dots"))}
                        </button>
                    </div>
                    <div className="chapter">
                        <h1>{chapterData.book} <span className="chapter-number">{chapterData.chapter}</span></h1>
                    </div>
                    <div className="content">
                        <NavigationButton direction="previous" data={navigationHandler("previous")} />
                        <div className="verses">
                            {chapterData.verses.map((text: string, index: number): React.JSX.Element => {
                                const verse: number = index + 1
                                
                                return (
                                    <div key={verse} style={{ animation: `appear-from-top 500ms ease ${verse * 25}ms both` }}>
                                        <sup className="verse">{verse}</sup>
                                        <p className="text">{text}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <NavigationButton direction="next" data={navigationHandler("next")} />
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

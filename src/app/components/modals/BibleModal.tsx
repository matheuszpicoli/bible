import React, { useState, useLayoutEffect } from "react"
import Loader from "../Loader"
import type { IBibleBook, IBibleData } from "../../../../types/types"

export default function BibleModal(): React.JSX.Element {
    const [books, setBooks] = useState<Array<IBibleBook>>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [openBookIndex, setOpenBookIndex] = useState<Partial<number>>(null)

    useLayoutEffect((): void => {
        const getBooks = async (): Promise<void> => {
            setIsLoading(true)

            try {
                const response: Response = await fetch("/api/bible")
                const data: IBibleData = await response.json()
                
                setBooks(data.books)
            } catch (error: unknown) {
                console.error(`[${error?.constructor?.name}]: ${error instanceof Error ? error.message : String(error)}`)
            } finally {
                setIsLoading(false)
            }
        }

        getBooks()
    }, [])

    const handleBookClick = (index: number): void => {
        setOpenBookIndex(openBookIndex === index ? null : index)
    }

    function BookAccordion({ book, index, isOpen, isClicked }: { book: IBibleBook; index: number;isOpen: boolean; isClicked: (index: number) => void }): React.JSX.Element {
        return (
            <div className="book-accordion">
                <div aria-expanded={isOpen} className="book-accordion-header" onClick={(): void => isClicked(index)}>
                    <span className="book-title">{book.book}</span>
                    <span className="book-accordion-icon">{isOpen ? "−" : "+"}</span>
                </div>
                
                {isOpen && (
                    <div className="book-accordion-content">
                        <div className="chapters-grid">
                            {Array.from({ length: book.chapters.length }, (_: unknown, chapterIndex: number): React.JSX.Element => (
                                <button key={chapterIndex + 1} type="button" className="chapter-button">
                                    {chapterIndex + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bible-modal">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="books-list">
                    {books.map((book: IBibleBook, index: number): React.JSX.Element => (
                        <BookAccordion  key={index}  book={book}  index={index} isOpen={openBookIndex === index} isClicked={handleBookClick} />
                    ))}
                </div>
            )}
        </div>
    )
}

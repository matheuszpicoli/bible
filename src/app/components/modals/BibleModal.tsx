import React, { useState, useLayoutEffect, createElement } from "react"
import IconManager from "../icons/IconManager"
import Link from "next/link"
import Loader from "../Loader"
import type { IBibleBook, IBibleData } from "../../../../types/types"

export default function BibleModal(): React.JSX.Element {
    const [books, setBooks] = useState<Array<IBibleBook>>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [openBookIndex, setOpenBookIndex] = useState<Partial<number>>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")

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

    const handleBookClick = (index: number): void => setOpenBookIndex(openBookIndex === index ? null : index)
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(event.target.value.toLowerCase())
    const filteredBooks: Array<IBibleBook> = books.filter((book: IBibleBook): boolean => book.book.toLowerCase().includes(searchTerm.toLowerCase()))

    function BookAccordion({ book, index, isOpen, isClicked }: { book: IBibleBook; index: number; isOpen: boolean; isClicked: (index: number) => void }): React.JSX.Element {
        return (
            <div className="book-accordion">
                <div aria-expanded={isOpen} className="book-accordion-header" onClick={(): void => isClicked(index)}>
                    <span className="book-title">{book.book}</span>
                    <span className="book-accordion-icon">{isOpen ? "−" : "+"}</span>
                </div>
                
                {isOpen && (
                    <div className="book-accordion-content">
                        <div className="chapters-grid">
                            {Array.from({ length: book.chapters.length }, (_: unknown, chapterIndex: number): React.JSX.Element => {
                                const chapter: number = chapterIndex + 1
                                const href: string = `/books/${book.abbreviation.toLowerCase()}/${chapter}`
                                
                                const closeModal = (event: React.MouseEvent<HTMLAnchorElement>): void => {
                                    const escKey: KeyboardEvent = new KeyboardEvent("keydown", {
                                        key: "Escape",
                                        code: "Escape",
                                        keyCode: 27,
                                        bubbles: true,
                                        cancelable: true
                                    })
                                    
                                    event.currentTarget.dispatchEvent(escKey)
                                }
                                
                                return (
                                    <Link key={chapter} href={href} className="chapter-link" onClick={closeModal}>
                                        {chapter}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const shouldShowTestament = (index: number, filteredBooks: Array<IBibleBook>): string | null => {
        if (searchTerm.trim() === "") {
            const testament: Record<number, string> = {
                0: "Antigo Testamento",
                39: "Novo Testamento"
            }
            
            return testament[index] || null
        }
        
        const book: IBibleBook = books[index]
        const isOldTestament: boolean = index < 39
        const firstVisibleBookInTestament: IBibleBook = filteredBooks.find((firstBook: IBibleBook): boolean => {
            const firstBookIndex: number = books.findIndex((book: IBibleBook): boolean => book.book === firstBook.book)

            return isOldTestament ? firstBookIndex < 39 : firstBookIndex >= 39
        })
        
        if (firstVisibleBookInTestament?.book === book.book) {
            return isOldTestament ? "Antigo Testamento" : "Novo Testamento"
        }
        
        return null
    }

    return (
        <div className="bible-modal">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="books-list">
                    <div className="books-list-search">
                        <div className="search-input-wrapper">
                            <input type="search" name="input-find-book" className="input-find-book" id="input-find-book" list="books-list" placeholder="Pesquisar" value={searchTerm}onChange={handleSearchChange} autoFocus />
                            <label className="label-find-book" htmlFor="input-find-book">
                                {createElement(IconManager.get("search"))}
                            </label>
                            <datalist id="books-list">
                                {books.map((book: IBibleBook, index: number): React.JSX.Element => (
                                    <option key={index} value={book.book} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    
                    {filteredBooks.length === 0 ? (
                        <div className="no-results">
                            Nenhum livro encontrado para "{searchTerm}"
                        </div>
                    ) : (
                        <React.Fragment>
                            {filteredBooks.map((book: IBibleBook): React.JSX.Element => {
                                const originalIndex: number = books.findIndex((filteredBook: IBibleBook): boolean => book.book === filteredBook.book)
                                const testamentTitle: string = shouldShowTestament(originalIndex, filteredBooks)
                                
                                return (
                                    <React.Fragment key={originalIndex}>
                                        {testamentTitle && <small className="book-testament">{testamentTitle}</small>}
                                        <BookAccordion book={book} index={originalIndex} isOpen={openBookIndex === originalIndex} isClicked={handleBookClick} />
                                    </React.Fragment>
                                )
                            })}
                            {searchTerm.trim() !== "" && <small className="books-found">Livros encontrados: {filteredBooks.length}</small>}
                        </React.Fragment>
                    )}
                </div>
            )}
        </div>
    )
}

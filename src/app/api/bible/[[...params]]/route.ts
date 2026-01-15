import { NextRequest } from "next/server"
import arcBible from "../../../../../data/arc_bible.json"
import type { IBibleBook, IBibleVerse, IBibleResponse } from "../../../../../types/types"

interface IValidRequest {
    valid: boolean
    chapter?: number
    error?: Response
}

class BibleAPIHandler {
    private bibleData: Array<IBibleBook>

    constructor() {
        this.bibleData = arcBible as Array<IBibleBook>
    }

    private findBook(bookParam: string): IBibleBook | null {
        const decodedBook: string = decodeURIComponent(bookParam).toLowerCase()
        
        return this.bibleData.find((book: IBibleBook) => book.book.toLowerCase() === decodedBook || book.abbreviation.toLowerCase() === decodedBook) || null
    }

    private findChapter(book: IBibleBook, chapterNumber: number): IBibleVerse | null {
        return book.chapters.find((chapter: IBibleVerse) => chapter.chapter === chapterNumber) || null
    }

    private getVerseText(chapter: IBibleVerse, verseNumber: number): string | null {
        if (verseNumber < 1 || verseNumber > chapter.verses.length) {
            return null
        }
        
        return chapter.verses[verseNumber - 1]
    }

    private getVerseRange(chapter: IBibleVerse, start: number, end?: number): Array<string> {
        const endVerse: number = end || start
        
        return chapter.verses.slice(start - 1, endVerse)
    }

    private validateChapterNumber(chapterParam: string): IValidRequest {
        const chapterNumber: number = parseInt(chapterParam, 10)

        if (isNaN(chapterNumber) || chapterNumber < 1) {
            return {
                valid: false,
                error: Response.json(
                    {
                        error: "Capítulo inválido."
                    },
                    { 
                        status: 400,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
            }
        }

        return {
            valid: true,
            chapter: chapterNumber
        }
    }

    private validateVerseNumber(chapter: IBibleVerse, verseParam: string): { valid: boolean; verse?: number; error?: Response } {
        const verseNumber: number = parseInt(verseParam, 10)

        if (isNaN(verseNumber) || verseNumber < 1 || verseNumber > chapter.verses.length) {
            return {
                valid: false,
                error: Response.json(
                    {
                        error: "Versículo inválido",
                        availableVerses: `1-${chapter.verses.length}`
                    },
                    {
                        status: 400
                    }
                )
            }
        }

        return {
            valid: true,
            verse: verseNumber
        }
    }

    private validateRange(chapter: IBibleVerse, range: string): { valid: boolean; start?: number; end?: number; error?: Response } {
        const [startStr, endStr] = range.split("-").map((verse: string) => verse.trim())
        const start: number = parseInt(startStr, 10)
        const end: number = endStr ? parseInt(endStr, 10) : start

        if (isNaN(start) || start < 1 || start > chapter.verses.length) {
            return {
                valid: false,
                error: Response.json(
                    { 
                        error: "Versículo inicial inválido",
                        validRange: `1-${chapter.verses.length}`
                    },
                    {
                        status: 400
                    }
                )
            }
        }

        return {
            valid: true,
            start,
            end
        }
    }

    private createResponse(data: IBibleResponse, status: number = 200): Response {
        return Response.json(data, {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    private createErrorResponse(message: string, status: number, details?: any): Response {
        const errorResponse: any = { error: message }
        
        if (details) {
            Object.assign(errorResponse, details)
        }

        return Response.json(errorResponse, {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    public async handleRequest(request: NextRequest, params: Promise<{ params?: Array<string> }>): Promise<Response> {
        try {
            const resolvedParams: { params?: Array<string> } = await params
            const pathParams: Array<string> = resolvedParams.params || []
            const { searchParams } = new URL(request.url)
            const range: string = searchParams.get("range")

            switch (pathParams.length) {
                case 0:
                    return this.createResponse({ 
                        books: this.bibleData,
                        totalBooks: this.bibleData.length
                    } as any)

                case 1:
                    return this.handleBookRequest(pathParams)

                case 2:
                    return this.handleChapterRequest(pathParams, range)

                case 3:
                    return this.handleVerseRequest(pathParams)

                default:
                    return this.createErrorResponse("Formato inválido", 400)
            }
        } catch (error: unknown) {
            console.error(`[${error?.constructor?.name}]: ${error instanceof Error ? error.message : String(error)}`)
            
            return this.createErrorResponse("Erro interno do servidor", 500)
        }
    }

    private handleBookRequest(pathParams: Array<string>): Response {
        const book: IBibleBook = this.findBook(pathParams[0])

        if (!book) {
            return this.createErrorResponse(
                "Livro não encontrado",
                404,
                {
                    suggestions: this.bibleData.map((book: IBibleBook) => ({ 
                        book: book.book, 
                        abbreviation: book.abbreviation 
                    }))
                }
            )
        }

        return this.createResponse({
            book: book.book,
            abbreviation: book.abbreviation,
            chapters: book.chapters,
            totalChapters: book.chapters.length
        } as any)
    }

    private handleChapterRequest(pathParams: Array<string>, range: string): Response {
        const book: IBibleBook = this.findBook(pathParams[0])

        if (!book) {
            return this.createErrorResponse(
                "Livro não encontrado",
                404,
                {
                    suggestions: this.bibleData.map((book: IBibleBook) => ({ 
                        book: book.book, 
                        abbreviation: book.abbreviation 
                    }))
                }
            )
        }

        const chapterValidation: IValidRequest = this.validateChapterNumber(pathParams[1])

        if (!chapterValidation.valid) {
            return chapterValidation.error!
        }

        const chapter: IBibleVerse = this.findChapter(book, chapterValidation.chapter!)
        
        if (!chapter) {
            return this.createErrorResponse(
                "Capítulo não encontrado",
                404,
                {
                    book: book.book,
                    availableChapters: book.chapters.map((chapter: IBibleVerse) => chapter.chapter)
                }
            )
        }

        if (range) {
            const rangeValidation: { valid: boolean; start?: number; end?: number; error?: Response } = this.validateRange(chapter, range)
            
            if (!rangeValidation.valid) {
                return rangeValidation.error!
            }

            const verses: Array<string> = this.getVerseRange(chapter, rangeValidation.start!, rangeValidation.end)

            return this.createResponse({
                book: book.book,
                abbreviation: book.abbreviation,
                chapter: chapter.chapter,
                verses,
                range: `${rangeValidation.start}${rangeValidation.end !== rangeValidation.start ? `-${rangeValidation.end}` : ""}`,
                totalVerses: verses.length
            })
        }

        return this.createResponse({
            book: book.book,
            abbreviation: book.abbreviation,
            chapter: chapter.chapter,
            verses: chapter.verses,
            totalVerses: chapter.verses.length
        })
    }

    private handleVerseRequest(pathParams: Array<string>): Response {
        const book: IBibleBook = this.findBook(pathParams[0])

        if (!book) {
            return this.createErrorResponse(
                "Livro não encontrado",
                404,
                {
                    suggestions: this.bibleData.map((book: IBibleBook) => ({ 
                        book: book.book, 
                        abbreviation: book.abbreviation 
                    }))
                }
            )
        }

        const chapterValidation: IValidRequest = this.validateChapterNumber(pathParams[1])

        if (!chapterValidation.valid) {
            return chapterValidation.error!
        }

        const chapter: IBibleVerse = this.findChapter(book, chapterValidation.chapter!)
        
        if (!chapter) {
            return this.createErrorResponse(
                "Capítulo não encontrado",
                404,
                {
                    book: book.book,
                    availableChapters: book.chapters.map((chapter: IBibleVerse) => chapter.chapter)
                }
            )
        }

        const verseValidation: { valid: boolean; verse?: number; error?: Response } = this.validateVerseNumber(chapter, pathParams[2])
        
        if (!verseValidation.valid) {
            return verseValidation.error!
        }

        const verseText: string = this.getVerseText(chapter, verseValidation.verse!)

        if (!verseText) {
            return this.createErrorResponse(
                "Versículo não encontrado",
                404,
                {
                    book: book.book,
                    chapter: chapter.chapter,
                    availableVerses: `1-${chapter.verses.length}`
                }
            )
        }

        return this.createResponse({
            book: book.book,
            abbreviation: book.abbreviation,
            chapter: chapter.chapter,
            verse: verseValidation.verse,
            text: verseText,
            totalVerses: chapter.verses.length
        })
    }

    public getAllBooks(): Array<IBibleBook> {
        return this.bibleData
    }

    public getBookByName(name: string): IBibleBook | null {
        return this.findBook(name)
    }

    public getChapter(bookName: string, chapterNumber: number): { book: IBibleBook; chapter: IBibleVerse } | null {
        const book: IBibleBook = this.findBook(bookName)
        
        if (!book) {
            return null
        }

        const chapter: IBibleVerse = this.findChapter(book, chapterNumber)
        
        if (!chapter) {
            return null
        }

        return {
            book,
            chapter
        }
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ params?: Array<string> }> }): Promise<Response> {
    return new BibleAPIHandler().handleRequest(request, params)
}

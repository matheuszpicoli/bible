export interface IBibleVerse {
    chapter: number
    verses: Array<string>
}

export interface IBibleBook {
    book: string
    abbreviation: string
    chapters: Array<IBibleVerse>
}

export interface IBibleResponse {
    book: string
    abbreviation: string
    chapter?: number
    verse?: number
    verses?: Array<string>
    text?: string
    range?: string
    totalVerses?: number
}

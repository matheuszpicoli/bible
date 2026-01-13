import Image from "next/image"
import React from "react"
import type { IBibleBook, IBibleData, IBibleResponse, IBibleVerse } from "../../types/types"

export default async function Bible(): Promise<React.JSX.Element> {
    const response: Response = await fetch("http://localhost:3000/api/bible", { cache: "no-store" })
    const data: IBibleData = await response.json()
    const now: Date = new Date()
    const daySeed: number = (now.getFullYear() * 10000 + (now.getMonth() + 1)) * 100 + now.getDate()
    const versesImagesPath: Array<string> = Array.from({ length: 22 }, (_: unknown, index: number) => `/assets/ImageForVerseOfTheDay (${index + 1}).jpg`)   
    const imageIndex: number = daySeed % versesImagesPath.length
    const dailyImage: string = versesImagesPath[imageIndex]
    const bookIndex: number = daySeed % data.books.length
    const book: IBibleBook = data.books[bookIndex]
    const chapterIndex: number = (daySeed + 1) % book.chapters.length
    const chapter: IBibleVerse = book.chapters[chapterIndex]
    const verseIndex: number = (daySeed + 2) % chapter.verses.length
    const dailyVerse: IBibleResponse = {
        book: book.book,
        chapter: chapter.chapter,
        abbreviation: book.abbreviation,
        verse: verseIndex + 1,
        text: chapter.verses[verseIndex]
    }

    const saudation = (timeOfDay: number): string => {
        const message: Array<string> = Array(24)
            .fill("Boa noite")
            .fill("Boa tarde", 12, 18)
            .fill("Bom dia", 5, 12)
        
        return message[Math.floor(timeOfDay)]
    }

    const currentDate: string = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).toString()

    return (
        <section className="home-page">
            <h2>
                {saudation(now.getHours())}
            </h2>
            <div className="card-gallery">
                <div className="card">
                    <Image 
                        src={dailyImage} 
                        alt="Imagem do versículo do dia" 
                        priority
                        fill
                    />
                    <div className="card-content">
                        <h3 className="card-title">{dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}</h3>
                        <q className="card-description">
                            {dailyVerse.text}
                        </q>
                        <div className="card-tags">
                            <button className="tag">Bíblia</button>
                            <button className="tag">Versículo</button>
                            <button className="tag">Inspiração</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="current-date">
                {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
            </div>
        </section>
    )
}

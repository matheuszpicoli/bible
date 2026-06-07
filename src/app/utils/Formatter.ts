import type { IBibleResponse } from "../../../types/types"

type TFormatterRules = Pick<IBibleResponse, "abbreviation" | "chapter" | "verse"> & {
    start: number | string
    end?: number
}

type TActionType = "red-letter" | "title"

export default class Formatter {
    private version        : "ARC"
    private redLetterRules : Array<TFormatterRules>
    private titleRules     : Array<TFormatterRules>

    constructor(version: "ARC") {
        this.version        = version
        this.redLetterRules = []
        this.titleRules     = []
    }

    private addRules(rulesArray: Array<TFormatterRules>, abbreviation: TFormatterRules["abbreviation"], rules: Array<[TFormatterRules["chapter"], TFormatterRules["verse"], number | string, number?]>): void {
        rules.forEach(([chapter, verse, start, end]): void => {
            const rule: TFormatterRules = { 
                abbreviation: abbreviation, 
                chapter, 
                verse, 
                start: start as number | string
            }

            if (end !== undefined && typeof end === "number") {
                rule.end = end
            }
            
            rulesArray.push(rule)
        })
    }

    private addRulesRange(chapter: TFormatterRules["chapter"], startVerse: number, endVerse: number, start: number = 1, end?: number): Array<[TFormatterRules["chapter"], number, number, number?]> {
        const rules: Array<[TFormatterRules["chapter"], number, number, number?]> = []

        for (let verse = startVerse; verse <= endVerse; verse++) {
            if (end !== undefined) {
                rules.push([chapter, verse, start, end])
            } else {
                rules.push([chapter, verse, start])
            }
        }
        
        return rules
    }

    private applyRules(rulesArray: Array<TFormatterRules>, abbreviation: TFormatterRules["abbreviation"], chapter: TFormatterRules["chapter"], verse: TFormatterRules["verse"], actionType: TActionType): void {
        const applicableRules: Array<TFormatterRules> = rulesArray.filter((rule: TFormatterRules): boolean => 
            rule.abbreviation === abbreviation && 
            rule.chapter === chapter && 
            rule.verse === verse
        )

        if (applicableRules.length === 0) {
            return
        }

        if (actionType === "title") {
            const verseContainer: Element = document.querySelector(`.${this.version}.${CSS.escape(abbreviation)}.c${chapter}v${verse}`)
            
            if (!verseContainer) {
                return
            }

            applicableRules.forEach((rule: TFormatterRules): void => {
                if (typeof rule.start === "string") {
                    const existingTitle: Element = verseContainer.querySelector(".verse-title")
                    
                    if (existingTitle) {
                        existingTitle.remove()
                    }

                    const titleElement: HTMLHeadingElement = document.createElement("h2")
                    titleElement.className = "verse-title"
                    titleElement.textContent = rule.start
                    
                    const verseText: Element = verseContainer.querySelector(".verse-text")

                    if (verseText) {
                        verseContainer.insertAdjacentElement("afterbegin", titleElement)
                    }
                }
            })
        } else {
            const words: NodeListOf<Element> = document.querySelectorAll(`.${this.version}.${CSS.escape(abbreviation)}.c${chapter}v${verse} .word`)

            if (words.length === 0) {
                return
            }

            applicableRules.forEach((rule: TFormatterRules): void => {
                if (typeof rule.start !== "number") {
                    return
                }
                
                const startWord: number = rule.start
                
                words.forEach((word: Element, index: number): void => {
                    const wordPosition: number = index + 1
                    
                    let shouldApply: boolean = false
                    
                    if (rule.end !== undefined) {
                        shouldApply = wordPosition >= startWord && wordPosition <= rule.end
                    } else {
                        shouldApply = wordPosition >= startWord
                    }
                    
                    if (shouldApply) {
                        word.classList.add("red-letter")
                    }
                })
            })
        }
    }

    private initializeRedLetterRules(): void {
        if (this.redLetterRules.length > 0) {
            return
        }
        
        switch (this.version) {
            case "ARC":
                // ----------------------------------------------------------------------------
                // Mateus (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "Mt", [
                    // Mateus 3
                    [3, 15, 5, 15],
                    // Mateus 4
                    [4, 4, 5, 24],
                    [4, 7, 3, 11],
                    [4, 10, 4, 18],
                    [4, 17, 10, 17],
                    [4, 19, 3, 12],
                    // Mateus 5
                    ...this.addRulesRange(5, 1, 48),
                    // Mateus 6
                    ...this.addRulesRange(6, 1, 34),
                    // Mateus 7
                    ...this.addRulesRange(7, 1, 27),
                    // Mateus 8
                    [8, 3, 8, 10],
                    [8, 4, 4],
                    [8, 7, 5],
                    [8, 10, 12],
                    ...this.addRulesRange(8, 11, 12),
                    [8, 13, 6, 12],
                    [8, 20, 4],
                    [8, 22, 4],
                    [8, 26, 4, 10],
                    [8, 32, 5, 5],
                    // Mateus 9
                    [9, 2, 10],
                    [9, 4, 8],
                    [9, 5, 1],
                    [9, 6, 1, 16],
                    [9, 6, 22],
                    [9, 9, 16, 16],
                    [9, 12, 5],
                    [9, 13, 1],
                    [9, 15, 4],
                    ...this.addRulesRange(9, 16, 17),
                    [9, 22, 7, 15],
                    [9, 24, 2, 10],
                    [9, 28, 14, 20],
                    [9, 29, 7],
                    [9, 30, 11],
                    [9, 37, 6],
                    [9, 38, 1],
                    // Mateus 10
                    [10, 5, 9],
                    ...this.addRulesRange(10, 6, 42),
                    // Mateus 11
                    [11, 4, 5],
                    ...this.addRulesRange(11, 5, 6),
                    [11, 7, 14],
                    ...this.addRulesRange(11, 8, 19),
                    ...this.addRulesRange(11, 21, 24),
                    [11, 25, 6],
                    ...this.addRulesRange(11, 26, 30),
                    // Mateus 12
                    [12, 3, 5],
                    ...this.addRulesRange(12, 4, 8),
                    [12, 11, 5],
                    [12, 12, 1],
                    [12, 13, 5, 7],
                    [12, 25, 8],
                    ...this.addRulesRange(12, 26, 37),
                    [12, 39, 7],
                    ...this.addRulesRange(12, 40, 45),
                    [12, 48, 9],
                    [12, 49, 11],
                    [12, 50, 1],
                    // Mateus 13
                    [13, 3, 9],
                    ...this.addRulesRange(13, 4, 9),
                    [13, 11, 4],
                    ...this.addRulesRange(13, 12, 23),
                    [13, 24, 5],
                    ...this.addRulesRange(13, 25, 30),
                    [13, 31, 6],
                    [13, 32, 1],
                    [13, 33, 5],
                    [13, 37, 5],
                    ...this.addRulesRange(13, 38, 50),
                    [13, 51, 4, 7],
                    [13, 52, 4],
                    [13, 57, 8],
                    // Mateus 14
                    [14, 16, 5],
                    [14, 18, 4],
                    [14, 27, 7],
                    [14, 29, 4, 4],
                    [14, 31, 10],
                    // Mateus 15
                    [15, 3, 5],
                    ...this.addRulesRange(15, 4, 9),
                    [15, 10, 8],
                    [15, 11, 1],
                    [15, 13, 5],
                    [15, 14, 1],
                    [15, 16, 4],
                    ...this.addRulesRange(15, 17, 20),
                    [15, 24, 5],
                    [15, 26, 5],
                    [15, 28, 6, 20],
                    [15, 32, 8],
                    [15, 34, 4, 6],
                    // Mateus 16
                    [16, 2, 5],
                    [16, 3, 1],
                    [16, 4, 1, 20],
                    [16, 6, 4],
                    [16, 8, 6],
                    ...this.addRulesRange(16, 9, 11),
                    [16, 13, 15],
                    [16, 15, 3],
                    [16, 17, 5],
                    ...this.addRulesRange(16, 18, 19),
                    [16, 23, 7],
                    [16, 24, 7],
                    ...this.addRulesRange(16, 25, 28),
                    // Mateus 17
                    [17, 7, 7],
                    [17, 9, 10],
                    [17, 11, 5],
                    [17, 12, 1],
                    [17, 17, 5],
                    [17, 20, 5],
                    [17, 21, 1],
                    [17, 22, 8],
                    [17, 23, 1, 7],
                    [17, 25, 13],
                    [17, 26, 7],
                    [17, 27, 1],
                    // Mateus 18
                    [18, 3, 3],
                    ...this.addRulesRange(18, 4, 20),
                    [18, 22, 4],
                    ...this.addRulesRange(18, 23, 35),
                    // Mateus 19
                    [19, 4, 5],
                    ...this.addRulesRange(19, 5, 6),
                    [19, 8, 3],
                    [19, 9, 1],
                    [19, 11, 5],
                    [19, 12, 1],
                    [19, 14, 4],
                    [19, 17, 4],
                    [19, 18, 7],
                    [19, 19, 1],
                    [19, 21, 3],
                    [19, 23, 7],
                    [19, 24, 1],
                    [19, 26, 7],
                    [19, 28, 4],
                    ...this.addRulesRange(19, 29, 30),
                    // Mateus 20
                    ...this.addRulesRange(20, 1, 16),
                    ...this.addRulesRange(20, 18, 19),
                    [20, 21, 4, 5],
                    [20, 22, 5, 30],
                    [20, 23, 4],
                    [20, 25, 9],
                    ...this.addRulesRange(20, 26, 28),
                    [20, 32, 7],
                    // Mateus 21
                    ...this.addRulesRange(21, 2, 3),
                    [21, 13, 3],
                    [21, 16, 12],
                    [21, 19, 19, 24],
                    [21, 21, 5],
                    [21, 22, 1],
                    [21, 24, 5],
                    [21, 25, 1, 11],
                    [21, 27, 10],
                    ...this.addRulesRange(21, 28, 30),
                    [21, 31, 1, 8],
                    [21, 31, 15],
                    ...this.addRulesRange(21, 32, 40),
                    [21, 42, 3],
                    ...this.addRulesRange(21, 43, 44),
                    // Mateus 22
                    ...this.addRulesRange(22, 2, 14),
                    [22, 18, 8],
                    [22, 19, 1, 5],
                    [22, 20, 4],
                    [22, 21, 9],
                    [22, 29, 5],
                    ...this.addRulesRange(22, 30, 32),
                    [22, 37, 4],
                    ...this.addRulesRange(22, 38, 40),
                    [22, 42, 2, 10],
                    [22, 43, 3],
                    ...this.addRulesRange(22, 44, 45),
                    // Mateus 23
                    [23, 2, 2],
                    ...this.addRulesRange(23, 3, 39),
                    // Mateus 24
                    [24, 2, 5],
                    [24, 4, 5],
                    ...this.addRulesRange(24, 5, 51),
                    // Mateus 25
                    ...this.addRulesRange(25, 1, 46),
                    // Mateus 26
                    [26, 2, 1],
                    [26, 10, 6],
                    ...this.addRulesRange(26, 11, 13),
                    [26, 18, 4],
                    [26, 21, 5],
                    [26, 23, 5],
                    [26, 24, 1],
                    [26, 25, 15],
                    [26, 26, 19],
                    [26, 27, 10],
                    ...this.addRulesRange(26, 28, 29),
                    [26, 31, 5],
                    [26, 32, 1],
                    [26, 34, 3],
                    [26, 36, 16],
                    [26, 38, 4],
                    [26, 39, 16],
                    [26, 40, 13],
                    [26, 41, 1],
                    [26, 42, 7],
                    [26, 45, 9],
                    [26, 46, 1],
                    [26, 50, 5, 8],
                    [26, 52, 4],
                    ...this.addRulesRange(26, 53, 54),
                    [26, 55, 6],
                    [26, 56, 1, 12],
                    [26, 64, 3],
                    [26, 75, 11, 19],
                    // Mateus 27
                    [27, 11, 24],
                    [27, 46, 12, 15],
                    [27, 46, 18],
                    // Mateus 28
                    [28, 9, 19, 21],
                    [28, 10, 4],
                    [28, 18, 6],
                    [28, 19, 1],
                    [28, 20, 1, 25]
                ]),
                // ----------------------------------------------------------------------------
                // Marcos (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "Mc", [
                    // Marcos 1
                    [1, 15, 3],
                    [1, 17, 5],
                    [1, 25, 5],
                    [1, 38, 5],
                    [1, 41, 14],
                    [1, 44, 3],
                    // Marcos 2
                    [2, 5, 10],
                    [2, 8, 15],
                    [2, 9, 1],
                    [2, 10, 1, 16],
                    [2, 11, 1],
                    [2, 14, 13, 13],
                    [2, 17, 7],
                    [2, 19, 4],
                    ...this.addRulesRange(2, 20, 22),
                    [2, 25, 4],
                    [2, 26, 1],
                    [2, 27, 3],
                    [2, 28, 1],
                    // Marcos 3
                    [3, 3, 10],
                    [3, 4, 3, 16],
                    [3, 5, 18, 20],
                    [3, 23, 8],
                    ...this.addRulesRange(3, 24, 29),
                    [3, 33, 6],
                    [3, 34, 13],
                    [3, 35, 1],
                    // Marcos 4
                    ...this.addRulesRange(4, 3, 8),
                    [4, 9, 3],
                    [4, 11, 4],
                    [4, 12, 1],
                    [4, 13, 3],
                    ...this.addRulesRange(4, 14, 20),
                    [4, 21, 3],
                    ...this.addRulesRange(4, 22, 23),
                    [4, 24, 3],
                    [4, 25, 1],
                    [4, 26, 3],
                    ...this.addRulesRange(4, 27, 29),
                    [4, 30, 3],
                    ...this.addRulesRange(4, 31, 32),
                    [4, 35, 8],
                    [4, 39, 11, 12],
                    [4, 40, 3],
                    // Marcos 5
                    [5, 8, 4],
                    [5, 9, 3, 7],
                    [5, 19, 8],
                    [5, 30, 17],
                    [5, 34, 5],
                    [5, 36, 12],
                    [5, 39, 4],
                    [5, 41, 8, 9],
                    [5, 41, 13],
                    // Marcos 6
                    [6, 4, 5],
                    [6, 10, 3],
                    [6, 11, 1],
                    [6, 31, 4, 16],
                    [6, 37, 6, 9],
                    [6, 38, 4, 8],
                    [6, 50, 14],
                    // Marcos 7
                    [7, 6, 5],
                    ...this.addRulesRange(7, 7, 8),
                    [7, 9, 3],
                    ...this.addRulesRange(7, 10, 13),
                    [7, 14, 8],
                    ...this.addRulesRange(7, 15, 16),
                    [7, 18, 4],
                    [7, 19, 1],
                    [7, 20, 3],
                    ...this.addRulesRange(7, 21, 23),
                    [7, 27, 4],
                    [7, 29, 4],
                    [7, 34, 10, 10],
                    [7, 34, 13, 13],
                    // Marcos 8
                    ...this.addRulesRange(8, 2, 3),
                    [8, 5, 3, 5],
                    [8, 12, 8],
                    [8, 15, 4],
                    [8, 17, 6],
                    [8, 18, 1],
                    [8, 19, 1, 15],
                    [8, 20, 1, 15],
                    [8, 21, 5],
                    [8, 26, 7],
                    [8, 27, 23],
                    [8, 29, 5, 11],
                    [8, 33, 14],
                    [8, 34, 12],
                    ...this.addRulesRange(8, 35, 38),
                    // Marcos 9
                    [9, 1, 3],
                    [9, 12, 5],
                    [9, 13, 1],
                    [9, 16, 5],
                    [9, 19, 5],
                    [9, 23, 4],
                    [9, 25, 13],
                    [9, 29, 3],
                    [9, 31, 9],
                    [9, 33, 10],
                    [9, 35, 9],
                    [9, 37, 1],
                    [9, 39, 4],
                    ...this.addRulesRange(9, 40, 50),
                    // Marcos 10
                    [10, 3, 5],
                    [10, 5, 5],
                    ...this.addRulesRange(10, 6, 9),
                    [10, 11, 5],
                    [10, 12, 1],
                    [10, 14, 8],
                    [10, 15, 1],
                    [10, 18, 5],
                    [10, 19, 1],
                    [10, 21, 11],
                    [10, 23, 10],
                    [10, 24, 15],
                    [10, 25, 1],
                    [10, 27, 7],
                    [10, 29, 5],
                    ...this.addRulesRange(10, 30, 31),
                    [10, 33, 2],
                    [10, 34, 1],
                    [10, 36, 5],
                    [10, 38, 5],
                    [10, 39, 9],
                    [10, 40, 1],
                    [10, 42, 7],
                    ...this.addRulesRange(10, 43, 45),
                    [10, 51, 5, 9],
                    [10, 52, 5, 10],
                    // Marcos 11
                    [11, 2, 3],
                    [11, 3, 1],
                    [11, 14, 7],
                    [11, 17, 5],
                    [11, 22, 5],
                    ...this.addRulesRange(11, 23, 26),
                    [11, 29, 5],
                    [11, 30, 1],
                    [11, 33, 12],
                    // Marcos 12
                    [12, 1, 7],
                    ...this.addRulesRange(12, 2, 11),
                    [12, 15, 8],
                    [12, 16, 7, 13],
                    [12, 17, 5, 21],
                    [12, 24, 5],
                    ...this.addRulesRange(12, 25, 27),
                    [12, 29, 4],
                    ...this.addRulesRange(12, 30, 31),
                    [12, 34, 9, 15],
                    [12, 35, 8],
                    [12, 36, 1],
                    [12, 37, 1, 12],
                    [12, 38, 4],
                    ...this.addRulesRange(12, 39, 40),
                    [12, 43, 7],
                    [12, 44, 1],
                    // Marcos 13
                    [13, 2, 5],
                    [13, 5, 7],
                    ...this.addRulesRange(13, 6, 37),
                    // Marcos 14
                    [14, 6, 4],
                    ...this.addRulesRange(14, 7, 9),
                    [14, 13, 9],
                    ...this.addRulesRange(14, 14, 15),
                    [14, 18, 9],
                    [14, 20, 5],
                    [14, 21, 1],
                    [14, 22, 15],
                    [14, 24, 3],
                    [14, 25, 1],
                    [14, 27, 4],
                    [14, 28, 1],
                    [14, 30, 4],
                    [14, 32, 13],
                    [14, 34, 3],
                    [14, 36, 3],
                    [14, 37, 9],
                    [14, 38, 1],
                    [14, 41, 7],
                    [14, 42, 1],
                    [14, 48, 5],
                    [14, 49, 1],
                    [14, 62, 4],
                    [14, 72, 17, 27],
                    // Marcos 15
                    [15, 2, 15],
                    [15, 34, 11, 14],
                    // Marcos 16
                    [16, 15, 3],
                    ...this.addRulesRange(16, 16, 18)
                ])
                // ----------------------------------------------------------------------------
                // Lucas (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "Lc", [
                    // Lucas 2
                    [2, 49, 5],
                    // Lucas 4
                    [4, 4, 6],
                    [4, 8, 5],
                    [4, 12, 5],
                    ...this.addRulesRange(4, 18, 19),
                    [4, 21, 5],
                    [4, 23, 5],
                    [4, 24, 3],
                    ...this.addRulesRange(4, 25, 27),
                    [4, 35, 6, 9],
                    [4, 43, 5],
                    // Lucas 5
                    [5, 4, 9],
                    [5, 10, 23],
                    [5, 13, 8, 10],
                    [5, 14, 10],
                    [5, 20, 8],
                    [5, 22, 10],
                    [5, 23, 1],
                    [5, 24, 1, 17],
                    [5, 24, 21],
                    [5, 27, 16],
                    [5, 31, 5],
                    [5, 32, 1],
                    [5, 34, 5],
                    [5, 35, 1],
                    [5, 36, 6],
                    ...this.addRulesRange(5, 37, 39),
                    // Lucas 6
                    [6, 3, 5],
                    [6, 4, 1],
                    [6, 5, 3],
                    [6, 8, 17, 23],
                    [6, 9, 5],
                    [6, 10, 10, 12],
                    [6, 20, 11],
                    ...this.addRulesRange(6, 21, 28),
                    [6, 39, 5],
                    ...this.addRulesRange(6, 40, 49),
                    // Lucas 7
                    [7, 9, 15],
                    [7, 13, 13],
                    [7, 14, 14],
                    [7, 22, 5],
                    [7, 23, 1],
                    [7, 24, 16],
                    ...this.addRulesRange(7, 25, 28),
                    [7, 31, 5],
                    ...this.addRulesRange(7, 32, 35),
                    [7, 40, 5, 10],
                    ...this.addRulesRange(7, 41, 42),
                    [7, 43, 19],
                    [7, 44, 9],
                    ...this.addRulesRange(7, 45, 47),
                    [7, 48, 5],
                    [7, 50, 5],
                    // Lucas 8
                    ...this.addRulesRange(8, 5, 7),
                    [8, 8, 1, 14],
                    [8, 8, 20],
                    [8, 10, 4],
                    ...this.addRulesRange(8, 11, 18),
                    [8, 21, 5],
                    [8, 22, 15, 21],
                    [8, 25, 3, 7],
                    [8, 30, 5, 9],
                    [8, 39, 1, 12],
                    [8, 45, 4, 8],
                    [8, 46, 4],
                    [8, 48, 5],
                    [8, 52, 10],
                    [8, 54, 12],
                    // Lucas 9
                    [9, 3, 3],
                    ...this.addRulesRange(9, 4, 5),
                    [9, 13, 5, 8],
                    [9, 14, 13],
                    [9, 18, 16],
                    [9, 20, 3, 9],
                    [9, 22, 2],
                    [9, 23, 5],
                    ...this.addRulesRange(9, 24, 27),
                    [9, 41, 5],
                    [9, 44, 1],
                    [9, 48, 3],
                    [9, 50, 5],
                    [9, 55, 6],
                    [9, 56, 1, 16],
                    [9, 58, 4],
                    [9, 59, 5, 5],
                    [9, 60, 5],
                    [9, 62, 5],
                    // Lucas 10
                    [10, 2, 3],
                    ...this.addRulesRange(10, 3, 16),
                    [10, 18, 3],
                    ...this.addRulesRange(10, 19, 20),
                    [10, 21, 11],
                    [10, 22, 1],
                    [10, 23, 9],
                    [10, 24, 1],
                    [10, 26, 5],
                    [10, 28, 3],
                    [10, 30, 5],
                    ...this.addRulesRange(10, 31, 36),
                    [10, 37, 15],
                    [10, 41, 5],
                    [10, 42, 1],
                    // Lucas 11
                    [11, 2, 5],
                    ...this.addRulesRange(11, 3, 4),
                    [11, 5, 3],
                    ...this.addRulesRange(11, 6, 13),
                    [11, 17, 8],
                    ...this.addRulesRange(11, 18, 26),
                    [11, 28, 4],
                    [11, 29, 8],
                    ...this.addRulesRange(11, 30, 36),
                    [11, 39, 6],
                    ...this.addRulesRange(11, 40, 44),
                    [11, 46, 5],
                    ...this.addRulesRange(11, 47, 52),
                    // Lucas 12
                    [12, 1, 21],
                    ...this.addRulesRange(12, 2, 12),
                    [12, 14, 5],
                    [12, 15, 3],
                    [12, 16, 6],
                    ...this.addRulesRange(12, 17, 21),
                    [12, 22, 6],
                    ...this.addRulesRange(12, 23, 40),
                    [12, 42, 4],
                    ...this.addRulesRange(12, 43, 53),
                    [12, 54, 6],
                    ...this.addRulesRange(12, 55, 59),
                    // Lucas 13
                    [13, 2, 5],
                    ...this.addRulesRange(13, 3, 5),
                    [13, 6, 5],
                    ...this.addRulesRange(13, 7, 9),
                    [13, 12, 9],
                    [13, 15, 7],
                    [13, 16, 1],
                    [13, 18, 3],
                    [13, 19, 1],
                    [13, 20, 5],
                    [13, 21, 1],
                    ...this.addRulesRange(13, 24, 30),
                    [13, 32, 3],
                    ...this.addRulesRange(13, 33, 35),
                    // Lucas 14
                    [14, 3, 13],
                    [14, 5, 3],
                    ...this.addRulesRange(14, 8, 11),
                    [14, 12, 9],
                    ...this.addRulesRange(14, 13, 14),
                    [14, 16, 5],
                    ...this.addRulesRange(14, 17, 24),
                    ...this.addRulesRange(14, 26, 35),
                    // Lucas 15
                    ...this.addRulesRange(15, 4, 10),
                    [15, 11, 3],
                    ...this.addRulesRange(15, 12, 32),
                    // Lucas 16
                    [16, 1, 7],
                    ...this.addRulesRange(16, 2, 13),
                    [16, 15, 3],
                    ...this.addRulesRange(16, 16, 31),
                    // Lucas 17
                    [17, 1, 5],
                    ...this.addRulesRange(17, 2, 4),
                    [17, 6, 5],
                    ...this.addRulesRange(17, 7, 10),
                    [17, 14, 5, 9],
                    [17, 17, 5],
                    [17, 18, 1],
                    [17, 19, 3],
                    [17, 20, 17],
                    [17, 21, 1],
                    [17, 22, 5],
                    ...this.addRulesRange(17, 23, 36),
                    [17, 37, 10],
                    // Lucas 18
                    [18, 2, 2],
                    ...this.addRulesRange(18, 3, 5),
                    [18, 6, 5],
                    ...this.addRulesRange(18, 7, 8),
                    ...this.addRulesRange(18, 10, 14),
                    [18, 16, 7],
                    [18, 17, 1],
                    [18, 19, 4],
                    [18, 20, 1],
                    [18, 22, 7],
                    [18, 24, 10],
                    [18, 25, 1],
                    [18, 27, 4],
                    [18, 29, 5],
                    [18, 30, 1],
                    [18, 31, 7],
                    ...this.addRulesRange(18, 32, 33),
                    [18, 41, 2, 6],
                    [18, 42, 5],
                    // Lucas 19
                    [19, 5, 13],
                    [19, 9, 4],
                    [19, 10, 1],
                    [19, 12, 3],
                    ...this.addRulesRange(19, 13, 27),
                    [19, 30, 2],
                    [19, 31, 1],
                    [19, 40, 5],
                    [19, 42, 2],
                    ...this.addRulesRange(19, 43, 44),
                    [19, 46, 2],
                    // Lucas 20
                    [20, 3, 5],
                    [20, 4, 1],
                    [20, 8, 5],
                    [20, 9, 9],
                    ...this.addRulesRange(20, 10, 15),
                    [20, 16, 1, 11],
                    [20, 17, 7],
                    [20, 18, 1],
                    [20, 23, 8],
                    [20, 24, 1, 11],
                    [20, 25, 3],
                    [20, 34, 5],
                    ...this.addRulesRange(20, 35, 38),
                    [20, 41, 5],
                    ...this.addRulesRange(20, 42, 44),
                    ...this.addRulesRange(20, 46, 47),
                    // Lucas 21
                    [21, 3, 3],
                    [21, 4, 1],
                    [21, 6, 1],
                    [21, 8, 4],
                    [21, 9, 1],
                    [21, 10, 4],
                    ...this.addRulesRange(21, 11, 28),
                    [21, 29, 5],
                    ...this.addRulesRange(21, 30, 36),
                    // Lucas 22
                    [22, 8, 9],
                    [22, 10, 5],
                    ...this.addRulesRange(22, 11, 12),
                    [22, 15, 3],
                    [22, 16, 1],
                    [22, 17, 10],
                    [22, 18, 1],
                    [22, 19, 13],
                    [22, 20, 9],
                    ...this.addRulesRange(22, 21, 22),
                    [22, 25, 5],
                    ...this.addRulesRange(22, 26, 30),
                    [22, 31, 5],
                    [22, 32, 1],
                    [22, 34, 4],
                    [22, 35, 3],
                    [22, 36, 3],
                    [22, 37, 1],
                    [22, 38, 13],
                    [22, 40, 7],
                    [22, 42, 2],
                    [22, 46, 3],
                    [22, 48, 5],
                    [22, 51, 5, 6],
                    [22, 52, 18],
                    [22, 53, 1],
                    [22, 61, 19],
                    [22, 67, 8],
                    ...this.addRulesRange(22, 68, 69),
                    [22, 70, 15],
                    // Lucas 23
                    [23, 3, 15],
                    [23, 28, 7],
                    ...this.addRulesRange(23, 29, 31),
                    [23, 34, 4, 11],
                    [23, 43, 4],
                    [23, 46, 8, 15],
                    // Lucas 24
                    [24, 17, 5],
                    [24, 19, 5, 5],
                    [24, 25, 5],
                    [24, 26, 1],
                    [24, 36, 16],
                    [24, 38, 5],
                    [24, 39, 1],
                    [24, 41, 15],
                    [24, 44, 3],
                    [24, 46, 3],
                    ...this.addRulesRange(24, 47, 49)
                ])
                // ----------------------------------------------------------------------------
                // João (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "Jo", [
                    // João 1
                    [1, 38, 11, 12],
                    [1, 39, 4, 6],
                    [1, 43, 15],
                    [1, 47, 11],
                    [1, 48, 12],
                    [1, 50, 5],
                    [1, 51, 3],
                    // João 2
                    [2, 4, 3],
                    [2, 7, 3, 7],
                    [2, 8, 3, 8],
                    [2, 16, 7],
                    [2, 19, 5],
                    // João 3
                    [3, 3, 5],
                    [3, 5, 3],
                    ...this.addRulesRange(3, 6, 8),
                    [3, 10, 5],
                    ...this.addRulesRange(3, 11, 21),
                    // João 4
                    [4, 7, 10],
                    [4, 10, 5],
                    [4, 13, 5],
                    [4, 14, 1],
                    [4, 16, 3],
                    [4, 17, 11],
                    [4, 18, 1],
                    [4, 21, 3],
                    ...this.addRulesRange(4, 22, 24),
                    [4, 26, 3],
                    [4, 32, 5],
                    [4, 34, 3],
                    ...this.addRulesRange(4, 35, 38),
                    [4, 48, 5],
                    [4, 50, 3, 7],
                    // João 5
                    [5, 6, 16],
                    [5, 8, 3],
                    [5, 14, 8],
                    [5, 17, 5],
                    [5, 19, 6],
                    ...this.addRulesRange(5, 20, 47),
                    // João 6
                    [6, 5, 19],
                    [6, 10, 4, 7],
                    [6, 12, 9],
                    [6, 20, 5],
                    [6, 26, 5],
                    [6, 27, 1],
                    [6, 29, 5],
                    [6, 32, 4],
                    [6, 33, 1],
                    [6, 35, 5],
                    ...this.addRulesRange(6, 36, 40),
                    [6, 43, 6],
                    ...this.addRulesRange(6, 44, 51),
                    [6, 53, 5],
                    ...this.addRulesRange(6, 54, 58),
                    [6, 61, 14],
                    ...this.addRulesRange(6, 62, 63),
                    [6, 64, 1, 8],
                    [6, 65, 3],
                    [6, 67, 6],
                    [6, 70, 3],
                    // João 7
                    [7, 6, 4],
                    ...this.addRulesRange(7, 7, 8),
                    [7, 16, 5],
                    ...this.addRulesRange(7, 17, 19),
                    [7, 21, 5],
                    ...this.addRulesRange(7, 22, 24),
                    [7, 28, 9],
                    [7, 29, 1],
                    [7, 33, 4],
                    [7, 34, 1],
                    [7, 37, 17],
                    [7, 38, 1],
                    // João 8
                    [8, 7, 8],
                    [8, 10, 14],
                    [8, 11, 9],
                    [8, 12, 7],
                    [8, 14, 5],
                    ...this.addRulesRange(8, 15, 18),
                    [8, 19, 9],
                    [8, 21, 6],
                    [8, 23, 3],
                    [8, 24, 1],
                    [8, 25, 9],
                    [8, 26, 1],
                    [8, 28, 4],
                    [8, 29, 1],
                    [8, 31, 9],
                    [8, 32, 1],
                    [8, 34, 3],
                    ...this.addRulesRange(8, 35, 38),
                    [8, 39, 10],
                    [8, 40, 1],
                    [8, 41, 1, 7],
                    [8, 42, 4],
                    ...this.addRulesRange(8, 43, 47),
                    [8, 49, 3],
                    ...this.addRulesRange(8, 50, 51),
                    [8, 54, 3],
                    ...this.addRulesRange(8, 55, 56),
                    [8, 58, 3],
                    // João 9
                    [9, 3, 3],
                    ...this.addRulesRange(9, 4, 5),
                    [9, 7, 3, 8],
                    [9, 35, 10],
                    [9, 37, 5],
                    [9, 39, 4],
                    [9, 41, 3],
                    // João 10
                    ...this.addRulesRange(10, 1, 5),
                    [10, 7, 6],
                    ...this.addRulesRange(10, 8, 18),
                    [10, 25, 3],
                    ...this.addRulesRange(10, 26, 30),
                    [10, 32, 3],
                    [10, 34, 3],
                    ...this.addRulesRange(10, 35, 38),
                    // João 11
                    [11, 4, 6],
                    [11, 7, 8],
                    [11, 9, 3],
                    [11, 10, 1],
                    [11, 11, 6],
                    [11, 14, 6],
                    [11, 15, 1],
                    [11, 23, 3],
                    [11, 25, 3],
                    [11, 26, 1],
                    [11, 34, 3, 5],
                    [11, 39, 3, 5],
                    [11, 40, 3],
                    [11, 41, 18],
                    [11, 42, 1],
                    [11, 43, 9],
                    [11, 44, 25],
                    // João 12
                    [12, 7, 4],
                    [12, 8, 1],
                    [12, 23, 6],
                    ...this.addRulesRange(12, 24, 27),
                    [12, 28, 1, 5],
                    [12, 30, 5],
                    ...this.addRulesRange(12, 31, 32),
                    [12, 35, 4],
                    [12, 36, 1, 12],
                    [12, 44, 6],
                    ...this.addRulesRange(12, 45, 50),
                    // João 13
                    [13, 7, 5],
                    [13, 8, 10],
                    [13, 10, 3],
                    [13, 12, 21],
                    ...this.addRulesRange(13, 13, 20),
                    [13, 21, 11],
                    [13, 26, 3, 11],
                    [13, 27, 11],
                    [13, 31, 7],
                    ...this.addRulesRange(13, 32, 35),
                    [13, 36, 11],
                    [13, 38, 3],
                    // João 14
                    ...this.addRulesRange(14, 1, 4),
                    [14, 6, 3],
                    [14, 7, 1],
                    [14, 9, 3],
                    ...this.addRulesRange(14, 10, 21),
                    [14, 23, 5],
                    ...this.addRulesRange(14, 24, 31),
                    // João 15
                    ...this.addRulesRange(15, 1, 27),
                    // João 16
                    ...this.addRulesRange(16, 1, 16),
                    [16, 19, 10],
                    ...this.addRulesRange(16, 20, 28),
                    [16, 31, 3],
                    ...this.addRulesRange(16, 32, 33),
                    // João 17
                    [17, 1, 12],
                    ...this.addRulesRange(17, 2, 26),
                    // João 18
                    [18, 4, 16],
                    [18, 5, 7, 8],
                    [18, 7, 5, 7],
                    [18, 8, 3],
                    [18, 11, 6],
                    [18, 20, 4],
                    [18, 21, 1],
                    [18, 23, 3],
                    [18, 34, 3],
                    [18, 36, 3],
                    [18, 37, 10],
                    // João 19
                    [19, 11, 3],
                    [19, 26, 21],
                    [19, 27, 5, 8],
                    [19, 28, 19],
                    [19, 30, 8, 9],
                    // João 20
                    [20, 15, 3, 8],
                    [20, 16, 3, 3],
                    [20, 17, 3],
                    [20, 19, 33],
                    [20, 21, 6],
                    [20, 22, 10],
                    [20, 23, 1],
                    [20, 26, 28],
                    [20, 27, 5],
                    [20, 29, 3],
                    // João 21
                    [21, 5, 4, 9],
                    [21, 6, 5, 13],
                    [21, 10, 3],
                    [21, 12, 3, 4],
                    [21, 15, 11, 19],
                    [21, 15, 31],
                    [21, 16, 6, 10],
                    [21, 16, 20],
                    [21, 17, 4, 8],
                    [21, 17, 32],
                    [21, 18, 1],
                    [21, 19, 18],
                    [21, 22, 3],
                    [21, 23, 24]
                ])
                // ----------------------------------------------------------------------------
                // Atos dos Apóstolos (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "At", [
                    // Atos dos Apóstolos 1
                    [1, 4, 14, 19],
                    [1, 4, 22],
                    [1, 5, 1],
                    [1, 7, 3],
                    [1, 8, 1],
                    // Atos dos Apóstolos 9
                    [9, 4, 11],
                    [9, 5, 11],
                    [9, 6, 17],
                    [9, 10, 16, 16],
                    [9, 11, 5],
                    [9, 12, 1],
                    [9, 15, 5],
                    [9, 16, 1],
                    // Atos dos Apóstolos 10
                    [10, 13, 6],
                    [10, 15, 8],
                    // Atos dos Apóstolos 11
                    [11, 16, 9],
                    // Atos dos Apóstolos 18
                    [18, 9, 11],
                    [18, 10, 1],
                    // Atos dos Apóstolos 20
                    [20, 35, 22],
                    // Atos dos Apóstolos 22
                    [22, 7, 12],
                    [22, 8, 9],
                    [22, 10, 11],
                    [22, 18, 7],
                    [22, 21, 3],
                    // Atos dos Apóstolos 23
                    [23, 11, 9],
                    // Atos dos Apóstolos 26
                    [26, 14, 18],
                    [26, 15, 10],
                    ...this.addRulesRange(26, 16, 18)
                ])
                // ----------------------------------------------------------------------------
                // 1 Coríntios (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "1Co", [
                    // 1 Coríntios 11
                    [11, 24, 9],
                    [11, 25, 10]
                ])
                // ----------------------------------------------------------------------------
                // 2 Coríntios (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "2Co", [
                    // 2 Coríntios 12
                    [12, 9, 3, 15]
                ])
                // ----------------------------------------------------------------------------
                // Apocalipse (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.redLetterRules, "Ap", [
                    // Apocalipse 1
                    [1, 8, 1, 12],
                    [1, 8, 16],
                    [1, 11, 3],
                    [1, 17, 21],
                    ...this.addRulesRange(1, 18, 20),
                    // Apocalipse 2
                    ...this.addRulesRange(2, 1, 29),
                    // Apocalipse 3
                    ...this.addRulesRange(3, 1, 22),
                    // Apocalipse 4
                    [4, 1, 26],
                    // Apocalipse 16
                    [16, 15, 1],
                    // Apocalipse 22
                    [22, 7, 1],
                    ...this.addRulesRange(22, 12, 13),
                    [22, 16, 1],
                    [22, 20, 7, 9]
                ])

                break
                
            default:
                break
        }
    }

    private initializeTitleRules(): void {
        if (this.titleRules.length > 0) {
            return
        }
        
        switch (this.version) {
            case "ARC":
                // ----------------------------------------------------------------------------
                // Gênesis (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.titleRules, "Gn", [
                    // Gênesis 1
                    [1, 1, "A criação do céu e da terra e de tudo o que nele se contém"],
                    [1, 24, "A criação dos seres viventes"],
                    // Gênesis 2
                    [2, 4, "A formação do jardim do Éden"],
                    [2, 18, "Como Deus criou a mulher"],
                    // Gênesis 3
                    [3, 1, "A tentação de Eva e a queda do homem"],
                    // Gênesis 4
                    [4, 1, "O nascimento de Caim, Abel e Sete"],
                    [4, 8, "O primeiro homicídio"],
                    // Gênesis 5
                    [5, 1, "A genealogia de Sete"],
                    // Gênesis 6
                    [6, 1, "A corrupção geral do gênero humano"],
                    [6, 13, "Deus anuncia o dilúvio a Noé"],
                    // Gênesis 7
                    [7, 1, "Noé e sua família entram na arca"],
                    [7, 17, "O dilúvio"],
                    // Gênesis 8
                    [8, 1, "As águas do dilúvio diminuem"],
                    [8, 7, "Noé solta um corvo e depois uma pomba"],
                    [8, 15, "Noé e sua família saem da arca"],
                    // Gênesis 9
                    [9, 1, "O pacto que Deus fez com Noé"],
                    [9, 20, "Noé planta uma vinha"],
                    // Gênesis 10
                    [10, 1, "Os descendentes de Noé"],
                    // Gênesis 11
                    [11, 1, "Toda a terra com uma mesma língua"],
                    [11, 7, "A confusão das línguas"],
                    // Gênesis 12
                    [12, 1, "Deus chama Abrão e lhe faz promessas"],
                    [12, 10, "Abrão desce ao Egito"],
                    // Gênesis 13
                    [13, 1, "Abrão volta do Egito"],
                    [13, 7, "Abrão e Ló separam-se"],
                    // Gênesis 14
                    [14, 1, "Guerra de quatro reis contra cinco"],
                    [14, 12, "Ló é levado cativo"],
                    [14, 18, "Melquisedeque abençoa a Abrão"],
                    // Gênesis 15
                    [15, 1, "Deus anima a Abrão e promete-lhe um filho"],
                    [15, 17, "Deus faz um pacto com Abrão"],
                    // Gênesis 16
                    [16, 1, "Agar é dada por mulher de Abrão"],
                    // Gênesis 17
                    [17, 1, "Deus muda o nome de Abrão"],
                    [17, 15, "Deus muda o nome de Sarai"],
                    [17, 23, "A instituição da circuncisão"],
                    // Gênesis 18
                    [18, 1, "Aparecem três anjos a Abraão"],
                    [18, 17, "Deus anuncia a destruição de Sodoma e Gomorra"],
                    [18, 23, "Abraão intercede junto a Deus pelos homens"],
                    // Gênesis 19
                    [19, 1, "Ló recebe os dois anjos em sua casa"],
                    [19, 24, "A destruição de Sodoma e Gomorra"],
                    // Gênesis 20
                    [20, 1, "Abraão nega que Sara é sua mulher"],
                    // Gênesis 21
                    [21, 1, "O nascimento de Isaque"],
                    [21, 14, "O despedimento de Agar e Ismael"],
                    [21, 22, "Abimeleque faz um pacto com Abraão"],
                    // Gênesis 22
                    [22, 1, "Deus manda Abraão matar seu filho Isaque"],
                    // Gênesis 23
                    [23, 1, "A morte de Sara"],
                    // Gênesis 24
                    [24, 1, "Abraão manda seu servo buscar uma mulher para Isaque"],
                    [24, 15, "O encontro de Rebeca"],
                    [24, 58, "Rebeca consente em casar com Isaque"],
                    // Gênesis 25
                    [25, 1, "Abraão casa com Quetura e tem filhos dela"],
                    [25, 8, "Abraão morre"],
                    [25, 12, "Os descendentes de Ismael"],
                    [25, 19, "Os descendentes de Isaque"],
                    [25, 24, "O nascimento de Esaú e Jacó"],
                    // Gênesis 26
                    [26, 1, "Isaque vai a Gerar por causa da fome"],
                    [26, 26, "Abimeleque faz um pacto com Isaque"],
                    // Gênesis 27
                    [27, 1, "Isaque manda Esaú fazer-lhe um guisado"],
                    [27, 6, "Rebeca e Jacó enganam Isaque"],
                    [27, 30, "Esaú traz ao seu pai o guisado e descobre que Jacó já tomou a bênção"],
                    // Gênesis 28
                    [28, 1, "Isaque manda Jacó a Padã-Arã"],
                    [28, 10, "A visão da escada de Jacó"],
                    [28, 18, "A coluna de Betel"],
                    // Gênesis 29
                    [29, 1, "Jacó chega ao poço de Harã"],
                    [29, 9, "Jacó encontra Raquel"],
                    [29, 21, "Labão engana Jacó"],
                    [29, 28, "Jacó casa com Raquel"],
                    [29, 32, "O nascimento a Jacó de doze filhos e uma filha"],
                    // Gênesis 30
                    [30, 27, "Labão faz um novo pacto com Jacó"],
                    [30, 37, "A maneira como Jacó se pagou de Labão"],
                    // Gênesis 31
                    [31, 1, "Deus manda Jacó tornar à terra dos seus pais"],
                    [31, 22, "Labão prossegue atrás de Jacó"],
                    [31, 43, "O pacto entre Labão e Jacó em Galeede"],
                    // Gênesis 32
                    [32, 3, "Jacó envia mensageiros a Esaú"],
                    [32, 22, "Jacó passa o vau de Jaboque e luta com um anjo"],
                    // Gênesis 33
                    [33, 1, "O encontro de Esaú e Jacó"],
                    [33, 18, "Jacó chega a Siquém e levanta um altar"],
                    // Gênesis 34
                    [34, 1, "Diná e os siquemitas"],
                    [34, 25, "A traição de Simeão e Levi"],
                    // Gênesis 35
                    [35, 1, "Deus manda Jacó a Betel a levantar um altar"],
                    [35, 8, "A morte de Débora"],
                    [35, 16, "O nascimento de Benjamim e a morte de Raquel"],
                    // Gênesis 36
                    [36, 1, "Os descendentes de Esaú"],
                    // Gênesis 37
                    [37, 1, "José é vendido por seus irmãos"],
                    // Gênesis 38
                    [38, 1, "Judá e Tamar"],
                    // Gênesis 39
                    [39, 1, "José na casa de Potifar"],
                    // Gênesis 40
                    [40, 1, "José, na prisão, interpreta dois sonhos"],
                    // Gênesis 41
                    [41, 1, "José interpreta os sonhos de Faraó"],
                    [41, 38, "Faraó põe José como governador do Egito"],
                    // Gênesis 42
                    [42, 1, "Os irmãos de José descem ao Egito"],
                    [42, 25, "Os irmãos de José voltam do Egito"],
                    // Gênesis 43
                    [43, 1, "Os irmãos de José descem outra vez ao Egito"],
                    [43, 15, "Os irmãos de José jantam com ele"],
                    // Gênesis 44
                    [44, 1, "A astúcia de José para deter seus irmãos"],
                    [44, 16, "A humilde súplica de Judá"],
                    // Gênesis 45
                    [45, 1, "José dá-se a conhecer a seus irmãos"],
                    [45, 15, "Faraó ouve falar dos irmãos de José"],
                    // Gênesis 46
                    [46, 1, "Jacó e toda a sua família descem ao Egito"],
                    [46, 28, "O encontro de José com seu pai"],
                    // Gênesis 47
                    [47, 1, "José anuncia a Faraó a chegada de seu pai"],
                    [47, 13, "Como José comprou toda a terra do Egito para Faraó"],
                    // Gênesis 48
                    [48, 1, "Jacó adoece"],
                    [48, 11, "Jacó abençoa José e os filhos deste"],
                    // Gênesis 49
                    [49, 1, "Jacó abençoa seus filhos e morre"],
                    // Gênesis 50
                    [50, 1, "A lamentação por Jacó e o seu enterro"],
                    [50, 14, "José anima a seus irmãos"],
                    [50, 22, "A morte de José"]
                ])
                // ----------------------------------------------------------------------------
                // Êxodo (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.titleRules, "Êx", [
                    // Êxodo 1
                    [1, 1, "Os descendentes de Jacó no Egito"],
                    [1, 15, "As parteiras poupam a vida dos recém-nascidos"],
                    // Êxodo 2
                    [2, 1, "O nascimento de Moisés"],
                    [2, 11, "Moisés mata um egípcio e foge para Midiã"],
                    [2, 23, "A morte do rei do Egito"],
                    // Êxodo 3
                    [3, 1, "Deus fala com Moisés do meio da sarça ardente"],
                    // Êxodo 4
                    [4, 1, "Deus concede poderes a Moisés"],
                    [4, 18, "Moisés volta para o Egito"],
                    // Êxodo 5
                    [5, 1, "Moisés e Arão falam a Faraó"],
                    [5, 6, "Faraó aflige os israelitas"],
                    [5, 20, "Os israelitas queixam-se de Moisés e Arão"],
                    // Êxodo 6
                    [6, 2, "Deus promete livrar os israelitas"],
                    [6, 14, "Genealogias de Rúben, Simeão e Levi"],
                    [6, 28, "Deus anima Moisés a falar outra vez a Faraó"],
                    // Êxodo 7
                    [7, 14, "O coração de Faraó mostra-se endurecido"],
                    [7, 19, "A primeira praga: as águas tornam-se em sangue"],
                    // Êxodo 8
                    [8, 1, "A praga das rãs"],
                    [8, 16, "A praga dos piolhos"],
                    [8, 20, "A praga das moscas"],
                    // Êxodo 9
                    [9, 1, "A praga da peste nos animais"],
                    [9, 8, "A praga das úlceras"],
                    [9, 13, "As ameaças de Deus"],
                    [9, 22, "A praga da saraiva"],
                    // Êxodo 10
                    [10, 1, "Deus ameaça Faraó com a praga dos gafanhotos"],
                    [10, 12, "A praga dos gafanhotos"],
                    [10, 21, "A praga das trevas"],
                    // Êxodo 11
                    [11, 1, "Deus anuncia a Moisés a morte de todos os primogênitos"],
                    // Êxodo 12
                    [12, 1, "A instituição da primeira Páscoa"],
                    [12, 29, "A morte dos primogênitos"],
                    [12, 37, "A saída dos israelitas do Egito"],
                    // Êxodo 13
                    [13, 1, "Os primogênitos são santificados a Deus"],
                    [13, 17, "Deus guia o povo pelo caminho"],
                    // Êxodo 14
                    [14, 1, "Deus anuncia a ruína dos egípcios"],
                    [14, 15, "A passagem pelo meio do mar"],
                    [14, 27, "Os egípcios perecem no mar"],
                    // Êxodo 15
                    [15, 1, "O cântico de Moisés"],
                    [15, 20, "A dança de Miriã e das mulheres"],
                    [15, 23, "As águas amargas tornam-se doces"],
                    // Êxodo 16
                    [16, 1, "Deus manda o maná"],
                    [16, 11, "Deus manda carne"],
                    // Êxodo 17
                    [17, 1, "A jornada pelo deserto de Sim e a falta de água"],
                    [17, 8, "Amaleque peleja contra os israelitas"],
                    // Êxodo 18
                    [18, 1, "O sogro de Moisés traz-lhe sua mulher e seus filhos"],
                    // Êxodo 19
                    [19, 1, "Deus fala com Moisés no monte Sinai"],
                    // Êxodo 20
                    [20, 1, "Os dez mandamentos"],
                    // Êxodo 21
                    [21, 1, "As leis acerca dos servos e dos homicidas"],
                    [21, 17, "As leis acerca dos que amaldiçoam os pais ou ferem qualquer pessoa"],
                    // Êxodo 22
                    [22, 1, "As leis acerca da propriedade"],
                    [22, 16, "As leis acerca da imoralidade e da idolatria"],
                    // Êxodo 23
                    [23, 1, "O testemunho falso e a injustiça"],
                    [23, 10, "O ano de descanso e o sábado"],
                    [23, 14, "As três festas"],
                    [23, 20, "Deus promete enviar um Anjo"],
                    // Êxodo 24
                    [24, 1, "Deus manda Moisés e os anciãos subir o monte"],
                    // Êxodo 25
                    [25, 1, "Deus manda o povo trazer ofertas para o tabernáculo"],
                    [25, 10, "A arca de madeira de cetim"],
                    [25, 17, "O propiciatório de ouro puro"],
                    [25, 23, "A mesa de madeira de cetim"],
                    // Êxodo 26
                    [26, 1, "As cortinas do tabernáculo"],
                    [26, 15, "As tábuas do tabernáculo"],
                    [26, 31, "O véu do tabernáculo"],
                    // Êxodo 27
                    [27, 1, "O altar dos holocaustos"],
                    [27, 9, "O pátio do tabernáculo"],
                    [27, 20, "O azeite puro"],
                    // Êxodo 28
                    [28, 1, "Deus escolhe Arão e seus filhos para sacerdotes"],
                    [28, 4, "As vestes sacerdotais"],
                    [28, 30, "Urim e Tumim"],
                    [28, 36, "A lâmina de ouro puro"],
                    // Êxodo 29
                    [29, 1, "O sacrifício e as cerimônias da consagração"],
                    // Êxodo 30
                    [30, 1, "O altar do incenso"],
                    [30, 11, "O resgate da alma"],
                    [30, 17, "A pia de cobre"],
                    [30, 22, "O azeite da santa unção"],
                    [30, 34, "O incenso santo"],
                    // Êxodo 31
                    [31, 1, "Os artífices da obra do tabernáculo"],
                    [31, 12, "O sábado santo e as duas tábuas do Testemunho"],
                    // Êxodo 32
                    [32, 1, "O bezerro de ouro"],
                    [32, 19, "Moisés quebra as tábuas do Testemunho"],
                    [32, 25, "Moisés manda matar os idólatras"],
                    [32, 30, "Moisés intercede pelo povo"],
                    // Êxodo 33
                    [33, 1, "Deus não irá no meio do povo mas enviará um anjo"],
                    [33, 12, "Moisés roga a Deus a sua presença"],
                    [33, 18, "Moisés roga a Deus que lhe mostre a sua glória"],
                    // Êxodo 34
                    [34, 1, "As novas tábuas dos dez mandamentos"],
                    [34, 10, "Deus faz um pacto"],
                    [34, 29, "O rosto de Moisés resplandece"],
                    // Êxodo 35
                    [35, 1, "O sábado e as ofertas para o tabernáculo"],
                    [35, 20, "A prontidão do povo em trazer ofertas"],
                    [35, 30, "Deus chama Bezalel e Aoliabe"],
                    // Êxodo 36
                    [36, 2, "Moisés entrega aos obreiros as ofertas do povo"],
                    [36, 19, "A coberta de peles e as tábuas"],
                    [36, 35, "Os véus e as colunas"],
                    // Êxodo 37
                    [37, 1, "A arca"],
                    [37, 6, "O propiciatório"],
                    [37, 10, "A mesa"],
                    [37, 17, "O castiçal"],
                    // Êxodo 38
                    [38, 1, "O altar do holocausto"],
                    [38, 9, "O pátio"],
                    [38, 21, "A enumeração das coisas do tabernáculo"],
                    // Êxodo 39
                    [39, 1, "As vestes dos sacerdotes"],
                    [39, 33, "O tabernáculo é entregue a Moisés"],
                    // Êxodo 40
                    [40, 1, "Deus manda Moisés levantar o tabernáculo"],
                    [40, 17, "O tabernáculo é levantado"],
                    [40, 34, "A nuvem cobre o tabernáculo"]
                ])
                // ----------------------------------------------------------------------------
                // Levítico (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.titleRules, "Lv", [
                    // Levítico 1
                    [1, 1, "Os holocaustos"],
                    // Levítico 2
                    [2, 1, "As ofertas de manjares"],
                    // Levítico 3
                    [3, 1, "Os sacrifícios de paz ou das graças"],
                    // Levítico 4
                    [4, 1, "O sacrifício pelos erros dos sacerdotes"],
                    [4, 13, "O sacrifício pelos erros do povo"],
                    [4, 22, "O sacrifício pelos erros de um príncipe"],
                    [4, 27, "O sacrifício pelos erros de qualquer pessoa"],
                    // Levítico 5
                    [5, 1, "O sacrifício pelos pecados ocultos"],
                    [5, 14, "O sacrifício pelo sacrilégio"],
                    [5, 17, "O sacrifício pelos pecados de ignorância"],
                    // Levítico 6
                    [6, 1, "O sacrifício pelos pecados voluntários"],
                    [6, 8, "A lei do holocausto"],
                    [6, 14, "A lei da oferta de manjares"],
                    [6, 19, "A oferta na consagração dos sacerdotes"],
                    [6, 24, "A lei da expiação do pecado"],
                    // Levítico 7
                    [7, 1, "A lei da expiação da culpa"],
                    [7, 11, "A lei do sacrifício da paz"],
                    [7, 22, "Deus proíbe comer gordura e sangue"],
                    [7, 28, "A porção dos sacerdotes"],
                    // Levítico 8
                    [8, 1, "A consagração de Arão e seus filhos"],
                    // Levítico 9
                    [9, 1, "Arão oferece sacrifícios por si e pelo povo"],
                    // Levítico 10
                    [10, 1, "Nadabe e Abiú morrem diante do Senhor"],
                    [10, 12, "A lei acerca das coisas santas"],
                    // Levítico 11
                    [11, 1, "Os animais que se devem comer e os que se não devem comer"],
                    // Levítico 12
                    [12, 1, "A purificação da mulher depois do parto"],
                    // Levítico 13
                    [13, 1, "As leis acerca da praga da lepra"],
                    // Levítico 14
                    [14, 1, "A lei acerca do leproso depois de sarado"],
                    [14, 33, "A lei acerca da lepra numa casa"],
                    // Levítico 15
                    [15, 1, "Imundícias do homem e da mulher"],
                    // Levítico 16
                    [16, 1, "Como Arão deve entrar no santuário"],
                    [16, 11, "O sacrifício pelo próprio sumo sacerdote"],
                    [16, 15, "O sacrifício pelo povo"],
                    [16, 29, "A festa anual das expiações"],
                    // Levítico 17
                    [17, 1, "O sangue de todos os animais deve trazer-se à porta do tabernáculo"],
                    [17, 10, "A proibição de comer sangue"],
                    // Levítico 18
                    [18, 1, "Casamentos ilícitos"],
                    [18, 19, "Uniões abomináveis"],
                    // Levítico 19
                    [19, 1, "A repetição de diversas leis"],
                    // Levítico 20
                    [20, 1, "As penas de diversos crimes"],
                    // Levítico 21
                    [21, 1, "Leis acerca dos sacerdotes"],
                    // Levítico 22
                    [22, 1, "A lei acerca de comer coisas santas"],
                    [22, 17, "Os animais sacrificados devem ser sem defeito"],
                    // Levítico 23
                    [23, 1, "As festas solenes do Senhor"],
                    [23, 3, "O Sábado"],
                    [23, 4, "A Páscoa"],
                    [23, 9, "As Primícias"],
                    [23, 15, "O Pentecostes"],
                    [23, 26, "O Dia da Expiação"],
                    [23, 33, "A Festa dos Tabernáculos"],
                    // Levítico 24
                    [24, 1, "A lei acerca das lâmpadas"],
                    [24, 5, "O pão para a mesa do Senhor"],
                    [24, 10, "A pena do pecado da blasfêmia"],
                    // Levítico 25
                    [25, 1, "O Ano de Descanso"],
                    [25, 8, "O Ano do Jubileu"],
                    // Levítico 26
                    [26, 1, "Mandamentos, promessas e ameaças"],
                    // Levítico 27
                    [27, 1, "Votos particulares e a avaliação deles"],
                    [27, 16, "Voto de um campo e o resgate dele"],
                    [27, 28, "Não há resgate para as coisas consagradas"]
                ])
                // ----------------------------------------------------------------------------
                // Números (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.titleRules, "Nm", [
                    // Números 1
                    [1, 1, "Deus manda Moisés numerar as tribos"],
                    [1, 47, "Os levitas não são contados"],
                    // Números 2
                    [2, 1, "A ordem das tribos no acampamento"],
                    // Números 3
                    [3, 1, "Os filhos de Arão e os levitas são escolhidos para o serviço do tabernáculo"],
                    // Números 4
                    [4, 1, "Os deveres dos levitas"],
                    // Números 5
                    [5, 1, "O leproso e o imundo são lançados fora do arraial"],
                    [5, 11, "A prova da mulher suspeita de adultério"],
                    // Números 6
                    [6, 1, "A lei do nazireado"],
                    [6, 22, "O modo de abençoar os filhos de Israel"],
                    // Números 7
                    [7, 1, "As ofertas dos príncipes na dedicação do tabernáculo e do altar"],
                    // Números 8
                    [8, 1, "Como devem ser acesas as lâmpadas"],
                    [8, 5, "A consagração dos levitas"],
                    // Números 9
                    [9, 1, "A celebração da Páscoa no deserto do Sinai"],
                    [9, 6, "Segunda celebração para os ausentes e os imundos"],
                    [9, 15, "A nuvem guiando a marcha dos israelitas"],
                    // Números 10
                    [10, 1, "As duas trombetas de prata"],
                    [10, 11, "Os israelitas partem do Sinai"],
                    [10, 29, "Moisés roga a Hobabe que vá com eles"],
                    // Números 11
                    [11, 1, "As murmurações dos israelitas"],
                    [11, 11, "Moisés acha pesado o seu cargo"],
                    [11, 16, "Deus designa setenta anciãos para ajudarem Moisés"],
                    // Números 12
                    [12, 1, "A sedição de Miriã e Arão"],
                    // Números 13
                    [13, 1, "Doze homens são enviados para espiar a terra de Canaã"],
                    // Números 14
                    [14, 1, "Os israelitas querem voltar para o Egito"],
                    [14, 26, "Aos murmuradores não é permitido entrar na terra de Canaã"],
                    // Números 15
                    [15, 1, "A repetição de diversas leis"],
                    [15, 37, "A lei acerca das bordas das vestes"],
                    // Números 16
                    [16, 1, "A rebelião de Corá, Datã e Abirão"],
                    // Números 17
                    [17, 1, "A vara de Arão floresce"],
                    // Números 18
                    [18, 1, "Os deveres e direitos dos sacerdotes e dos levitas"],
                    // Números 19
                    [19, 1, "A água da separação"],
                    // Números 20
                    [20, 1, "A morte de Miriã"],
                    [20, 7, "Moisés fere a rocha, e as águas saem"],
                    [20, 14, "Moisés solicita passagem pelo Edom"],
                    [20, 22, "A morte de Arão"],
                    // Números 21
                    [21, 1, "Os israelitas destroem os cananeus"],
                    [21, 4, "As serpentes ardentes e a serpente de metal"],
                    [21, 10, "Jornadas dos israelitas"],
                    [21, 21, "Os israelitas ferem os reis de Moabe e de Basã"],
                    // Números 22
                    [22, 1, "Balaque e Balaão"],
                    // Números 23
                    [23, 1, "Balaque edifica sete altares"],
                    [23, 18, "As profecias de Balaão"],
                    // Números 25
                    [25, 1, "Os israelitas pecam com as filhas dos moabitas"],
                    // Números 26
                    [26, 1, "Deus manda tomar a soma de todos os israelitas"],
                    [26, 52, "A lei acerca da divisão da terra"],
                    // Números 27
                    [27, 1, "A lei acerca das heranças"],
                    [27, 12, "Deus anuncia a morte de Moisés"],
                    [27, 18, "Josué é designado sucessor de Moisés"],
                    // Números 28
                    [28, 1, "O holocausto perpétuo"],
                    [28, 9, "As ofertas nos sábados, nas luas novas, na Páscoa e no dia das primícias"],
                    // Números 29
                    [29, 1, "As ofertas na Festa das Trombetas"],
                    [29, 12, "As ofertas nas festas solenes"],
                    // Números 30
                    [30, 1, "A lei acerca dos votos das mulheres"],
                    // Números 31
                    [31, 1, "A vitória sobre os midianitas"],
                    [31, 13, "A purificação dos soldados"],
                    [31, 25, "A divisão da presa"],
                    [31, 48, "A oferta voluntária dos capitães"],
                    // Números 32
                    [32, 1, "As tribos de Rúben e Gade pedem a terra de Gileade"],
                    // Números 33
                    [33, 1, "As jornadas desde o Egito até Moabe"],
                    [33, 50, "Deus manda lançar fora os moradores de Canaã"],
                    // Número 34
                    [34, 1, "Os confins da terra"],
                    [34, 16, "Os homens que devem dividir a terra"],
                    // Números 35
                    [35, 1, "As cidades dos levitas"],
                    [35, 9, "Seis cidades de refúgio"],
                    // Números 36
                    [36, 1, "Casamento de herdeiras"]
                ])
                // ----------------------------------------------------------------------------
                // Deuteronômio (ARC)
                // ----------------------------------------------------------------------------
                this.addRules(this.titleRules, "Dt", [
                    // Deuteronômio 1
                    [1, 1, "O discurso de Moisés na planície do Jordão"],
                    // Deuteronômio 2
                    [2, 1, "Moisés fala acerca dos edomitas, moabitas e amonitas"],
                    // Deuteronômio 3
                    [3, 1, "Moisés fala acerca de Ogue, rei de Basã"],
                    [3, 23, "A oração de Moisés para entrar em Canaã"],
                    // Deuteronômio 4
                    [4, 1, "Moisés exorta o povo à obediência"],
                    [4, 41, "Moisés designa três das cidades de refúgio"],
                    // Deuteronômio 5
                    [5, 1, "A repetição dos dez mandamentos"],
                    [5, 22, "O povo pede a Moisés para receber a lei do Senhor"],
                    // Deuteronômio 6
                    [6, 1, "O fim da lei é a obediência"],
                    // Deuteronômio 7
                    [7, 1, "Ordena-se a destruição dos cananeus e seus ídolos"],
                    // Deuteronômio 8
                    [8, 1, "Exortação a ter em memória os benefícios do Senhor"],
                    // Deuteronômio 9
                    [9, 1, "Moisés lembra aos israelitas as suas murmurações e suas infidelidades"],
                    // Deuteronômio 10
                    [10, 1, "Moisés fala das segundas tábuas da lei"],
                    [10, 8, "Da vocação da tribo de Levi"],
                    [10, 12, "Exortação à obediência"],
                    // Deuteronômio 11
                    [11, 13, "Os benefícios da obediência"],
                    [11, 26, "A bênção e a maldição"],
                    // Deuteronômio 12
                    [12, 1, "O único lugar de culto é o escolhido pelo Senhor"],
                    // Deuteronômio 13
                    [13, 1, "O castigo dos falsos profetas e dos idólatras"],
                    // Deuteronômio 14
                    [14, 1, "Animais limpos e imundos"],
                    [14, 22, "Os dízimos para o serviço do Senhor"],
                    // Deuteronômio 15
                    [15, 1, "O ano da remissão"],
                    // Deuteronômio 16
                    [16, 1, "As três festas: Páscoa, Pentecostes e Tabernáculos"],
                    [16, 18, "Deveres dos juízes"],
                    // Deuteronômio 17
                    [17, 1, "O castigo da idolatria"],
                    [17, 8, "Consulta dos sacerdotes"],
                    [17, 14, "A eleição e os deveres de um rei"],
                    // Deuteronômio 18
                    [18, 1, "A herança e os direitos dos sacerdotes e dos levitas"],
                    [18, 9, "As abominações das nações são proibidas"],
                    [18, 15, "A promessa de um grande profeta"],
                    // Deuteronômio 19
                    [19, 1, "A quem pertencem os privilégios das cidades de refúgio"],
                    [19, 14, "Acerca dos limites e das testemunhas"],
                    // Deuteronômio 20
                    [20, 1, "As leis da guerra"],
                    // Deuteronômio 21
                    [21, 1, "Expiação por uma morte cujo autor é desconhecido"],
                    [21, 10, "Acerca da mulher prisioneira"],
                    [21, 15, "O direito do primogênito"],
                    [21, 18, "Acerca dos filhos desobedientes"],
                    [21, 22, "Os cadáveres serão tirados do patíbulo"],
                    // Deuteronômio 22
                    [22, 1, "Caridade para com o próximo"],
                    [22, 5, "Acerca das vestes do homem e das da mulher"],
                    [22, 13, "As penas para diversos pecados cometidos para com mulheres"],
                    // Deuteronômio 23
                    [23, 1, "Pessoas que são excluídas das assembleias santas"],
                    [23, 15, "Acerca de fugitivos, prostitutas, usura e votos"],
                    // Deuteronômio 24
                    [24, 1, "Acerca do divórcio, dos penhores, dos roubadores e da lepra"],
                    [24, 10, "Acerca de empréstimos"],
                    [24, 14, "Caridade para com os pobres, os estrangeiros e os órfãos"],
                    // Deuteronômio 25
                    [25, 1, "A pena de açoites"],
                    [25, 5, "A obrigação de um homem casar com a viúva do seu irmão"],
                    [25, 13, "Pesos e medidas justos"],
                    [25, 17, "Amaleque será destruído"],
                    // Deuteronômio 26
                    [26, 1, "As primícias da terra"],
                    [26, 12, "Oração daquele que deu os dízimos"],
                    // Deuteronômio 27
                    [27, 1, "A ordem de levantar um padrão e gravar nele a lei"],
                    [27, 11, "As maldições que serão lançadas do monte Ebal"],
                    // Deuteronômio 28
                    [28, 1, "As bênçãos que serão lançadas do monte Gerizim"],
                    [28, 15, "Castigos por desobediência"],
                    // Deuteronômio 29
                    [29, 1, "Deus faz um novo concerto com o povo"],
                    // Deuteronômio 30
                    [30, 1, "A misericórdia de Deus para com os que se arrependem"],
                    [30, 11, "A lei do Senhor é bem patente"],
                    // Deuteronômio 31
                    [31, 1, "Moisés nomeia Josué seu sucessor"],
                    [31, 9, "A lei deve ser lida ao povo de sete em sete anos"],
                    [31, 14, "Deus dá a Josué o encargo do povo"],
                    // Deuteronômio 32
                    [32, 1, "Último cântico de Moisés"],
                    // Deuteronômio 33
                    [33, 1, "A majestade de Deus"],
                    [33, 6, "As bênçãos das tribos"],
                    // Deuteronômio 34
                    [34, 1, "Moisés sobe o monte Nebo, vê a terra prometida e morre"]
                ])

                break

            default:
                break
        }
    }

    private redLetter(abbreviation: TFormatterRules["abbreviation"], chapter: TFormatterRules["chapter"], verse: TFormatterRules["verse"]): void {
        this.initializeRedLetterRules()
        this.applyRules(this.redLetterRules, abbreviation, chapter, verse, "red-letter")
    }

    private title(abbreviation: TFormatterRules["abbreviation"], chapter: TFormatterRules["chapter"], verse: TFormatterRules["verse"]): void {
        this.initializeTitleRules()
        this.applyRules(this.titleRules, abbreviation, chapter, verse, "title")
    }

    public formatText(abbreviation: IBibleResponse["abbreviation"], chapter: IBibleResponse["chapter"], verse: IBibleResponse["verse"]): void {
        this.redLetter(abbreviation, chapter, verse)
        this.title(abbreviation, chapter, verse)
    }
}

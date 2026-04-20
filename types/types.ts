export interface IBibleVerse {
    chapter: number
    verses: Array<string>
}

export interface IBibleResponse {
    book: "Gênesis" | "Êxodo" | "Levítico" | "Números" | "Deuteronômio" | "Josué" | "Juízes" | "Rute" | "1 Samuel" | "2 Samuel" | "1 Reis" | "2 Reis" | "1 Crônicas" | "2 Crônicas" | "Esdras" | "Neemias" | "Ester" | "Jó" | "Salmos" | "Provérbios" | "Eclesiastes" | "Cantares" | "Isaías" | "Jeremias" | "Lamentações" | "Ezequiel" | "Daniel" | "Oseias" | "Joel" | "Amós" | "Obadias" | "Jonas" | "Miqueias" | "Naum" | "Habacuque" | "Sofonias" | "Ageu" | "Zacarias" | "Malaquias" | "Mateus" | "Marcos" | "Lucas" | "João" | "Atos dos Apóstolos" | "Romanos" | "1 Coríntios" | "2 Coríntios" | "Gálatas" | "Efésios" | "Filipenses" | "Colossenses" | "1 Tessalonicenses" | "2 Tessalonicenses" | "1 Timóteo" | "2 Timóteo" | "Tito" | "Filemom" | "Hebreus" | "Tiago" | "1 Pedro" | "2 Pedro" | "1 João" | "2 João" | "3 João" | "Judas" | "Apocalipse"
    abbreviation: "Gn" | "Êx" | "Lv" | "Nm" | "Dt" | "Js" | "Jz" | "Rt" | "1Sm" | "2Sm" | "1Rs" | "2Rs" | "1Cr" | "2Cr" | "Ed" | "Ne" | "Et" | "Jó" | "Sl" | "Pv" | "Ec" | "Ct" | "Is" | "Jr" | "Lm" | "Ez" | "Dn" | "Os" | "Jl" | "Am" | "Ob" | "Jn" | "Mq" | "Na" | "Hc" | "Sf" | "Ag" | "Zc" | "Ml" | "Mt" | "Mc" | "Lc" | "Jo" | "At" | "Rm" | "1Co" | "2Co" | "Gl" | "Ef" | "Fp" | "Cl" | "1Ts" | "2Ts" | "1Tm" | "2Tm" | "Tt" | "Fm" | "Hb" | "Tg" | "1Pe" | "2Pe" | "1Jo" | "2Jo" | "3Jo" | "Jd" | "Ap"
    chapter?: number
    verse?: number
    verses?: Array<string>
    text?: string
    range?: string
    totalVerses?: number
}

export interface IBibleBook {
    book: IBibleResponse["book"]
    abbreviation: IBibleResponse["abbreviation"]
    chapters: Array<IBibleVerse>
}

export interface IBibleData {
    books: Array<IBibleBook>
}

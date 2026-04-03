import {
    FaBookBible,
    FaGripfire,
    FaListUl,
    FaXmark,
    FaArrowDown,
    FaArrowUp,
    FaMagnifyingGlass,
    FaArrowLeft,
    FaArrowRight,
    FaPlay,
    FaStop,
    FaEllipsis,
    FaAlignCenter,
    FaAlignJustify,
    FaAlignLeft,
    FaAlignRight,
    FaA
} from "react-icons/fa6"
import type { IconType } from "react-icons"

export type TIconName = 
    "bible"         |
    "christianHarp" |
    "more"          |
    "close"         |
    "arrowDown"     |
    "arrowUp"       |
    "arrowLeft"     |
    "arrowRight"    |
    "search"        |
    "play"          |
    "stop"          |
    "dots"          |
    "alignCenter"   |
    "alignJustify"  |
    "alignLeft"     |
    "alignRight"    |
    "font"
     
class IconManager {
    private static icons: Partial<Record<string, IconType>> = {}

    public static get(name: TIconName): IconType {
        return this.icons[name]
    }

    private static set(name: TIconName, icon: IconType): void {
        this.icons[name] = icon
    }

    public static get all(): Record<string, IconType> {
        return { ...this.icons }
    }

    public static get list(): Array<string> {
        return Object.keys(this.icons)
    }

    public static get count(): number {
        return Object.keys(this.icons).length
    }

    static {
        this.set("bible", FaBookBible)
        this.set("christianHarp", FaGripfire)
        this.set("more", FaListUl)
        this.set("close", FaXmark)
        this.set("arrowDown", FaArrowDown)
        this.set("arrowUp", FaArrowUp)
        this.set("arrowLeft", FaArrowLeft)
        this.set("arrowRight", FaArrowRight)
        this.set("search", FaMagnifyingGlass)
        this.set("play", FaPlay)
        this.set("stop", FaStop)
        this.set("dots", FaEllipsis)
        this.set("alignCenter", FaAlignCenter)
        this.set("alignJustify", FaAlignJustify)
        this.set("alignLeft", FaAlignLeft)
        this.set("alignRight", FaAlignRight)
        this.set("font", FaA)
    }
}

export default IconManager

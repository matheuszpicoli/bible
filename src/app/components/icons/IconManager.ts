import {
    FaBookBible,
    FaGripfire,
    FaListUl,
    FaXmark,
    FaChevronDown,
    FaChevronUp,
    FaMagnifyingGlass,
    FaChevronLeft,
    FaChevronRight,
    FaVolumeHigh,
    FaVolumeXmark,
    FaEllipsis
} from "react-icons/fa6"
import type { IconType } from "react-icons"

export type IconName = 
    "bible"         |
    "christianHarp" |
    "more"          |
    "close"         |
    "arrowDown"     |
    "arrowUp"       |
    "arrowLeft"     |
    "arrowRight"    |
    "search"        |
    "volume"        |
    "muted"         |
    "dots"
     
class IconManager {
    private static icons: Partial<Record<string, IconType>> = {}

    public static get(name: IconName): IconType {
        return this.icons[name]
    }

    private static set(name: IconName, icon: IconType): void {
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
        this.set("arrowDown", FaChevronDown)
        this.set("arrowUp", FaChevronUp)
        this.set("arrowLeft", FaChevronLeft)
        this.set("arrowRight", FaChevronRight)
        this.set("search", FaMagnifyingGlass)
        this.set("volume", FaVolumeHigh)
        this.set("muted", FaVolumeXmark)
        this.set("dots", FaEllipsis)
    }
}

export default IconManager

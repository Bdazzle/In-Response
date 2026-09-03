import React, { createContext, useState } from "react";
import { CombinedCards } from "./index";


export interface SearchContextProps {
    setIconCache: Map<string, boolean>
    cachedCardData: CombinedCards
    setCachedCardData: React.Dispatch<React.SetStateAction<CombinedCards | {}>>
    lastDisplayed: string[]
    setLastDisplayed: React.Dispatch<React.SetStateAction<string[]>>
};

export const SearchContext = createContext({} as SearchContextProps)

/**
 * Context for card caching. ({cardname:[{card version},{card version}]})
 * cards will be cached after 1 search, for lifecycle of app, 
 * so I won't have to worry about new card updates. because there we always be at least one fresh fetch per card.
 * This strategy should hold if/when I make my own backend for it.
 * @param param0 
 * @returns 
 */
const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cachedCardData, setCachedCardData] = useState<CombinedCards>({})
    const [lastDisplayed, setLastDisplayed] = useState<string[]>([])
    const setIconCache = new Map()
    
    return <SearchContext.Provider
        value={{
            setIconCache,
            cachedCardData,
            setCachedCardData,
            lastDisplayed,
            setLastDisplayed
        }}
    >
        {children}
    </SearchContext.Provider>
}

export default SearchProvider
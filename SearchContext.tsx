import React, { createContext, useState } from "react";
import { CombinedCards } from ".";


export interface SearchContextProps {
    cachedCardData: CombinedCards
    setCachedCardData: React.Dispatch<React.SetStateAction<CombinedCards | {}>>
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

    return <SearchContext.Provider
        value={{
            cachedCardData,
            setCachedCardData
        }}
    >
        {children}
    </SearchContext.Provider>
}

export default SearchProvider
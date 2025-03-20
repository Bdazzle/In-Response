import SearchScreen from "../screens/MainMenu/Search"
import SearchProvider from "../SearchContext"

const SearchCosumer : React.FC= ({}) =>{

    return (
        <SearchProvider>
            <SearchScreen />
        </SearchProvider>
    )
}

export default SearchCosumer
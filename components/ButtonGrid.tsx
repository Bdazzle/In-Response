import { Pressable, Text, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { SvgUri } from "react-native-svg"


type EntryStructure = string[] | [string, string][] //[name, image/svg uri]

type GridProps = {
    rows: number,
    cols: number,
    entries: EntryStructure,
    buttStyle: StyleProp<ViewStyle>
    onPress: (string: string) => void
    innerStyle : StyleProp<ViewStyle>
    testID?: string
    renderItem?: React.ReactElement
}
/*
Render Text as default
*/
const ButtonGrid: React.FC<GridProps> = ({ rows, cols, entries, buttStyle, onPress, innerStyle, testID, renderItem }: GridProps) => {

    return (
        <View testID={testID}
            style={styles.grid_container}>
            {[...Array(rows)].map((_, rowIndex) => (
                <View key={rowIndex}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginBottom: 2,
                    }}>
                    {entries.slice(rowIndex * cols, (rowIndex + 1) * cols).map((item: string | [string, string], colIndex: number) => (
                        typeof item === 'string' ? <Pressable
                            key={`${rowIndex}-${colIndex}`}
                            style={({ pressed }) => [{
                                ...buttStyle,
                                opacity: pressed ? .5 : 1,
                            }]}
                            onPress={() => onPress(item)}
                        >
                            <Text style={innerStyle}>{item}</Text>
                        </Pressable>
                            :
                            <Pressable key={`${rowIndex}-${colIndex}`}
                                accessibilityRole="button"
                                onPress={() => onPress(item[0])}//set name
                                style={({ pressed }) => [
                                    {
                                        ...buttStyle,
                                        opacity: pressed ? .5 : 1,
                                    },
                                ]}
                            >
                                <SvgUri
                                    uri={item[1]}
                                    style={innerStyle}
                                    accessibilityLabel={item[0]}
                                />
                            </Pressable>
                    ))}
                </View>
            ))}</View>
    )
}

const styles = StyleSheet.create({
    grid_container: {
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
})

export default ButtonGrid
import { Pressable, Text, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { SvgUri } from "react-native-svg"
import getOptimalGridConfig from "../functions/gernerate_grid"


type EntryStructure = string[] | [string, string][] //[name, image/svg uri]

type GridProps = {
    rows: number,
    cols: number,
    entries: EntryStructure,
    buttStyle: StyleProp<ViewStyle>
    onPress: (string: string) => void
    innerStyle: StyleProp<ViewStyle>
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


interface TestProps {
    versions: string[]
    press: (e: string) => void
}

export const DropdownWithDynamicGrid: React.FC<TestProps> = ({ versions, press }) => {
    const itemCount = versions.length;
    const config = getOptimalGridConfig(itemCount);

    // Calculate dimensions
    const CONTAINER_WIDTH = 400;
    const BASE_ITEM_WIDTH = (CONTAINER_WIDTH / config.columns) - 12;
    const ITEM_HEIGHT = 50;

    return (
        <View
            style={{
                position: 'absolute',
                top: 60,
                left: 0,
                width: CONTAINER_WIDTH,
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 8,
                transform: [{ scale: config.scale }],
                transformOrigin: 'top left', // Fixed from your earlier issue!
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    maxHeight: config.needsScroll
                        ? 7 * ITEM_HEIGHT * config.scale
                        : undefined,
                }}
            >
                {versions.map((version, index) => (
                    <Pressable
                        key={index}
                        style={{
                            width: BASE_ITEM_WIDTH,
                            height: ITEM_HEIGHT,
                            margin: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f0f0f0',
                            borderRadius: 4,
                        }}
                        onPress={() => press(version)}
                    >
                        <Text style={{ fontSize: 14 * config.scale }}>
                            {version}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

{/* <Animated.View
        style={{
            transform: [
                { scale: testScale }
            ],
            transformOrigin: 'top left',
            // borderColor:'green', borderWidth: 2,
            flexDirection: 'row',
            flexWrap: 'wrap',
            maxHeight: testScroll
                ? 7 * btnSize.height * testScale
                : undefined,
            // width: 4 * btnSize.width
        }}
    >
        {testEntries.map((version, index) => (
            <Pressable
                key={index}
                style={[styles(deviceType).svg_btn, {
                    width: btnSize.width,
                    height: btnSize.height,
                    // margin: 4,
                    // transform: [
                    //     { scale: testScale }
                    // ],
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderRadius: 4,
                    borderColor: 'red', borderWidth: 2,
                }]}
                onPress={() => handleSetSelect(version)}
            >
                <Text style={styles(deviceType).lang_text}>
                    {version}
                </Text>
            </Pressable>
        ))}
    </Animated.View> */}

{/* <Animated.View testID="set_buttons_container"
        style={[styles(deviceType).set_button_container, {
            // transform: [
            //     { scale: setsScale },
            // ],
            transform: [
                { scale: testScale },
            ],
            transformOrigin: 'top left',
            marginLeft: ogSetsPos.x,
            zIndex: setZIndexVal,
        }]}
    >
        <View testID="list_container"
            style={[styles(deviceType).list_container,
            {
                opacity: setOpacityVal,
                transform: [{
                    translateY: setTranslateYVal
                }],
                // position: 'relative'

            }
            ]}
        >
            <View testID="sets_wrapper"
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    maxHeight: testScroll
                        ? 7 * btnSize.height * testScale
                        : undefined,
                    // borderWidth: 2, borderColor: 'green'
                }}>
                <ButtonGrid rows={Math.ceil(Object.keys(setOptions).length / cols)} cols={cols}
                    entries={filteredSets}
                    buttStyle={styles(deviceType).svg_btn}
                    innerStyle={styles(deviceType).set_icon}
                    onPress={handleSetSelect} /> 
                {
                    testCols && <ButtonGrid testID="setsGrid" rows={Math.ceil(testEntries.length / testCols)} cols={testCols} entries={testEntries}
                        buttStyle={{
                            ...styles(deviceType).svg_btn,
                            // ...buttonStyles
                        }}
                        innerStyle={styles(deviceType).lang_text as StyleProp<ViewStyle>} onPress={handleLangPress} />
                }
            </View>
        </View>
    </Animated.View> */}
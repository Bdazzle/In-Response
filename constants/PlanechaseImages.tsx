import React from "react"
import { ImageSourcePropType } from "react-native"
import Svg, { G, Path } from "react-native-svg"

type PlaneProps = {
    [key: string]: ImageSourcePropType
}

const phenomenon: PlaneProps = {
    "chaotic-aether": require('../assets/planechase/phenomenon/chaotic-aether.jpg'),
    "interplanar-tunnel": require('../assets/planechase/phenomenon/interplanar-tunnel.jpg'),
    "morphic-tide": require('../assets/planechase/phenomenon/morphic-tide.jpg'),
    "mutual-epiphany": require('../assets/planechase/phenomenon/mutual-epiphany.jpg'),
    "planewide-disaster": require('../assets/planechase/phenomenon/planewide-disaster.jpg'),
    "reality-shaping": require('../assets/planechase/phenomenon/reality-shaping.jpg'),
    "spatial-merging": require('../assets/planechase/phenomenon/spatial-merging.jpg'),
    "time-distortion": require('../assets/planechase/phenomenon/time-distortion.jpg'),
}

const planes: PlaneProps = {
    "academy-at-tolaria-west": require('../assets/planechase/planes/academy-at-tolaria-west.jpg'),
    "agyrem": require('../assets/planechase/planes/agyrem.jpg'),
    "akoum": require('../assets/planechase/planes/akoum.jpg'),
    "aretopolis": require('../assets/planechase/planes/aretopolis.jpg'),
    "astral-arena": require('../assets/planechase/planes/astral-arena.jpg'),
    "bant": require('../assets/planechase/planes/bant.jpg'),
    "bloodhill-bastion": require('../assets/planechase/planes/bloodhill-bastion.jpg'),
    "celestine-reef": require('../assets/planechase/planes/celestine-reef.jpg'),
    "cliffside-market": require('../assets/planechase/planes/cliffside-market.jpg'),
    "edge-of-malacol": require('../assets/planechase/planes/edge-of-malacol.jpg'),
    "eloren-wilds": require('../assets/planechase/planes/eloren-wilds.jpg'),
    "feeding-grounds": require('../assets/planechase/planes/feeding-grounds.jpg'),
    "fields-of-summer": require('../assets/planechase/planes/fields-of-summer.jpg'),
    "furnace-layer": require('../assets/planechase/planes/furnace-layer.jpg'),
    "gavony": require('../assets/planechase/planes/gavony.jpg'),
    "glen-elendra": require('../assets/planechase/planes/glen-elendra.jpg'),
    "glimmervoid-basin": require('../assets/planechase/planes/glimmervoid-basin.jpg'),
    "goldmeadow": require('../assets/planechase/planes/goldmeadow.jpg'),
    "grand-ossuary": require('../assets/planechase/planes/grand-ossuary.jpg'),
    "grixis": require('../assets/planechase/planes/grixis.jpg'),
    "grove-of-the-dreampods": require('../assets/planechase/planes/grove-of-the-dreampods.jpg'),
    "hedron-fields-of-agadeem": require('../assets/planechase/planes/hedron-fields-of-agadeem.jpg'),
    "horizon-boughs": require('../assets/planechase/planes/horizon-boughs.jpg'),
    "immersturm": require('../assets/planechase/planes/immersturm.jpg'),
    "isle-of-vesuva": require('../assets/planechase/planes/isle-of-vesuva.jpg'),
    "izzet-steam-maze": require('../assets/planechase/planes/izzet-steam-maze.jpg'),
    "jund": require('../assets/planechase/planes/jund.jpg'),
    "kessig": require('../assets/planechase/planes/kessig.jpg'),
    "kharasha-foothills": require('../assets/planechase/planes/kharasha-foothills.jpg'),
    "kilnspire-district": require('../assets/planechase/planes/kilnspire-district.jpg'),
    "krosa": require('../assets/planechase/planes/krosa.jpg'),
    "lair-of-the-ashen-idol": require('../assets/planechase/planes/lair-of-the-ashen-idol.jpg'),
    "lethe-lake": require('../assets/planechase/planes/lethe-lake.jpg'),
    "llanowar": require('../assets/planechase/planes/llanowar.jpg'),
    "minamo": require('../assets/planechase/planes/minamo.jpg'),
    "mirrored-depths": require('../assets/planechase/planes/mirrored-depths.jpg'),
    "mount-keralia": require('../assets/planechase/planes/mount-keralia.jpg'),
    "murasa": require('../assets/planechase/planes/murasa.jpg'),
    "naar-isle": require('../assets/planechase/planes/naar-isle.jpg'),
    "naya": require('../assets/planechase/planes/naya.jpg'),
    "nephalia": require('../assets/planechase/planes/nephalia.jpg'),
    "norn-s-dominion": require('../assets/planechase/planes/norn-s-dominion.jpg'),
    "onakke-catacomb": require('../assets/planechase/planes/onakke-catacomb.jpg'),
    "orochi-colony": require('../assets/planechase/planes/orochi-colony.jpg'),
    "orzhova": require('../assets/planechase/planes/orzhova.jpg'),
    "otaria": require('../assets/planechase/planes/otaria.jpg'),
    "panopticon": require('../assets/planechase/planes/panopticon.jpg'),
    "pools-of-becoming": require('../assets/planechase/planes/pools-of-becoming.jpg'),
    "prahv": require('../assets/planechase/planes/prahv.jpg'),
    "quicksilver-sea": require('../assets/planechase/planes/quicksilver-sea.jpg'),
    "raven-s-run": require('../assets/planechase/planes/raven-s-run.jpg'),
    "sanctum-of-serra": require('../assets/planechase/planes/sanctum-of-serra.jpg'),
    "sea-of-sand": require('../assets/planechase/planes/sea-of-sand.jpg'),
    "selesnya-loft-gardens": require('../assets/planechase/planes/selesnya-loft-gardens.jpg'),
    "shiv": require('../assets/planechase/planes/shiv.jpg'),
    "skybreen": require('../assets/planechase/planes/skybreen.jpg'),
    "sokenzan": require('../assets/planechase/planes/sokenzan.jpg'),
    "stairs-to-infinity": require('../assets/planechase/planes/stairs-to-infinity.jpg'),
    "stensia": require('../assets/planechase/planes/stensia.jpg'),
    "stronghold-furnace": require('../assets/planechase/planes/stronghold-furnace.jpg'),
    "takenuma": require('../assets/planechase/planes/takenuma.jpg'),
    "talon-gates": require('../assets/planechase/planes/talon-gates.jpg'),
    "tazeem": require('../assets/planechase/planes/tazeem.jpg'),
    "tember-city": require('../assets/planechase/planes/tember-city.jpg'),
    "the-aether-flues": require('../assets/planechase/planes/the-aether-flues.jpg'),
    "the-dark-barony": require('../assets/planechase/planes/the-dark-barony.jpg'),
    "the-eon-fog": require('../assets/planechase/planes/the-eon-fog.jpg'),
    "the-fourth-sphere": require('../assets/planechase/planes/the-fourth-sphere.jpg'),
    "the-great-forest": require('../assets/planechase/planes/the-great-forest.jpg'),
    "the-hippodrome": require('../assets/planechase/planes/the-hippodrome.jpg'),
    "the-maelstrom": require('../assets/planechase/planes/the-maelstrom.jpg'),
    "the-zephyr-maze": require('../assets/planechase/planes/the-zephyr-maze.jpg'),
    "trail-of-the-mage-rings": require('../assets/planechase/planes/trail-of-the-mage-rings.jpg'),
    "truga-jungle": require('../assets/planechase/planes/truga-jungle.jpg'),
    "turri-island": require('../assets/planechase/planes/turri-island.jpg'),
    "undercity-reaches": require('../assets/planechase/planes/undercity-reaches.jpg'),
    "velis-vel": require('../assets/planechase/planes/velis-vel.jpg'),
    "windriddle-palaces": require('../assets/planechase/planes/windriddle-palaces.jpg'),
}

const planechaseImages = {
    phenomenon: phenomenon,
    planes: planes,
}

interface PWSvg {
    fillColor: string,
    viewBox: string
}

export const PlaneswalkerSvg : React.FC<PWSvg> = ({ fillColor, viewBox}) => {
    return (
        <Svg viewBox={viewBox} >
            <G transform={"translate(-128.125,398.84217)"} id="layer1" >
                <G transform={"matrix(4.0816327,0,0,-4.0816327,128.125,815.48356)"} id="g3777">
                    <G test-id="g3779">
                        <G clipPath='url(#clipPath3783)' id="g3781" >
                            <G transform={"translate(145.458,184.2598)"} id="g3787" >
                                <Path d="m 0,0 c -1.245,32.734 -4.061,45.164 -5.927,45.164 -1.894,0 -2.49,-18.131 -4.979,-34.153 -2.49,-15.985 -6.874,-34.113 -6.874,-34.113 l -11.204,4.268 c 0,0 -3.141,23.131 -4.385,50.851 -1.216,27.721 -2.164,51.931 -5.63,51.931 -3.382,0.029 -4.031,-22.762 -5.276,-52.296 -1.246,-29.517 -5.601,-45.865 -5.601,-45.865 l -10.283,1.433 c 0,0 -4.98,25.602 -6.848,103.807 -0.433,18.509 -4.951,22.223 -4.951,22.223 0,0 -4.52,-3.714 -4.953,-22.223 -1.866,-78.205 -6.874,-103.807 -6.874,-103.807 l -10.257,-1.433 c 0,0 -4.382,16.348 -5.627,45.865 -1.245,29.534 -1.869,52.325 -5.276,52.296 -3.438,0 -4.386,-24.21 -5.659,-51.931 -1.216,-27.72 -4.33,-50.851 -4.33,-50.851 l -11.204,-4.268 c 0,0 -4.382,18.128 -6.872,34.113 -2.489,16.022 -3.113,34.153 -4.979,34.153 -1.868,0 -4.681,-12.43 -5.927,-45.164 -1.245,-32.693 -1.542,-39.084 -1.542,-39.084 0,0 36.777,-15.67 51.093,-56.223 14.343,-40.529 17.969,-75.72 18.077,-79.627 0.188,-6.064 4.33,-6.836 4.33,-6.836 0,0 3.6,0.772 4.33,6.836 0.459,3.879 3.734,39.098 18.075,79.627 14.318,40.553 51.095,56.223 51.095,56.223 0,0 -0.299,6.391 -1.542,39.084"
                                    fill={fillColor}
                                    fillRule="nonzero"
                                />
                            </G>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    )
}

export default planechaseImages
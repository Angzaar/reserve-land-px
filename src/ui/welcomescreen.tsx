import ReactEcs, {UiEntity} from '@dcl/sdk/react-ecs'
import {
    calculateImageDimensions,
    calculateSquareImageDimensions,
    getAspect,
    getImageAtlasMapping,
    sizeFont
} from './helpers';
import resources from '../helpers/resources';
import { uiSizes } from './uiConfig';
import { Color4 } from '@dcl/sdk/math';

export let showWelcome = true

export function displayWelcome(value: boolean) {
    showWelcome = value;
}

export function createWelcomeScreen() {
    return (
        <UiEntity
            key={resources.slug + "welcome-panel"}
            uiTransform={{
                display: showWelcome ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '45%',
                positionType: 'absolute',
                position: {right: '27%', bottom: '25%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas2.png',
                },
                uvs: getImageAtlasMapping(uiSizes.horizRectangle)
            }}
        >
        </UiEntity>
    );
}
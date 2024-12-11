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
import { IWBButton } from './button';
import { openExternalUrl } from '~system/RestrictedActions';

export let show = false

let deployPageButton:any = {label:"Deploy Site", func:()=>{
    openExternalUrl({url:resources.DEBUG ? resources.endpoints.deploySiteTest : resources.endpoints.deploySiteProd})
    displayPopup(false)
}}
let closeButton:any = {label:"Close", func:()=>{
    displayPopup(false)
}}

export function displayPopup(value: boolean, data?:any) {
    show = value;
}

export function createPopup() {
    return (
        <UiEntity
            key={resources.slug + "popup-panel"}
            uiTransform={{
                display: show ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '50%',
                positionType: 'absolute',
                position: {right: '40%', bottom: '25%'}
            }}
            // uiBackground={{color:Color4.Green()}}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: 'images/atlas1.png',
                },
                uvs: getImageAtlasMapping(uiSizes.vertRectangleOpaque)
            }}
        >

<UiEntity
    uiTransform={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '10%',
    }}
    uiText={{value:"Reservation Confirmed!", textAlign:"middle-center", fontSize:sizeFont(35,25)}}
    />
        <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '20%',
                    }}
                        >
                            <IWBButton button={deployPageButton} buttons={[deployPageButton]} />
                    </UiEntity>

                    <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '20%',
                    }}
                        >
                            <IWBButton button={closeButton} buttons={[closeButton]} />
                    </UiEntity>
        </UiEntity>
    );
}
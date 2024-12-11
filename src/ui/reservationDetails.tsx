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
import { IWBButton } from './button';
import { userReservation } from '../reservation';
import { sendServerMessage } from '../server';
import { openExternalUrl } from '~system/RestrictedActions';
import { displayPopup } from './popup';
import { formatUnixTimestamp } from '../helpers/functions';
import { calculateSquareSize, locationsMap } from '../locations';

export let showDetails = false
export let hasRes = true
export let cancelRes = false

let visitButton:any = {label:"Visit Land", func:()=>{}}
let cancelButton:any = {label:"Cancel", func:()=>{
    cancelRes = true
}}

let cancelPopup:any = {label:"Close", func:()=>{
    showDetails = false
}}

let deployPageButton:any = {label:"Deploy", func:()=>{
    openExternalUrl({url:resources.DEBUG ? resources.endpoints.deploySiteTest : resources.endpoints.deploySiteProd})
    displayPopup(false)
}}

let confirmCancel:any = {label:"Confirm Cancelation", func:()=>{
    sendServerMessage('cancel-reservation', {locationId:userReservation ? userReservation.locationId : 0})
    displayDetails(false)
    cancelRes = false
}}
let noCancel:any = {label:"Go Back", func:()=>{
    cancelRes = false
}}

export function displayDetails(value: boolean) {
    showDetails = value;
}

export function updateRes(value:boolean){
    hasRes = value
}

export function updateCancelRes(value:boolean){
    cancelRes = value
}

function getSize(){
    let location = locationsMap.get(userReservation.locationId)
    if(!location){
        return 0
    }
    let size = calculateSquareSize(location.parcels)
    return "" + size + "x" + size
}

export function createReservationDetails() {
    return (
        <UiEntity
            key={resources.slug + "reservation-panel"}
            uiTransform={{
                display: hasRes && showDetails ? 'flex' : 'none',
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

            <UiEntity
                        uiTransform={{
                            flexDirection: 'row',
                            display: !cancelRes ? "flex" : 'none',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: '100%',
                            padding:{top:"5%", left:'5%', right:'5%', bottom:'5%'}
                        }}
                        >

<UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '70%',
            height: '100%',
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
                        uiText={{value:"Your Reservation", textWrap:'nowrap', textAlign:"middle-left", fontSize:sizeFont(35,25)}}
                        />

                    <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '12%',
                            padding:{top:"5%"}
                        }}
                        uiText={{value:"Wallet: " + (userReservation && userReservation.ethAddress ? userReservation.ethAddress.substring(0,6) + "..." + userReservation.ethAddress.slice(-4) : ""), textWrap:'nowrap', textAlign:"middle-left", fontSize:sizeFont(25,20)}}
                        />

            <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '12%',
                            padding:{top:"5%"}
                        }}
                        uiText={{value:"Land Size: " + (userReservation || userReservation !== undefined ? getSize() : 0), textWrap:'nowrap', textAlign:"middle-left", fontSize:sizeFont(25,20)}}
                        />

            <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '12%',
                            padding:{top:"5%"}
                        }}
                        uiText={{value:"Start Date: " + (userReservation && userReservation.startDate ? formatUnixTimestamp(userReservation.startDate) : 0), textWrap:'nowrap', textAlign:"middle-left", fontSize:sizeFont(25,20)}}
                        />

            <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '12%',
                            padding:{top:"5%"}
                        }}
                        uiText={{value:"End Date: " + (userReservation && userReservation.endDate ? formatUnixTimestamp(userReservation.endDate) : 0), textWrap:'nowrap', textAlign:"middle-left", fontSize:sizeFont(25,20)}}
                        />
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '30%',
            height: '100%',
        }}
        >
            <UiEntity
                    uiTransform={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70%',
                        height: '20%',
                    }}
                        >
                            <IWBButton button={visitButton} buttons={[visitButton]} />
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
                            <IWBButton button={cancelButton} buttons={[cancelButton]} />
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
                            <IWBButton button={cancelPopup} buttons={[cancelPopup]} />
                    </UiEntity>
        </UiEntity>

                    

   
            

            </UiEntity>


            <UiEntity
                        uiTransform={{
                            flexDirection: 'column',
                            display: cancelRes ? "flex" : 'none',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: '100%',
                            padding:{top:"5%", left:'5%', right:'5%', bottom:'5%'}
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
                        uiText={{value:"Confirm Cancellation?", textWrap:'nowrap', textAlign:"middle-center", fontSize:sizeFont(20,15)}}
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
                            <IWBButton button={confirmCancel} buttons={[confirmCancel]} />
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
                            <IWBButton button={noCancel} buttons={[noCancel]} />
                    </UiEntity>

            </UiEntity>

        </UiEntity>
    );
}
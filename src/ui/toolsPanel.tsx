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
import { displayDetails, showDetails } from './reservationDetails';
import { movePlayerBrowserMap } from '../locations';
import { exitSystem, userReservation } from '../reservation';

let buttons:any[] = [
    {label:"View Reservation", pressed:false, func:()=>{
        displayDetails(!showDetails)
        },
        displayCondition:()=>{
            return userReservation || userReservation !== undefined ? true : false
        }
    },
    // {label:"2D Map", pressed:false, func:()=>{
    //     }
    // },
    {label:"Plaza Map", pressed:false, func:()=>{
        movePlayerBrowserMap()
    }
    },
    // {label:"Client Map", pressed:false, func:()=>{
    //     }
    // },
    {label:"Exit System", pressed:false, func:()=>{
        exitSystem()
    }
}
]

let show = true
export function displayReservation(value:boolean){
    show = value
}

export function createToolsPanel() {
    return (
        <UiEntity
            key={resources.slug + "buttons-panel"}
            uiTransform={{
                display: show?  'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                width: '15%',
                height: '80%',
                positionType: 'absolute',
                position: {right: '1%', top: '10%'}
            }}
        >

            {generateButtons(buttons)}

        </UiEntity>
    );
}

export function generateButtons(data:any){
    let arr:any[] = []
    data.forEach((button:any)=>{
        arr.push(<IWBButton button={button} buttons={data.buttons} />)
    })
    return arr
  }
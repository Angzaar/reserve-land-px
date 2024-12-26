import {
	spawn,
	getPortableExperiencesLoaded,
	kill,
} from '~system/PortableExperiences'

import { calculateSquareSize, enableLocationBox, locationsMap, removeLocationBox, setLocationColor, updateLocation, updateLocationColor } from "./locations"
import { localUserId } from "./server"
import { displayDetails, updateRes } from "./ui/reservationDetails"
import { displayPopup } from './ui/popup'
import { displayReservation } from './ui/toolsPanel'
import { movePlayerTo } from '~system/RestrictedActions'
import { PointerEvents } from '@dcl/sdk/ecs'
import { showReservationPopup } from './ui/reservationPopup'

export let userReservation:any
export let reservations:any[] = []
export let status:string = "complete"

export function updateCalendarStatus(value:string){
    status = value
}

export function updateLocationReservations(res:any[]){
    reservations = res
    updateCalendarStatus("complete")
}

export function setUserReservation(info:any){
    if(info){
        userReservation = info
    }
}

export function findUserReservation(locations:any[]){
    let locationsReserved = locations.filter((location:any)=> location.reservation)
    if(locationsReserved.length > 0){
        let locationReserved = locationsReserved.find((location:any)=> location.reservation.ethAddress === localUserId)
        if(locationReserved){
            userReservation = {...locationReserved.reservation}
            userReservation.locationId = locationReserved.id
            let reservationSize = calculateSquareSize(locationReserved.parcels)
            userReservation.size = reservationSize + "x" + reservationSize
            updateRes(true)
            return true
        }
    }
    return false
}

export function confirmReservation(info:any){
    // updateLocation(location, "add")
    if(info.reservation.ethAddress === localUserId){
        let location = locationsMap.get(info.locationId)
        if(!location){
            return
        }

        locationsMap.forEach((location:any)=>{
            try{
                PointerEvents.deleteFrom(location.entity)
            }
            catch(e){
                console.log('error deleting pointer event from entity')
            }
            
        })

        userReservation = info.reservation

        setLocationColor(location.entity, true)
        displayPopup(true)
    }
    // if(findUserReservation([location])){
    //     enableLocationBox(location.id, true)
    //     displayPopup(true)
    // }else{
    //     removeLocationBox(location.id)
    // }
    
}

export function cancelUserReservation(info:any){
    if(info.reservation.ethAddress === localUserId){
        userReservation = undefined
        showReservationPopup(false)
        displayDetails(false)
    }

    enableLocationBox(info.locationId)
}

export async function exitSystem(){
    displayReservation(false)
    try{
        movePlayerTo({newRelativePosition:{x: 14 * 16, y:3, z: (11 * 16) + 10}})

        const { loaded } = await getPortableExperiencesLoaded({})
        for (const portableExperience of loaded) {
            const { ens, name, pid } = portableExperience
            if (name === 'LANDRealEstate.dcl.eth') {
                await kill({ pid })
            }
        }
    }
    catch(e){
        console.log('error killing px', e)
    }
}
import mitt from "mitt"
import { Room } from "colyseus.js"
import { connect } from "./helpers/connection"
import { addGalleryReservation, moveGalleryElevator, removeGalleryReservationObject } from "./galleries"
import { initLocations, removeLocationBox, updateLocation, updateLocationColor } from "./locations"
import { cancelUserReservation, confirmReservation, setUserReservation, updateLocationReservations } from "./reservation"

export let serverRoom:string = "angzaar_plaza_reservations"
export let localUserId: string
export let localUser:any
export let data:any
export let colyseusRoom:Room

export let connected:boolean = false
export let sessionId:any
export const iwbEvents = mitt()

export function setLocalUserId(userData:any){
    localUserId = userData.userId
    localUser = userData    
    return userData
}

export async function joinServer(world?: any) {
    if (connected) {
        colyseusRoom.removeAllListeners()
        colyseusRoom.leave(true)
        connected = false
    }
    try{
        await colyseusConnect(localUser)
    }
    catch(e:any){
        console.log('error connecting to colyseus', e)
    }
}

export async function colyseusConnect(data:any, token?:string, world?:any, island?:any) {
    connect(serverRoom, data, token, world, island).then((room: Room) => {
        console.log("Connected!");
        colyseusRoom = room
        sessionId = room.sessionId
        connected = true

        room.onLeave((code: number) => {
            console.log('left room with code', code)
            connected = false
            if(code === 4010){
                console.log('user was banned')//
            }
        })
        createServerListeners(room)
        sendServerMessage('get-locations', {})
    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export function sendServerMessage(type: string, data: any) {
    try{
        connected && colyseusRoom.send(type, data)
    }
    catch(e){
        console.log('error sending message to server', e)
    }
}

function createServerListeners(room:Room){
    room.onMessage("error", (info:any)=>{
        console.log("" + ' received', info)
        //show notification error
    })

    room.onMessage("success", (info:any)=>{
        console.log("" + ' received', info)
        //show notification error//
    })

    room.onMessage("reservation-confirmed", async (info:any)=>{
        console.log("reservation-confirmed received", info)
        confirmReservation(info)
    })

    room.onMessage("reservation-stream-confirmed", async (info:any)=>{
        console.log("reservation-stream-confirmed received", info)
    })

    room.onMessage("cancel-reservation", (info:any)=>{
        console.log("cancel reservation" + ' received', info)
        cancelUserReservation(info)
    })

    room.onMessage("get-locations", async (info:any)=>{
        console.log("get-locations" + ' received', info)
        setUserReservation(info.user)
        initLocations(info)
    })

    room.onMessage("get-location-reservations", async (info:any)=>{
        console.log("get-location-reservations" + ' received', info)
        updateLocationReservations(info)
    })
}
import { ColliderLayer, engine, Entity, InputAction, inputSystem, Material, MeshCollider, MeshRenderer, PointerEvents, PointerEventType, Transform } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import resources from "./helpers/resources";
import { movePlayerTo } from "~system/RestrictedActions";
import { InputListenSystem } from "./systems";
import { userReservation } from "./reservation";
import { localUserId, sendServerMessage } from "./server";
import { showCalendar, showReservationPopup, updateSelectedLocation } from "./ui/reservationPopup";

let baseX = -9
let baseY = -91

export let locationsMap:Map<number, any> = new Map()
let locationEntitiesMap:Map<Entity, number> = new Map()

let hoveredLocation:Map<Entity, Color4> = new Map()

export function initLocations(info:any){
    createBrowserMapPlane()

    let locations = info.locations

    locations.forEach((location:any)=>{
        let base = location.parcels[0]
        let [xs,ys] = base.split(",")

        let x = resources.DEBUG ? (parseInt(xs) - baseX) * 16 : parseInt(xs) * 16
        let y = resources.DEBUG ? (parseInt(ys) - baseY) * 16 :  parseInt(ys) * 16

        let parent = engine.addEntity()
        Transform.create(parent, {position: Vector3.create(x, 0, y)})

        let box = engine.addEntity()
        location.entity = box

        let size = calculateSquareSize(location.parcels)
        Transform.createOrReplace(box, {parent:parent, position:Vector3.create((size*16)/2, 0, (size*16)/2), scale:Vector3.create(size * 16, size * 16, size * 16)})

        locationEntitiesMap.set(box, location.id)
        locationsMap.set(location.id, location)

        enableLocationBox(location.id)
    })
    engine.addSystem(InputListenSystem)
}

export function enableLocationBox(id:number){
    let location = locationsMap.get(id)//
    if(!location){
        return
    }

    let box = location.entity

    MeshRenderer.setBox(box)
    MeshCollider.setBox(box, ColliderLayer.CL_POINTER)

    PointerEvents.createOrReplace(box, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_HOVER_ENTER,
                eventInfo: {
                    button: InputAction.IA_POINTER,
                    showFeedback: false,
                    maxDistance:1000,
                },
            },
            {
                eventType: PointerEventType.PET_HOVER_LEAVE,
                eventInfo: {
                    button: InputAction.IA_POINTER,
                    showFeedback: false,
                    maxDistance:1000
                },
            },
        ],
    })

    setLocationColor(box, userReservation && userReservation.locationId === location.id ? true : undefined)
    hoveredLocation.set(location.entity, userReservation && userReservation.locationId === location.id ? resources.colors.opaqueBlue : resources.colors.opaqueGreen)
}

export function setLocationColor(entity:Entity, user?:boolean){
    Material.setPbrMaterial(entity, {albedoColor: user ? resources.colors.opaqueBlue : resources.colors.opaqueGreen})
}

export function removeLocationBox(id:number){
    let location = locationsMap.get(id)
    if(!location){
        return
    }

    MeshCollider.deleteFrom(location.entity)
    MeshRenderer.deleteFrom(location.entity)
    Material.deleteFrom(location.entity)
    PointerEvents.deleteFrom(location.entity)
}

export function movePlayerBrowserMap(){
    movePlayerTo({newRelativePosition: resources.DEBUG ? Vector3.create(160,150,160) : Vector3.create(160, 150, 160)})
}

export function highlightLocation(entity:Entity){
    let locationId = locationEntitiesMap.get(entity)
    if(!locationId){
        return
    }

    let location = locationsMap.get(locationId)
    if(!location){
        return
    }

    console.log(userReservation)

    if(userReservation){
        return
    }

    PointerEvents.createOrReplace(entity, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_HOVER_LEAVE,
                eventInfo: {
                    button: InputAction.IA_POINTER,
                    showFeedback: false,
                    maxDistance:1000
                },
            },
            {
                eventType: PointerEventType.PET_DOWN,
                eventInfo: {
                    button: InputAction.IA_POINTER,
                    showFeedback: true,
                    maxDistance:1000,
                    hoverText:"Reserve"
                },
            },
        ],
    })

    if(!location.reservation || location.reservation.id !== userReservation.id){
        Material.setPbrMaterial(entity, {albedoColor: resources.colors.opaqueYellow})
        hoveredLocation.set(entity, resources.colors.opaqueGreen)
    }
}

export function unHighlightLocation(entity:Entity){
    let previousColor = hoveredLocation.get(entity)
    if(!previousColor){
        return
    }

    PointerEvents.createOrReplace(entity, {
        pointerEvents: [
            {
                eventType: PointerEventType.PET_HOVER_ENTER,
                eventInfo: {
                    button: InputAction.IA_POINTER,
                    showFeedback: true,
                    maxDistance:1000,
                },
            },
            {
                eventType: PointerEventType.PET_HOVER_LEAVE,
                eventInfo: {
                    button: InputAction.IA_POINTER,
                    showFeedback: false,
                    maxDistance:1000
                },
            },
        ],
    })

    Material.setPbrMaterial(entity, {albedoColor: previousColor})
    hoveredLocation.delete(entity)
}

export function clickedLocation(entity:Entity){
    if(showCalendar){
        return
    }

    let locationId = locationEntitiesMap.get(entity)
    if(!locationId){
        return
    }

    let location = locationsMap.get(locationId)
    if(!location){
        return
    }

    // if(location.reservation && location.reservation.id !== userReservation.id){
    //     console.log('click on somoene else reservation')
    //     return
    // }

    // if(location.reservation && location.reservation.id === userReservation && userReservation.id){
    //     console.log('clicked on my own reservation')
    //     return
    // }

    updateSelectedLocation(location.id)
    showReservationPopup(true)

    //
    // sendServerMessage('reserve', {locationId:location.id, startDate:new Date(), length:5})
}

export function updateLocation(info:any, mod:string){
    let location = locationsMap.get(info.id)
    if(!location){
        console.log('location doesnt exsit')
        return
    }
    if(mod === "add"){
        location.reservation = info.reservation
    }

    if(mod === "del"){
        delete location.reservation
    }
}

export function updateLocationColor(info:any){
    let location = locationsMap.get(info.id)
    if(!location){
        console.log('location doesnt exsit')
        return
    }
    Material.setPbrMaterial( location.entity, {albedoColor: location.reservation ? location.reservation.id === userReservation.id ? resources.colors.opaqueBlue : resources.colors.opaqueRed : resources.colors.opaqueGreen})
    hoveredLocation.set(location.entity, location.reservation ? location.reservation.id === userReservation.id ? resources.colors.opaqueBlue : resources.colors.opaqueRed : resources.colors.opaqueGreen)
}

function createBrowserMapPlane(){
    let plane = engine.addEntity()
    // MeshRenderer.setPlane(plane)
    MeshCollider.setPlane(plane, ColliderLayer.CL_PHYSICS)

    let x = resources.DEBUG ? 16 * 10 : 1 * 16
    let z = resources.DEBUG ? 16 * 10 : -81 * 16

    Transform.create(plane, {position: Vector3.create(x, 100, z), rotation:Quaternion.fromEulerDegrees(90,0,0), scale:Vector3.create(16*20, 16*20, 1)})
}

export function calculateSquareSize(parcels: string[]): number {
    // Step 1: Parse the parcel coordinates into an array of tuples
    const coordinates = parcels.map((parcel) => {
      const [x, y] = parcel.split(',').map(Number);
      return { x, y };
    });
  
    // Step 2: Find the min and max values for x and y
    const minX = Math.min(...coordinates.map(coord => coord.x));
    const maxX = Math.max(...coordinates.map(coord => coord.x));
    const minY = Math.min(...coordinates.map(coord => coord.y));
    const maxY = Math.max(...coordinates.map(coord => coord.y));
  
    // Step 3: Calculate the side length of the square
    const sideLength = Math.max(maxX - minX, maxY - minY) + 1;
  
    // Verify it's a square (optional, but useful for debugging)
    if (maxX - minX !== maxY - minY) {
      throw new Error("The parcels do not form a perfect square.");
    }
  
    return sideLength;
}
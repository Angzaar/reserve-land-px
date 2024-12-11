import { inputSystem, InputAction, PointerEventType, PointerEvents, Entity } from "@dcl/sdk/ecs"
import { clickedLocation, highlightLocation, unHighlightLocation } from "./locations"
export function InputListenSystem(dt:number){
    //HOVER ACTIONS
    const hoverResult = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_ENTER)
    if (hoverResult && hoverResult.hit && hoverResult.hit.entityId) {
        let hoverEvents = PointerEvents.get(hoverResult.hit.entityId as Entity)
        if (hoverEvents) {
            highlightLocation( hoverResult.hit.entityId as Entity)
        }
    }

    const hoverLeaveResult = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_HOVER_LEAVE)
    if (hoverLeaveResult && hoverLeaveResult.hit && hoverLeaveResult.hit.entityId) {
        let hoverEvents = PointerEvents.get(hoverLeaveResult.hit.entityId as Entity)
        if (hoverEvents) {
            unHighlightLocation( hoverLeaveResult.hit.entityId as Entity)
        }
    }

    const clickResult = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
    if (clickResult && clickResult.hit && clickResult.hit.entityId) {
        let hoverEvents = PointerEvents.get(clickResult.hit.entityId as Entity)
        if (hoverEvents) {
            clickedLocation(clickResult.hit.entityId as Entity)
        }
    }
}
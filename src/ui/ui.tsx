import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { createReservationDetails } from './reservationDetails'
import { createToolsPanel } from './toolsPanel'
import { createReservationPopup } from './reservationPopup'
import { createPopup } from './popup'

export let dimensions:any = {
  width:0,
  height:0,
  aspect:0
}

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

function getUISize(){
  let canvas = UiCanvasInformation.get(engine.RootEntity)
  dimensions.aspect = canvas.devicePixelRatio
  dimensions.width = canvas.width
  dimensions.height = canvas.height
}

export const uiComponent:any = () => [
  createToolsPanel(),
  createReservationDetails(),
  createReservationPopup(),
  createPopup()
]


let timer = 0   
function uiSizer(dt:number){
  if(timer > 0){
    timer -= dt
  }
  else{
    timer = 5
    getUISize()
  }
}
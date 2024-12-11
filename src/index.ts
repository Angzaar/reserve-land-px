import './polyfill'
import { initBuilding } from './building'
import { setupUi } from './ui/ui'
import { enableBuilderHUD } from './dcl-builder-hud/ui/builderpanel'
import { initGalleries } from './galleries'
import { getExplorerConfiguration } from '~system/EnvironmentApi'
import { getPreview } from './helpers/functions'
import {getPlayer} from "@dcl/sdk/players";
import { utils } from "./helpers/libraries";
import { executeTask} from "@dcl/sdk/ecs";
import { joinServer, setLocalUserId } from './server'
import { initStores } from './stores'
import { initLocations } from './locations'


export function main() {
  setupUi()

  getPreview().then(()=>{
    let data:any
    try{
      checkPlayer(data)
    }
    catch(e){
        console.log('cannot run deprecated function get explorer configuration', e)
    }
  })
}

function checkPlayer(hardwareData:any){
  let player = getPlayer()
  console.log('player is', player)
  if(!player){
      console.log('player data not set, backing off and trying again')
      utils.timers.setTimeout(()=>{
          checkPlayer(hardwareData)
      }, 100)
  }
  else{
      createPlayer(hardwareData, player)
  }
}

function createPlayer(hardwareData:any, player:any){
  const playerData = setLocalUserId(player)
  if (playerData) {
      executeTask(async () => {

          // const sceneInfo = await getSceneInformation({})
          // if (!sceneInfo) return

          // const sceneJson = JSON.parse(sceneInfo.metadataJson)
          // console.log("scene json is", sceneJson)

          // if(!sceneJson.iwb) return
          // await setRealm(sceneJson, hardwareData.clientUri)

          joinServer()
      })
  }
}


//npm run deploy -- --target-content https://worlds-content-server.decentraland.org
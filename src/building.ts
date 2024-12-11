import { engine, Entity, GltfContainer, Transform } from "@dcl/sdk/ecs";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export let building:Entity

export function initBuilding(){
    building = engine.addEntity()
    GltfContainer.create(building, {src: "assets/building.glb"})
    Transform.create(building, {position: Vector3.create(128,0,64), rotation:Quaternion.fromEulerDegrees(0,180,0)})


    createEnvFlooring()
}

function createEnvFlooring(){
    floorConfigs.forEach((config:any)=>{
        let floor = engine.addEntity()
        GltfContainer.create(floor, {src:"assets/b110b07c-a432-4c9b-a426-6ddaa9256588.glb"})
        Transform.create(floor, {position:config.position, scale:Vector3.create(1,1,1)})
    })
}

let floorConfigs:any[] = [
    {position:Vector3.create(8,0,-40)},
    {position:Vector3.create(8,0,-24)},
    {position:Vector3.create(8,0,-8)},
    {position:Vector3.create(-8,0,-8)},
    {position:Vector3.create(-8,0,24)},
    {position:Vector3.create(-8,0,40)},
    {position:Vector3.create(-8,0,56)},

    {position:Vector3.create(24,0,-24)},
    {position:Vector3.create(40,0,-24)},
    {position:Vector3.create(56,0,-24)},
    {position:Vector3.create(72,0,-24)},
    {position:Vector3.create(88,0,-24)},

    {position:Vector3.create(56,0,-40)},
    {position:Vector3.create(56,0,-8)},
    {position:Vector3.create(72,0,-8)},
    {position:Vector3.create(88,0,-8)},

    {position:Vector3.create(104,0,-8)},
    {position:Vector3.create(104,0,-24)},
    {position:Vector3.create(104,0,-40)},
    {position:Vector3.create(120,0,-8)},
]
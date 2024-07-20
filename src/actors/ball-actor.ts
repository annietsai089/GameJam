import { PhysicalShapeMesh, SphereCollisionShape } from "@hology/core";
import { Actor, AssetLoader, BaseActor, PhysicsBodyType, PhysicsSystem, attach, inject } from "@hology/core/gameplay";
import { MeshComponent } from "@hology/core/gameplay/actors";
import { AxisInput } from "@hology/core/gameplay/input";
import { NodeShaderMaterial, rgba, select, varyingAttributes } from "@hology/core/shader-nodes";
import { Euler, SphereGeometry, Vector3 } from "three";

const ballMaterial = new NodeShaderMaterial({
  color: select(varyingAttributes.position.y().lt(0), rgba(0xffff00, 1), rgba(0x00ffff, 1))
})

@Actor()
class BallActor extends BaseActor {  
  
  
  private physicsSystem = inject(PhysicsSystem)
  public readonly axisInput = new AxisInput()
  public readonly direction = new Vector3() 

  private assetLoader = inject(AssetLoader)

  async onInit() {
    
    this.physicsSystem.addActor(this,[new SphereCollisionShape(0.2)],{
    type: PhysicsBodyType.dynamic,
    mass: 2,
    friction: 1
  })
    this.physicsSystem.showDebug=true
    this.physicsSystem.setLinearDamping(this, .2)
    this.physicsSystem.setAngularDamping(this, 10)
    const rotation = new Euler().set(0, this.rotation.y, 0)
    const impulse = new Vector3()

    const inputForce = 100
    const sensitivity = 1.8
    
    this.physicsSystem.beforeStep.subscribe(deltaTime => {
      rotation.y += deltaTime * -this.axisInput.horizontal * sensitivity
  
      this.direction
        .set(0,0,1)
        .applyEuler(rotation)

      impulse
        .copy(this.direction)
        .multiplyScalar(inputForce * deltaTime * this.axisInput.vertical)

      this.physicsSystem.applyImpulse(this, impulse)
    })
    const { scene, animations } = await this.assetLoader.getModelByAssetName('burger')
    scene.translateY(-0.15)
    this.object.add(scene)
  }
  public moveTo(position: Vector3) {
    this.position.copy(position)
    this.physicsSystem.updateActorTransform(this)
    this.physicsSystem.setLinearVelocity(this, new Vector3())
  }
}

export default BallActor
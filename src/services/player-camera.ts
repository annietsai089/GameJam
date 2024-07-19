import { Service, ViewController, inject } from "@hology/core/gameplay";
import { Vector3 } from "three";
import BallActor from "../actors/ball-actor";

@Service()
class PlayerCamera {
  private view = inject(ViewController)
  private cameraOffset = new Vector3(0, .5, 0)

  public setup(target: BallActor) {
    const camera = this.view.getCamera()

    this.view.onLateUpdate(target).subscribe(() => {
      camera.position
        .copy(target.position)
        .addScaledVector(target.direction, -2)
        .add(this.cameraOffset)
      camera.lookAt(target.position)
    })
  }
}

export default PlayerCamera
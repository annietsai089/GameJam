import { Service, inject } from "@hology/core/gameplay";
import { InputService, Keybind } from "@hology/core/gameplay/input";
import BallActor from "../actors/ball-actor";

enum InputAction {
  moveForward,
  moveBackward,
  rotateLeft,
  rotateRight,
}

@Service()
class PlayerController {
  private inputService = inject(InputService)

  public setup(ballActor: BallActor) {
    this.inputService.bindToggle(InputAction.moveForward, ballActor.axisInput.togglePositiveY)
    this.inputService.bindToggle(InputAction.moveBackward, ballActor.axisInput.toggleNegativeY)
    this.inputService.bindToggle(InputAction.rotateLeft, ballActor.axisInput.toggleNegativeX)
    this.inputService.bindToggle(InputAction.rotateRight, ballActor.axisInput.togglePositiveX)

    this.inputService.setKeybind(InputAction.moveForward, new Keybind('w'))
    this.inputService.setKeybind(InputAction.moveBackward, new Keybind('s'))
    this.inputService.setKeybind(InputAction.rotateLeft, new Keybind('a'))
    this.inputService.setKeybind(InputAction.rotateRight, new Keybind('d'))

    this.inputService.start()
  }
}

export default PlayerController
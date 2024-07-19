import { GameInstance, Service, ViewController, World, inject } from '@hology/core/gameplay';
import { SpawnPoint } from '@hology/core/gameplay/actors';
import BallActor from '../actors/ball-actor';
import PlayerCamera from './player-camera';
import PlayerController from './player-controller';

@Service()
class Game extends GameInstance {
  private world = inject(World)
  private playerCamera = inject(PlayerCamera)
  private playerController = inject(PlayerController)
  private view = inject(ViewController)

  async onStart() {
    const spawnPoint = this.world.findActorByType(SpawnPoint)
    const ball = await spawnPoint.spawnActor(BallActor)
    this.playerCamera.setup(ball)
    this.playerController.setup(ball)

    this.view.onLateUpdate().subscribe(() => {
      if (ball.position.y < -10) {
        ball.moveTo(spawnPoint.position)
      }
    })
    
    const triggerVolume = this.world.findActorByType(TriggerVolume)
    triggerVolume.trigger.onBeginOverlapWithActor(ball).subscribe(() => {
      ball.moveTo(spawnPoint.position)
    })
  }
}

export default Game
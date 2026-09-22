import { CollisionLayer } from "../contracts/enum/entity-domain/collision-layer";
import { CollisionRole } from "../contracts/enum/entity-domain/collision-role";

type CollisionPreset = {
  layer: CollisionLayer;
  mask: CollisionLayer[];
};

/** Default collision layers shown for each entity collision role. */
export const CollisionPresets: Record<CollisionRole, CollisionPreset> = {
  [CollisionRole.Player]: {
    layer: CollisionLayer.Player,
    mask: [CollisionLayer.Wall, CollisionLayer.Enemy, CollisionLayer.EnemyProjectile, CollisionLayer.Collectible],
  },
  [CollisionRole.Enemy]: {
    layer: CollisionLayer.Enemy,
    mask: [CollisionLayer.Wall, CollisionLayer.Player, CollisionLayer.PlayerProjectile],
  },
  [CollisionRole.PlayerProjectile]: {
    layer: CollisionLayer.PlayerProjectile,
    mask: [CollisionLayer.Wall, CollisionLayer.Enemy],
  },
  [CollisionRole.EnemyProjectile]: {
    layer: CollisionLayer.EnemyProjectile,
    mask: [CollisionLayer.Wall, CollisionLayer.Player],
  },
  [CollisionRole.Collectible]: {
    layer: CollisionLayer.Collectible,
    mask: [CollisionLayer.Player],
  },
  [CollisionRole.Wall]: {
    layer: CollisionLayer.Wall,
    mask: [CollisionLayer.Player, CollisionLayer.Enemy, CollisionLayer.PlayerProjectile, CollisionLayer.EnemyProjectile],
  },
};

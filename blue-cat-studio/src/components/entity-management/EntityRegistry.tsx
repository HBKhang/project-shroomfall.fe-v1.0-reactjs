import React from 'react';
import { 
  CollisionForm, 
  AIForm, 
  LifetimeForm, 
  ProjectileForm, 
  AppearanceForm, 
  TriggeredEffectForm, 
  InventoryForm, 
  CharacteristicForm 
} from './EntityForms';

export const ComponentRegistry: Record<string, { title: string; component: React.FC<any> }> = {
  'CollisionDefinitionDTO': { title: 'Collision Geometry', component: CollisionForm },
  'AIDefinitionDTO': { title: 'AI Brain Configuration', component: AIForm },
  'LifetimeDefinitionDTO': { title: 'Temporal Volatility Lifetime', component: LifetimeForm },
  'ProjectileDefinitionDTO': { title: 'Ballistics Projectile Engine', component: ProjectileForm },
  'AppearanceDefinitionDTO': { title: 'Visual Rendering & Customization Skin', component: AppearanceForm },
  'TriggeredEffectDefinitionDTO': { title: 'Trigger Event Pipelines', component: TriggeredEffectForm },
  'InventoryDefinitionDTO': { title: 'Inventory Data Store', component: InventoryForm },
  'CharacteristicDefinitionDTO': { title: 'RPG Characteristic Engine', component: CharacteristicForm },
};

export const EntitySchemaRules: Record<any, string[]> = {
  Projectile: ['CollisionDefinitionDTO', 'LifetimeDefinitionDTO', 'TriggeredEffectDefinitionDTO', 'AppearanceDefinitionDTO', 'ProjectileDefinitionDTO'],
  WorldObject: ['CollisionDefinitionDTO', 'AppearanceDefinitionDTO'],
  Creature: ['CollisionDefinitionDTO', 'CharacteristicDefinitionDTO', 'InventoryDefinitionDTO', 'AppearanceDefinitionDTO', 'AIDefinitionDTO'],
  Player: ['CollisionDefinitionDTO', 'CharacteristicDefinitionDTO', 'InventoryDefinitionDTO', 'AppearanceDefinitionDTO'],
  Item: ['CollisionDefinitionDTO'],
};
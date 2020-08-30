import { Vector } from './vector';
import { ScenarioObject } from './vtsparser';

type Track = RacePoint[];
export interface RacePoint {
  time: number
  waypoint: Vector
  radius: number
  f1: Vector
  f2: Vector
}
export interface RaceConfiguration {
  name: string;
  flare_radius: number;
}
export class Race {
  track: Track
  length: number
  vts: ScenarioObject
  config: RaceConfiguration

  constructor(vts: ScenarioObject, config: RaceConfiguration) {
    this.vts = vts;
    this.config = config;
    this.track = this.vtsToTrack(vts, config.name);
    this.trackTimeWaypoints()
    this.length = 0
  }

  static vtsToTrack(vts: ScenarioObject, name: string): Track {
    return [];
  }

  static trackTimeWaypoints(track: Track): Track {
    return;
  }

  static trackSetRadius(track: Track): Track {
    return;
  }

  static trackPlaceFlares(track: Track): Track {
    return;
  }

  private writeToVts(): ScenarioObject {
    return this.vts;
  }
}

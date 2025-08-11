import { Mechanism } from './types';
import { loadFromJSON } from './io';

export function createMechanism(data: any): Mechanism {
  return loadFromJSON(data);
}

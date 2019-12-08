import BinaryStream from '../../../common/binarystream';

/**
 * A terrain doodad.
 *
 * This type of doodad works much like cliffs.
 * It uses the height of the terrain, and gets affected by the ground heightmap.
 * It cannot be manipulated in any way in the World Editor once placed.
 * Indeed, the only way to change it is to remove it by changing cliffs around it.
 */
export default class TerrainDoodad {
  id: string;
  u1: number;
  location: Uint32Array;

  constructor() {
    this.id = '\0\0\0\0';
    this.u1 = 0;
    this.location = new Uint32Array(2);
  }

  load(stream: BinaryStream, version: number) {
    this.id = stream.read(4);
    this.u1 = stream.readUint32();
    this.location = stream.readUint32Array(2);
  }

  save(stream: BinaryStream, version: number) {
    stream.write(this.id);
    stream.writeUint32(this.u1);
    stream.writeUint32Array(this.location);
  }
}
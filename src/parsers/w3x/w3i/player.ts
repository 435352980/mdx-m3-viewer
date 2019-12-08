import BinaryStream from '../../../common/binarystream';

/**
 * A player.
 */
export default class Player {
  id: number;
  type: number;
  race: number;
  isFixedStartPosition: number;
  name: string;
  startLocation: Float32Array;
  allyLowPriorities: number;
  allyHighPriorities: number;

  constructor() {
    this.id = 0;
    this.type = 0;
    this.race = 0;
    this.isFixedStartPosition = 0;
    this.name = '';
    this.startLocation = new Float32Array(2);
    this.allyLowPriorities = 0;
    this.allyHighPriorities = 0;
  }

  load(stream: BinaryStream) {
    this.id = stream.readInt32();
    this.type = stream.readInt32();
    this.race = stream.readInt32();
    this.isFixedStartPosition = stream.readInt32();
    this.name = stream.readUntilNull();
    stream.readFloat32Array(this.startLocation);
    this.allyLowPriorities = stream.readUint32();
    this.allyHighPriorities = stream.readUint32();
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.id);
    stream.writeInt32(this.type);
    stream.writeInt32(this.race);
    stream.writeInt32(this.isFixedStartPosition);
    stream.write(`${this.name}\0`);
    stream.writeFloat32Array(this.startLocation);
    stream.writeUint32(this.allyLowPriorities);
    stream.writeUint32(this.allyHighPriorities);
  }

  getByteLength() {
    return 33 + this.name.length;
  }
}
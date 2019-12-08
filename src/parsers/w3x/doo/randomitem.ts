import BinaryStream from '../../../common/binarystream';

/**
 * A random item.
 */
export default class RandomItem {
  id: string;
  chance: number;

  constructor() {
    this.id = '\0\0\0\0';
    this.chance = 0;
  }

  load(stream: BinaryStream) {
    this.id = stream.read(4);
    this.chance = stream.readInt32();
  }

  save(stream: BinaryStream) {
    stream.write(this.id);
    stream.writeInt32(this.chance);
  }
}
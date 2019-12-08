import BinaryStream from '../../../common/binarystream';

/**
 * A tile corner.
 */
export default class Corner {
  groundHeight: number;
  waterHeight: number;
  mapEdge: number;
  ramp: number;
  blight: number;
  water: number;
  boundary: number;
  groundTexture: number;
  cliffVariation: number;
  groundVariation: number;
  cliffTexture: number;
  layerHeight: number;

  constructor() {
    this.groundHeight = 0;
    this.waterHeight = 0;
    this.mapEdge = 0;
    this.ramp = 0;
    this.blight = 0;
    this.water = 0;
    this.boundary = 0;
    this.groundTexture = 0;
    this.cliffVariation = 0;
    this.groundVariation = 0;
    this.cliffTexture = 0;
    this.layerHeight = 0;
  }

  load(stream: BinaryStream) {
    this.groundHeight = (stream.readInt16() - 8192) / 512;

    let waterAndEdge = stream.readInt16();

    this.waterHeight = ((waterAndEdge & 0x3FFF) - 8192) / 512;
    this.mapEdge = waterAndEdge & 0x4000;

    let textureAndFlags = stream.readUint8();

    this.ramp = textureAndFlags & 0b00010000;
    this.blight = textureAndFlags & 0b00100000;
    this.water = textureAndFlags & 0b01000000;
    this.boundary = textureAndFlags & 0b10000000;

    this.groundTexture = textureAndFlags & 0b00001111;

    let variation = stream.readUint8();

    this.cliffVariation = (variation & 0b11100000) >>> 5;
    this.groundVariation = variation & 0b00011111;

    let cliffTextureAndLayer = stream.readUint8();

    this.cliffTexture = (cliffTextureAndLayer & 0b11110000) >>> 4;
    this.layerHeight = cliffTextureAndLayer & 0b00001111;
  }

  save(stream: BinaryStream) {
    stream.writeInt16(this.groundHeight * 512 + 8192);
    stream.writeInt16(this.waterHeight * 512 + 8192 + this.mapEdge << 14);
    stream.writeUint8((this.ramp << 4) | (this.blight << 5) | (this.water << 6) | (this.boundary << 7) | this.groundTexture);
    stream.writeUint8((this.cliffVariation << 5) | this.groundVariation);
    stream.writeUint8((this.cliffTexture << 4) + this.layerHeight);
  }
}
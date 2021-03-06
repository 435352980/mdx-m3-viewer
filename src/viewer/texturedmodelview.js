import ModelView from './modelview';

/**
 * A textured model view.
 * Gives a consistent API for texture overloading for handlers that use it.
 */
export default class TexturedModelView extends ModelView {
  /**
   * @param {Model} model
   */
  constructor(model) {
    super(model);

    /** @member {Map<Texture, Texture>} */
    this.textures = new Map();
  }

  /**
   * Bind a texture to some texture unit.
   * Checks the model view for an override.
   *
   * @param {Texture} texture
   * @param {number} unit
   */
  bindTexture(texture, unit) {
    if (this.textures.has(texture)) {
      texture = this.textures.get(texture);
    }

    // If the texture exists, bind it.
    // Otherwise, bind null, which will result in a black texture being bound to avoid console errors.
    if (texture) {
      texture.bind(unit);
    } else {
      this.model.viewer.webgl.bindTexture(null, unit);
    }
  }

  /**
   * The shallow copy of a textured model view is a map of its textures.
   *
   * @return {Object}
   */
  getShallowCopy() {
    return {textures: new Map(this.textures)};
  }

  /**
   * Apply the texture map from the given shallow view.
   *
   * @param {Object} view
   */
  applyShallowCopy(view) {
    let textures = this.textures;

    for (let [src, dst] of view.textures) {
      textures.set(src, dst);
    }
  }

  /**
   * Two textured model views are equal if their texture maps have the same mapping.
   *
   * @param {Object} view
   * @return {boolean}
   */
  equals(view) {
    let textures = this.textures;
    let dstTextures = view.textures;

    if (textures.length !== dstTextures.length) {
      return false;
    }

    for (let [src, dst] of dstTextures) {
      if (textures.get(src) !== dst) {
        return false;
      }
    }

    return true;
  }
}

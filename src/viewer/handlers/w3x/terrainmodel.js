import MdxParser from '../../../parsers/mdlx/model';

/**
 * A static terrain model.
 */
export default class TerrainModel {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {ArrayBuffer} arrayBuffer
   * @param {Array<number>} locations
   * @param {Array<number>} textures
   */
  constructor(gl, arrayBuffer, locations, textures, attribs) {
    let instancedArrays = gl.extensions.instancedArrays;
    let vertexArrayObject = gl.extensions.vertexArrayObject;
    let parser = new MdxParser(arrayBuffer);
    let geoset = parser.geosets[0];
    let vertices = geoset.vertices;
    let normals = geoset.normals;
    let uvs = geoset.uvSets[0];
    let faces = geoset.faces;
    let normalsOffset = vertices.byteLength;
    let uvsOffset = normalsOffset + normals.byteLength;
    let vao = null;

    if (vertexArrayObject) {
      vao = vertexArrayObject.createVertexArrayOES();
      vertexArrayObject.bindVertexArrayOES(vao);
    }

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvsOffset + uvs.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, normalsOffset, normals);
    gl.bufferSubData(gl.ARRAY_BUFFER, uvsOffset, uvs);

    if (vao) {
      gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(attribs.a_position);

      gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 12, normalsOffset);
      gl.enableVertexAttribArray(attribs.a_normal);

      gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 8, uvsOffset);
      gl.enableVertexAttribArray(attribs.a_uv);
    }

    let texturesOffset = locations.length * 4;
    let locationAndTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, locationAndTextureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texturesOffset + textures.length, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(locations));
    gl.bufferSubData(gl.ARRAY_BUFFER, texturesOffset, new Uint8Array(textures));

    if (vao) {
      gl.vertexAttribPointer(attribs.a_instancePosition, 3, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(attribs.a_instancePosition);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 1);

      gl.vertexAttribPointer(attribs.a_instanceTexture, 1, gl.UNSIGNED_BYTE, false, 1, texturesOffset);
      gl.enableVertexAttribArray(attribs.a_instanceTexture);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceTexture, 1);

    }

    let faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW);

    if (vao) {
      vertexArrayObject.bindVertexArrayOES(null);
    }

    /** @member {WebGLBuffer} */
    this.vertexBuffer = vertexBuffer;
    /** @member {WebGLBuffer} */
    this.faceBuffer = faceBuffer;
    /** @member {number} */
    this.normalsOffset = normalsOffset;
    /** @member {number} */
    this.uvsOffset = uvsOffset;
    /** @member {number} */
    this.elements = faces.length;
    /** @member {WebGLBuffer} */
    this.locationAndTextureBuffer = locationAndTextureBuffer;
    /** @member {number} */
    this.texturesOffset = texturesOffset;
    /** @member {number} */
    this.instances = locations.length / 3;

    this.vao = vao;
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {ANGLEInstancedArrays} instancedArrays
   * @param {Object} attribs
   */
  render(gl, instancedArrays, attribs) {
    if (this.vao) {
      gl.extensions.vertexArrayObject.bindVertexArrayOES(this.vao);
    } else {
      // Locations and textures.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.locationAndTextureBuffer);
      gl.vertexAttribPointer(attribs.a_instancePosition, 3, gl.FLOAT, false, 12, 0);
      gl.vertexAttribPointer(attribs.a_instanceTexture, 1, gl.UNSIGNED_BYTE, false, 1, this.texturesOffset);

      // Vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 12, 0);
      gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 12, this.normalsOffset);
      gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 8, this.uvsOffset);

      // Faces.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
    }

    // Draw.
    instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, 0, this.instances);

    if (this.vao) {
      gl.extensions.vertexArrayObject.bindVertexArrayOES(null);
    }
  }
}

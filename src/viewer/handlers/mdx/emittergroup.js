/**
 * A group of emitters that are going to be rendered together.
 */
export default class EmitterGroup {
  /**
   * @param {ModelView} modelView
   */
  constructor(modelView) {
    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {Array<ParticleEmitter2|RibbonEmitter>} */
    this.objects = [];
  }

  /**
   * @param {ModelViewData} modelViewData
   */
  render(modelViewData) {
    let viewer = this.modelView.model.viewer;
    let gl = viewer.gl;
    let instancedArrays = gl.extensions.instancedArrays;
    let modelView = modelViewData.modelView;
    let shader = viewer.shaderMap.get('MdxParticleShader');
    let uniforms = shader.uniforms;
    let attribs = shader.attribs;

    gl.depthMask(0);
    gl.enable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    viewer.webgl.useShaderProgram(shader);

    gl.uniformMatrix4fv(uniforms.u_mvp, false, modelViewData.scene.camera.worldProjectionMatrix);
    gl.uniform1i(uniforms.u_texture, 0);

    instancedArrays.vertexAttribDivisorANGLE(attribs.a_position, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, viewer.rectBuffer);
    gl.vertexAttribPointer(attribs.a_position, 1, gl.UNSIGNED_BYTE, false, 0, 0);

    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p0, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p1, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p2, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p3, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_health, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_color, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_tail, 1);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_leftRightTop, 1);

    for (let emitter of this.objects) {
      emitter.render(modelView, shader);
    }

    instancedArrays.vertexAttribDivisorANGLE(attribs.a_leftRightTop, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_tail, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_color, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_health, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p3, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p2, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p1, 0);
    instancedArrays.vertexAttribDivisorANGLE(attribs.a_p0, 0);
  }
}

export default {
  vs: `
    uniform mat4 u_mvp;

    // Instances
    attribute vec3 a_m0;
    attribute vec3 a_m1;
    attribute vec3 a_m2;
    attribute vec3 a_m3;
    attribute vec3 a_faceColor;
    attribute vec3 a_edgeColor;

    // Vertices
    attribute vec3 a_position;
    attribute vec2 a_uv;

    varying vec2 v_uv;
    varying vec3 v_faceColor;
    varying vec3 v_edgeColor;

    void main() {
      v_uv = a_uv;
      v_faceColor = a_faceColor;
      v_edgeColor = a_edgeColor;

      gl_Position = u_mvp * mat4(a_m0, 0.0, a_m1, 0.0, a_m2, 0.0, a_m3, 1.0) * vec4(a_position, 1.0);
    }
  `,
  ps: `
    uniform sampler2D u_diffuseMap;
    uniform bool u_isEdge;
    uniform bool u_hasTexture;
    uniform bool u_isBGR;

    varying vec2 v_uv;
    varying vec3 v_faceColor;
    varying vec3 v_edgeColor;

    void main() {
      vec3 color;

      if (u_isEdge) {
        color = v_edgeColor;
      } else {
        color = v_faceColor;

        if (u_hasTexture) {
          vec4 texel = texture2D(u_diffuseMap, v_uv);

          if (u_isBGR) {
            texel = texel.bgra;
          }

          color *= texel.rgb;
        }
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
var SHADERS = {
	"vsbonetexture":"\n#define PI texture2D\nuniform sampler2D u_boneMap;uniform float u_matrix_size,u_texel_size;mat4 A(float a){float b=a*u_matrix_size;return mat4(PI(u_boneMap,vec2(b,0)),PI(u_boneMap,vec2(b+u_texel_size,0)),PI(u_boneMap,vec2(b+u_texel_size*2.,0)),PI(u_boneMap,vec2(b+u_texel_size*3.,0)));}",
	"decodefloat":"vec3 B(float a){vec3 b;b[2]=floor(a/65536.);b[1]=floor((a-b[2]*65536.)/256.);b[0]=floor(a-b[2]*65536.-b[1]*256.);return b;}",
	"vsworld":"uniform mat4 u_mvp;uniform vec2 u_uv_offset;attribute vec3 a_position;attribute vec2 a_uv;varying vec2 N;void main(){N=a_uv+u_uv_offset;gl_Position=u_mvp*vec4(a_position,1);}",
	"vswhite":"uniform mat4 u_mvp;attribute vec3 a_position;void main(){gl_Position=u_mvp*vec4(a_position,1);}",
	"psworld":"uniform sampler2D u_texture;uniform float u_a;varying vec2 N;void main(){gl_FragColor=vec4(texture2D(u_texture,N).rgb,u_a);}",
	"pswhite":"void main(){gl_FragColor=vec4(1);}",
	"pscolor":"uniform vec3 u_color;void main(){gl_FragColor=vec4(u_color/255.,1);}",
	"vstexture":"uniform mat4 u_mvp;attribute vec3 a_position;attribute vec2 a_uv;varying vec2 N;void main(){N=a_uv;gl_Position=u_mvp*vec4(a_position,1);}",
	"pstexture":"uniform sampler2D u_texture;varying vec2 N;void main(){gl_FragColor=texture2D(u_texture,N);}",
	"wvsmain":"\n#define T attribute\n#define CJ vec3\n#define CK vec4\nuniform mat4 u_mvp;uniform CJ u_uv_offset;T CJ a_position,a_normal;T vec2 a_uv;T CK a_bones;T float a_bone_number;varying CJ O;varying vec2 N;void C(CJ d,CJ c,float a,CK b,out CJ f,out CJ e){CK l=CK(d,1);CK k=CK(c,0);CK m;mat4 g=A(b[0]);mat4 h=A(b[1]);mat4 i=A(b[2]);mat4 j=A(b[3]);m=CK(0);m+=g*l;m+=h*l;m+=i*l;m+=j*l;m/=a;f=CJ(m);m=CK(0);m+=g*k;m+=h*k;m+=i*k;m+=j*k;e=normalize(CJ(m));}void main(){CJ b,a;C(a_position,a_normal,a_bone_number,a_bones,b,a);O=a;N=a_uv+u_uv_offset.xy;gl_Position=u_mvp*CK(b,1);}",
	"wvsribbons":"uniform mat4 u_mvp;uniform vec3 u_uv_offset;attribute vec3 a_position;attribute vec2 a_uv;varying vec2 N;void main(){N=a_uv+u_uv_offset.xy;gl_Position=u_mvp*vec4(a_position,1);}",
	"wvsparticles":"uniform mat4 u_mvp;uniform vec2 u_dimensions;attribute vec3 a_position;attribute vec2 a_uva_rgb;varying vec2 N;varying vec4 P;void main(){vec3 b=B(a_uva_rgb[0]);vec3 a=B(a_uva_rgb[1]);N=b.xy/u_dimensions;P=vec4(a,b.z)/255.;gl_Position=u_mvp*vec4(a_position,1);}",
	"wvscolor":"\n#define T attribute\nuniform mat4 u_mvp;T vec3 a_position;T vec4 a_bones;T float a_bone_number;void main(){vec4 b=vec4(a_position,1);vec4 a=(A(a_bones[0])*b+A(a_bones[1])*b+A(a_bones[2])*b+A(a_bones[3])*b)/a_bone_number;gl_Position=u_mvp*a;}",
	"wvswhite":"\n#define T attribute\nuniform mat4 u_mvp;T vec3 a_position;T vec4 a_bones;T float a_bone_number;void C(vec3 c,float a,vec4 b,out vec3 d){vec4 i=vec4(c,1);vec4 j;mat4 e=A(b[0]);mat4 f=A(b[1]);mat4 g=A(b[2]);mat4 h=A(b[3]);j=vec4(0);j+=e*i;j+=f*i;j+=g*i;j+=h*i;j/=a;d=vec3(j);}void main(){vec3 a;C(a_position,a_bone_number,a_bones,a);gl_Position=u_mvp*vec4(a,1);}",
	"wpsmain":"uniform sampler2D u_texture;uniform bool u_alphaTest;uniform vec4 u_modifier,u_tint;varying vec3 O;varying vec2 N;void main(){\n#ifdef STANDARD_PASS\nvec4 a=texture2D(u_texture,N).bgra;if(u_alphaTest&&a.a<.75){discard;}gl_FragColor=a*u_modifier*u_tint;\n#endif\n#ifdef UVS_PASS\ngl_FragColor=vec4(N,.0,1.);\n#endif\n#ifdef NORMALS_PASS\ngl_FragColor=vec4(O,1.);\n#endif\n#ifdef WHITE_PASS\ngl_FragColor=vec4(1.);\n#endif\n}",
	"wpsparticles":"uniform sampler2D u_texture;varying vec2 N;varying vec4 P;void main(){gl_FragColor=texture2D(u_texture,N).bgra*P;}",
	"svscommon":"vec3 D(vec3 d,vec3 c,vec3 a,vec3 b){vec3 e;e.x=dot(d,c);e.y=dot(d,a);e.z=dot(d,b);return e;}vec4 E(vec4 a){return((a/255.)*2.)-1.;}",
	"svsstandard":"\n#define T attribute\n#define CJ vec3\n#define CK vec4\n#define MC normalize\nuniform mat4 u_mvp,u_mv;uniform CJ u_eyePos,u_lightPos;uniform float u_firstBoneLookupIndex;T CJ a_position;T CK a_normal,a_tangent,a_bones,a_weights;T vec2 a_uv0;varying CJ O,Q,R,S;varying vec2 N[4];\n#ifdef EXPLICITUV1\nT vec2 a_uv1;\n#endif\n#ifdef EXPLICITUV2\nT vec2 a_uv1,a_uv2;\n#endif\n#ifdef EXPLICITUV3\nT vec2 a_uv1,a_uv2,a_uv3;\n#endif\nvoid C(CJ c,CJ b,CJ d,CK a,CK h,out CJ f,out CJ e,out CJ g){CK j=CK(c,1);CK i=CK(b,0);CK k=CK(d,0);CK l;mat4 m=A(a[0])*h[0];mat4 n=A(a[1])*h[1];mat4 o=A(a[2])*h[2];mat4 p=A(a[3])*h[3];l=CK(0);l+=m*j;l+=n*j;l+=o*j;l+=p*j;f=CJ(l);l=CK(0);l+=m*i;l+=n*i;l+=o*i;l+=p*i;e=MC(CJ(l));l=CK(0);l+=m*k;l+=n*k;l+=o*k;l+=p*k;g=MC(CJ(l));}void main(){CK b=E(a_normal);CK c=E(a_tangent);CJ j,i,m;C(a_position,CJ(b),CJ(c),a_bones+u_firstBoneLookupIndex,a_weights/255.,j,i,m);mat3 g=mat3(u_mv);CJ k=(u_mv*CK(j,1)).xyz;CJ h=MC(g*i);CJ l=MC(g*m);CJ a=MC(cross(h,l)*b.w);CJ f=MC(u_lightPos-k);Q=MC(D(f,l,a,h));CJ d=MC(u_eyePos-k);CJ e=MC(d-u_lightPos);R=D(d,l,a,h);S=D(e,l,a,h);O=h;N[0]=a_uv0/2048.;N[1]=vec2(0);N[2]=vec2(0);N[3]=vec2(0);\n#ifdef EXPLICITUV1\nN[1]=a_uv1/2048.;\n#endif\n#ifdef EXPLICITUV2\nN[1]=a_uv1/2048.;N[2]=a_uv2/2048.;\n#endif\n#ifdef EXPLICITUV3\nN[1]=a_uv1/2048.;N[2]=a_uv2/2048.;N[3]=a_uv3/2048.;\n#endif\ngl_Position=u_mvp*CK(j,1);}",
	"svscolor":"uniform mat4 u_mvp;uniform float u_firstBoneLookupIndex;attribute vec3 a_position;attribute vec4 a_bones,a_weights;void C(vec3 b,vec4 a,vec4 d,out vec3 c){vec4 e=vec4(b,1);vec4 f;mat4 g=A(a[0])*d[0];mat4 h=A(a[1])*d[1];mat4 i=A(a[2])*d[2];mat4 j=A(a[3])*d[3];f=vec4(0);f+=g*e;f+=h*e;f+=i*e;f+=j*e;c=vec3(f);}void main(){vec3 a;C(a_position,a_bones+u_firstBoneLookupIndex,a_weights/255.,a);gl_Position=u_mvp*vec4(a,1);}",
	"spscommon":"\n#define AV else\n#define BJ return\n#define CK vec4\n#define DD sampler2D\nuniform vec3 u_teamColor;varying vec3 O,Q,R,S;varying vec2 N[4];struct M{bool enabled,invert,clampResult;float op,channels,teamColorMode,uvCoordinate;};vec3 F(CK a,vec3 c,M b){if(b.op==.0){c*=a.rgb;}AV if(b.op==1.){c*=a.rgb*2.;}AV if(b.op==2.){c+=a.rgb*a.a;}AV if(b.op==6.){c+=a.rgb;}AV if(b.op==3.){c=mix(c,a.rgb,a.a);}AV if(b.op==4.){c+=a.a*(u_teamColor/255.);}AV if(b.op==5.){c+=a.a*(u_teamColor/255.);}BJ c;}CK G(float a,CK b){if(a==3.){b=b.rrrr;}AV if(a==4.){b=b.gggg;}AV if(a==5.){b=b.bbbb;}AV if(a==2.){b=b.aaaa;}AV if(a==.0){b.a=1.;}BJ b;}vec2 H(M a){if(a.uvCoordinate==1.){BJ N[1];}AV if(a.uvCoordinate==2.){BJ N[2];}AV if(a.uvCoordinate==3.){BJ N[3];}BJ N[0];}CK I(DD a,M b){BJ texture2D(a,H(b));}CK J(DD a,M b){CK d=I(a,b);CK c=G(b.channels,d);if(b.teamColorMode==1.){c=CK(mix(u_teamColor/255.,c.rgb,d.a),1);}AV if(b.teamColorMode==2.){c=CK(mix(u_teamColor/255.,c.rgb,d.a),1);}if(b.invert){c=CK(1)-c;}if(b.clampResult){c=clamp(c,.0,1.);}BJ c;}vec3 K(DD a){CK c=texture2D(a,N[0]);vec3 b;b.xy=2.*c.wy-1.;b.z=sqrt(max(.0,1.-dot(b.xy,b.xy)));BJ b;}CK L(DD d,M a,float e,float c,vec3 b){CK f;if(a.enabled){f=J(d,a);}AV{f=CK(0);}float g=pow(max(-dot(S,b),.0),e)*c;BJ f*g;}",
	"spsstandard":"\n#define V uniform\nV float u_specularity,u_specMult,u_emisMult;V vec4 u_lightAmbient;V M u_diffuseLayerSettings,u_decalLayerSettings,u_specularLayerSettings,u_glossLayerSettings,u_emissiveLayerSettings,u_emissive2LayerSettings,u_evioLayerSettings,u_evioMaskLayerSettings,u_alphaLayerSettings,u_alphaMaskLayerSettings,u_normalLayerSettings,u_heightLayerSettings,u_lightMapLayerSettings,u_aoLayerSettings;V sampler2D u_diffuseMap,u_decalMap,u_specularMap,u_glossMap,u_emissiveMap,u_emissive2Map,u_evioMap,u_evioMaskMap,u_alphaMap,u_alphaMaskMap,u_normalMap,u_heightMap,u_lightMapMap,u_aoMap;void main(){vec3 b;vec4 f=u_lightAmbient;vec3 j;vec3 i;if(u_normalLayerSettings.enabled){j=K(u_normalMap);}else{j=O;}float g=max(dot(j,Q),.0);if(g>.0){if(u_diffuseLayerSettings.enabled){vec4 d=J(u_diffuseMap,u_diffuseLayerSettings);b=F(d,b,u_diffuseLayerSettings);}if(u_decalLayerSettings.enabled){vec4 c=J(u_decalMap,u_decalLayerSettings);b=F(c,b,u_decalLayerSettings);}vec4 k=L(u_specularMap,u_specularLayerSettings,u_specularity,u_specMult,j);if(u_lightMapLayerSettings.enabled){vec4 h=J(u_lightMapMap,u_lightMapLayerSettings)*2.;i=h.rgb;}f.rgb=(b+k.rgb)*g;bool a=false;vec3 e;vec4 l;if(u_emissiveLayerSettings.enabled){l=J(u_emissiveMap,u_emissiveLayerSettings);if(u_emissiveLayerSettings.op==.0||u_emissiveLayerSettings.op==1.||u_emissiveLayerSettings.op==3.){f.rgb=F(l,f.rgb,u_emissiveLayerSettings);}else{e=F(l,e,u_emissiveLayerSettings);a=true;}}if(u_emissive2LayerSettings.enabled){l=J(u_emissive2Map,u_emissive2LayerSettings);if(!a&&(u_emissive2LayerSettings.op==.0||u_emissive2LayerSettings.op==1.||u_emissive2LayerSettings.op==3.)){f.rgb=F(l,f.rgb,u_emissive2LayerSettings);}else{e=F(l,e,u_emissive2LayerSettings);a=true;}}if(a){f.rgb+=e*u_emisMult;}}gl_FragColor=f;}",
	"svswhite":"uniform mat4 u_mvp;uniform float u_firstBoneLookupIndex;attribute vec3 a_position;attribute vec4 a_bones,a_weights;void C(vec3 b,vec4 a,vec4 d,out vec3 c){vec4 e=vec4(b,1);vec4 f;mat4 g=A(a[0])*d[0];mat4 h=A(a[1])*d[1];mat4 i=A(a[2])*d[2];mat4 j=A(a[3])*d[3];f=vec4(0);f+=g*e;f+=h*e;f+=i*e;f+=j*e;c=vec3(f);}void main(){vec3 a;C(a_position,a_bones+u_firstBoneLookupIndex,a_weights/255.,a);gl_Position=u_mvp*vec4(a,1);}",
	"spsspecialized":"\n#define V uniform\n#define DD sampler2D\n#ifdef DIFFUSE_PASS\nV M u_diffuseLayerSettings;V DD u_diffuseMap;\n#endif\n#ifdef UV_PASS\nV M u_diffuseLayerSettings;V DD u_diffuseMap;\n#endif\n#ifdef SPECULAR_PASS\nV M u_specularLayerSettings;V DD u_specularMap;V float u_specularity,u_specMult;\n#endif\n#ifdef HIGHRES_NORMALS\nV M u_normalLayerSettings;V DD u_normalMap;\n#endif\n#ifdef EMISSIVE_PASS\nV M u_emissiveLayerSettings,u_emissive2LayerSettings;V DD u_emissiveMap,u_emissive2Map;V float u_emisMult;\n#endif\n#ifdef DECAL_PASS\nV M u_decalLayerSettings;V DD u_decalMap;\n#endif\nvoid main(){vec4 b=vec4(.0);vec3 f;\n#ifdef HIGHRES_NORMALS\nf=K(u_normalMap);\n#else\nf=O;\n#endif\n#ifdef DIFFUSE_PASS\nb=J(u_diffuseMap,u_diffuseLayerSettings);\n#endif\n#ifdef NORMALS_PASS\nb=vec4(f,1);\n#endif\n#ifdef UV_PASS\nb=vec4(H(u_diffuseLayerSettings),0,1);\n#endif\n#ifdef SPECULAR_PASS\nb=L(u_specularMap,u_specularLayerSettings,u_specularity,u_specMult,f);\n#endif\n#ifdef EMISSIVE_PASS\nbool a=false;vec3 d=vec3(0);vec4 g;if(u_emissiveLayerSettings.enabled){g=J(u_emissiveMap,u_emissiveLayerSettings);if(u_emissiveLayerSettings.op==.0||u_emissiveLayerSettings.op==1.||u_emissiveLayerSettings.op==3.){b.rgb=F(g,b.rgb,u_emissiveLayerSettings);}else{d=F(g,d,u_emissiveLayerSettings);a=true;}}if(u_emissive2LayerSettings.enabled){g=J(u_emissive2Map,u_emissive2LayerSettings);if(!a&&(u_emissive2LayerSettings.op==.0||u_emissive2LayerSettings.op==1.||u_emissive2LayerSettings.op==3.)){b.rgb=F(g,b.rgb,u_emissive2LayerSettings);}else{d=F(g,d,u_emissive2LayerSettings);a=true;}}if(a){b.rgb+=d.rgb*u_emisMult;}\n#endif\n#ifdef UNSHADED_PASS\nfloat e=max(dot(f,Q),.0);b=vec4(e,e,e,1);\n#endif\n#ifdef DECAL_PASS\nif(u_decalLayerSettings.enabled){vec4 c=J(u_decalMap,u_decalLayerSettings);b.rgb=F(c,b.rgb,u_decalLayerSettings);b.a=1.;}\n#endif\n#ifdef WHITE_PASS\nb=vec4(1.);\n#endif\ngl_FragColor=b;}",
	"svsparticles":"uniform mat4 u_mvp;attribute vec3 a_position;void main(){gl_Position=u_mvp*vec4(a_position,1);}",
	"spsparticles":"void main(){gl_FragColor=vec4(1);}"
};
uniform sampler2D tDiffuse;
uniform sampler2D tFlash;
uniform float edgeR;
uniform float edgeG;
uniform float edgeB;

varying vec2 vUv;

void main() {

    vec4 texelFlash = texture2D(tFlash, vUv);
    vec4 texelEdge = texture2D(tDiffuse, vUv);

    vec4 edgeColor = vec4(edgeR, edgeG, edgeB, 1.0);
    float brightness = (texelEdge.r + texelEdge.g + texelEdge.b) / 3.0;

    gl_FragColor = mix(texelFlash, vec4(1.-texelEdge.rgb, 1.0), brightness); // RGB

}

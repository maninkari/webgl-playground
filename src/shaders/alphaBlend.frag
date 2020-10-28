uniform sampler2D tDiffuse;
uniform sampler2D tBlend;

varying vec2 vUv;

void main() {

    vec4 texelBlend = texture2D(tBlend, vUv);

    vec4 texelDiffuse = texture2D(tDiffuse, vUv);

    vec3 color = texelBlend.a * texelBlend.rgb + (1.0 - texelBlend.a) * texelDiffuse.rgb;

    gl_FragColor = vec4(color, 1.0);

}

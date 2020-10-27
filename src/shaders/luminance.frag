const vec3 W = vec3(0.2125, 0.7154, 0.0721);

uniform sampler2D tCamera;

varying vec2 vUv;

void main() {

    vec4 textureColor = texture2D(tCamera, vUv);
    float luminance = dot(textureColor.rgb, W);

    gl_FragColor = vec4(vec3(luminance), textureColor.a);

}

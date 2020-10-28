uniform sampler2D tDiffuse;
uniform vec2 uVideo;
uniform vec4 crop;

varying vec2 vUv;

void main() {

    vec2 scale = crop.zw / uVideo.xy;
    vec2 offset = vec2(
        crop.x / uVideo.x,
        (uVideo.y - crop.y - crop.w) / uVideo.y
    );

    gl_FragColor = texture2D(tDiffuse, (vUv * scale) + offset);

}

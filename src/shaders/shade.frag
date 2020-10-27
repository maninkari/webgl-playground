uniform sampler2D tDiffuse;
uniform sampler2D tShade;
uniform vec4 blend;
uniform vec4 fade;

varying vec2 vUv;

void main(void) {

    float step1 = 0.8;
    float step2 = 0.6;
    float step3 = 0.3;
    float step4 = 0.15;
    float alpha = 1.0;

    vec3 shade = vec3(1.0);
    vec4 color = vec4(1.0);

    vec4 texelLines = texture2D(tDiffuse, vUv);
    vec4 texelShade = texture2D(tShade, vUv);

    float brightness = (0.2126 * texelShade.r) + (0.7152 * texelShade.g) + (0.0722 * texelShade.b);
    float brightest = max(max(texelShade.r, texelShade.g), texelShade.b);
    float dimmest = min(min(texelShade.r, texelShade.g), texelShade.b);
    float delta = brightest - dimmest;

    if (delta > 0.1) {
        texelShade = texelShade * (1.0 / brightest);
    } else {
        texelShade.rgb = vec3(1.0);
    }

    if (brightness < step1) {
        shade = vec3(texelShade.rgb * step1);
    }

    if (brightness < step2) {
        shade = vec3(texelShade.rgb * step2);
    }

    if (brightness < step3) {
        shade = vec3(texelShade.rgb * step3);
    }

    if (brightness < step4) {
        shade = vec3(texelShade.rgb * step4);
    }

    if (texelLines.rgb == vec3(0.0)) {
        color = 1.0 - vec4(mix(shade, blend.rgb, blend.a), 0.0);
    }

    if (fade.x > 0.0) {
        alpha *= smoothstep(0.0, fade.x * abs(sin(0.5)), vec4(vUv, 1.0 - vUv)).x;
    }

    if (fade.y > 0.0) {
        alpha *= smoothstep(0.0, fade.y * abs(sin(0.5)), vec4(vUv, 1.0 - vUv)).y;
    }

    if (fade.z > 0.0) {
        alpha *= smoothstep(0.0, fade.z * abs(sin(0.5)), vec4(vUv, 1.0 - vUv)).z;
    }

    if (fade.w > 0.0) {
        alpha *= smoothstep(0.0, fade.w * abs(sin(0.5)), vec4(vUv, 1.0 - vUv)).w;
    }

    if (fade != vec4(0.0)) {
        color = vec4(mix(vec3(0.0), color.rgb, alpha), 1.0);
    }

    gl_FragColor = color;

}

import React, { useEffect, useRef } from 'react';

export default function HeroShaderCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    float strength = 0.5 + 0.5 * sin(u_time * 0.2);
    vec2 grid = fract(uv * 40.0 + sin(u_time * 0.1));
    float line = smoothstep(0.02, 0.0, grid.x) + smoothstep(0.02, 0.0, grid.y);
    
    float glow = 0.0;
    for(float i = 0.0; i < 3.0; i++) {
        vec2 p = uv;
        p.x += sin(u_time * 0.5 + i * 1.5) * 0.2;
        p.y += cos(u_time * 0.3 + i * 2.0) * 0.2;
        glow += 0.05 / length(p - 0.5);
    }
    
    vec3 baseColor = vec3(0.047, 0.051, 0.059);
    vec3 accentColor = vec3(1.0, 0.42, 0.42);
    
    vec3 color = mix(baseColor, accentColor * 0.15, line * strength);
    color += accentColor * glow * 0.05;
    
    gl_FragColor = vec4(color, 1.0);
}`;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    let animFrameId;
    function render(t) {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameId = requestAnimationFrame(render);
    }

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div id="webgl-container">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

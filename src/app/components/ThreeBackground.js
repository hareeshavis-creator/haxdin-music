"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DeepDarkGradientShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 p = uv * 2.0 - 1.0;
      
      // Base colors for ultra-dark black gradient
      vec3 color1 = vec4(0.0, 0.0, 0.0, 1.0).rgb; // Pure Black
      vec3 color2 = vec3(0.02, 0.02, 0.03); // Near Black
      vec3 color3 = vec3(0.04, 0.02, 0.06); // Extremely Subtle Deep Purple
      
      // Dynamic gradient based on mouse and time
      float t = uTime * 0.15;
      float d = length(p - uMouse * 0.15);
      
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      
      vec3 finalColor = mix(color1, color2, uv.y + sin(t + uv.x * 2.0) * 0.05);
      finalColor = mix(finalColor, color3, 1.0 - smoothstep(0.0, 2.0, d));
      
      // Subtle atmospheric grain
      finalColor += (noise - 0.5) * 0.02;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

function BackgroundPlane() {
  const mesh = useRef();
  const { size, viewport } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) }
  }), [size]);

  useFrame((state) => {
    const { clock, mouse } = state;
    mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
    mesh.current.material.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      mesh.current.material.uniforms.uMouse.value.x,
      mouse.x,
      0.05
    );
    mesh.current.material.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      mesh.current.material.uniforms.uMouse.value.y,
      mouse.y,
      0.05
    );
  });

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        fragmentShader={DeepDarkGradientShader.fragmentShader}
        vertexShader={DeepDarkGradientShader.vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -2,
      background: '#000000',
      overflow: 'hidden'
    }}>
      <Canvas dpr={[1, 2]}>
        <BackgroundPlane />
      </Canvas>
    </div>
  );
}

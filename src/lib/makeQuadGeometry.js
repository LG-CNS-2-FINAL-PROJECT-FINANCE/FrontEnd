// 상속/클래스 없이 바로 쓰는 사각형 지오메트리
export default function makeQuadGeometry(size = 1) {
  const s = size / 2;
  // 4개 정점 (x,y,z)
  const vertices = new Float32Array([-s, -s, 0, s, -s, 0, s, s, 0, -s, s, 0]);
  // UV
  const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
  // 두 삼각형 인덱스
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  return { vertices, uvs, indices };
}

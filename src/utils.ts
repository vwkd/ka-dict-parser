const encoder = new TextEncoder();
const decoder = new TextDecoder();

// input in code point
export function ByteCodePointConverter(input) {

  const points = input;
  const bytes = encoder.encode(input);

  function getPointIndex(byteIndex) {
    const bytesBefore = bytes.slice(0, byteIndex);
    const pointIndex = decoder.decode(bytesBefore).length;
    
    return pointIndex;
  }
  
  function getByteIndex(pointIndex) {
    const pointsBefore = points.slice(0, pointIndex);
    const byteIndex = encoder.encode(pointsBefore).length;
    
    return byteIndex;
  }
  
  return {
    points,
    bytes,
    getPointIndex,
    getByteIndex,
  }
}

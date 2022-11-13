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

  // note: first line number is one, not zero
  function getLineNumber(pointIndex) {
    return (points.slice(0, pointIndex).match(/\n/g)?.length ?? 0) + 1;
  }

  function getLineText(pointIndex) {
    // todo: what if error is on newline? then `indexNewlineBefore == indexNewlineAfter == indexFailure`

    // beware: if error in first line, then indexNewlineBefore is -1, don't change to 0, because `indexNewlineBefore + 1` luckily happens to then compute to 0 already
    const indexNewlineBefore = points.lastIndexOf("\n", pointIndex);
    // beware: if error in last line, then indexNewlineAfter is -1, change to Infinity
    const indexNewlineAfterMaybe = points.indexOf("\n", pointIndex);
    const indexNewlineAfter = indexNewlineAfterMaybe == -1
      ? Infinity
      : indexNewlineAfterMaybe;

    return points.slice(indexNewlineBefore + 1, indexNewlineAfter);
  }

  // note: first line index is one, not zero
  function getLineIndex(pointIndex) {
    // todo: what if error is on newline? then `indexNewlineBefore == indexNewlineAfter == indexFailure`

    // beware: if error in first line, then indexNewlineBefore is -1, don't change to 0, because `- -1` luckily happens to then compute to 1 already
    const indexNewlineBefore = points.lastIndexOf("\n", pointIndex);

    return pointIndex - indexNewlineBefore;
  }

  return {
    points,
    bytes,
    getPointIndex,
    getByteIndex,
    getLineNumber,
    getLineText,
    getLineIndex,
  };
}

export const pipe = (...fns) => (x) => fns.reduce((res, fn) => fn(res), x);

export default function hexToBytes(str: any) {
  if (!str) {
    return new Uint8Array();
  }

  const a = [] as number[];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }

  return new Uint8Array(a);
}

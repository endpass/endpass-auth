export default function(address) {
  return !/^xpub/.test(address);
}

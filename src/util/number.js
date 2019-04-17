export const fillWeiStringWithZeros = wei => {
  const valueLenght = wei.length;

  if (valueLenght > 19) return wei;

  const diff = 19 - valueLenght;

  return `${Array(diff)
    .fill(0)
    .join('')}${wei}`;
};

export const discardFloatingZeros = numericString => {
  const preprocessedString = numericString.replace(/\.?0{1,}$/, '');

  return preprocessedString;
};

export const fromWei = (wei, symbols = 6) => {
  if (wei === '0') return wei;

  const filledWeiString = fillWeiStringWithZeros(wei);
  const diff = Math.abs(18 - filledWeiString.length);
  const floatPart = filledWeiString.slice(diff, diff + symbols);
  const numbericFloatPart = Number(floatPart).toFixed(symbols);

  if (diff === 0) {
    return discardFloatingZeros(numbericFloatPart.toString());
  }

  const integerPart = filledWeiString.slice(0, diff);
  const numbericValue = Number(`${integerPart}.${floatPart}`).toFixed(symbols);

  return discardFloatingZeros(numbericValue.toString());
};

export default {
  fillWeiStringWithZeros,
  discardFloatingZeros,
  fromWei,
};

const WEI_FLOAT_LENGTH = 18;

export const fromWei = (wei, symbols = 6) => {
  if (wei === '0') return wei;

  const filledWeiString = wei.padStart(19, '0');
  const floatPart = filledWeiString.slice(
    -WEI_FLOAT_LENGTH,
    symbols - WEI_FLOAT_LENGTH,
  );
  const integerPart = filledWeiString.slice(0, -18);
  const numericStr = `${integerPart}.${floatPart}`;

  return numericStr.replace(/\.?0{1,}$/, '');
};

export default {
  fromWei,
};

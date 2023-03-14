const SIZE_PATTERN = /([\d\.]+)(px|pt)/i;
const FONT_PT_SIZES = [
    8,
    9,
    10,
    11,
    12,
    14,
    18,
    24,
    30,
    36,
    48,
    60,
    72,
    90,
  ];

  
export const PX_TO_PT_RATIO = 0.7518796992481203; // 1 / 1.33.
export const PT_TO_PX_RATIO = 1.33;

export default function convertToCSSPTValue(styleValue) {
  const matches = styleValue.match(SIZE_PATTERN);
  if (!matches) {
    return 0;
  }
  let value = parseFloat(matches[1]);
  const unit = matches[2];
  if (!value || !unit) {
    return 0;
  }
  if (unit === 'px') {
    value = PX_TO_PT_RATIO * value;
  }
  return value;
}

export function toClosestFontPtSize(styleValue) {
  const originalPTValue = convertToCSSPTValue(styleValue);

  if (FONT_PT_SIZES.includes(originalPTValue)) {
    return originalPTValue;
  }

  return FONT_PT_SIZES.reduce((prev, curr) => {
    return Math.abs(curr - originalPTValue) < Math.abs(prev - originalPTValue)
      ? curr
      : prev;
  }, Number.NEGATIVE_INFINITY);
}

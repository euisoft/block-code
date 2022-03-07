export const Utils = {
  findIndex: (
    index: number,
    length: number,
    maxLength: number,
    maxInputs: number
  ) => {
    if (length === maxLength && index < maxInputs) {
      ++index
    } else if (length === 0 && index > 0) {
      --index
    }

    return index
  },

  createId: (prefix = 'block-code') =>
    `${prefix}-${Math.random().toString(36).substring(2, 9)}`,

  createChunk: (value: string, length: number) =>
    value.match(new RegExp('.{1,' + length + '}', 'g'))
}

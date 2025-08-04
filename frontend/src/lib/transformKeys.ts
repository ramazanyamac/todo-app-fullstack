export type Messages = Record<string, string>;

export type NestedMessages = Record<string, any>;

export const transformKeys = (messages: Messages): NestedMessages => {
  const transformed: NestedMessages = {};

  Object.entries(messages).forEach(([key, value]) => {
    const keys = key.split('.');
    keys.reduce((acc: NestedMessages, part: string, index: number) => {
      if (index === keys.length - 1) {
        acc[part] = value;
      } else {
        acc[part] = acc[part] || {};
      }
      return acc[part];
    }, transformed);
  });

  return transformed;
};

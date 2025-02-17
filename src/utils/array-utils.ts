export const firstOrThrow = <T>(collection: T[]): T => {
  if (collection.length === 0) {
    throw new Error("Trying to get first element of empty array");
  }

  return collection[0];
};

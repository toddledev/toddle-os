const handler = ([a]: any[]) => {
  if (typeof a !== "number") {
    // throw new Error('Argument must be a number')
    return null;
  }
  return Math.abs(a);
};

export default handler;

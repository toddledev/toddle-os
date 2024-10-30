import { toBoolean } from "@toddle/core/src/util";

const handler = ([input]: any[]) => {
  return toBoolean(input);
};

export default handler;

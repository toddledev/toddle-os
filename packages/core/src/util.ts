// cSpell:ignore ABCDEFGHIJKLMNOPQRSTYVWXYZ
export const isDefined = <T>(value: T | undefined | null): value is T =>
  value !== null && value !== undefined;

export const isObject = (input: any): input is Record<string, any> =>
  typeof input === "object" && input !== null;

export const toBoolean = (value: any) =>
  value !== false && value !== undefined && value !== null;

/**
 * Checks if a header is a json (content-type) header
 * Also supports edge cases like application/vnd.api+json and application/vnd.contentful.delivery.v1+json
 * See https://jsonapi.org/#mime-types
 */
export const isJsonHeader = (header?: string | null) => {
  if (typeof header !== "string") {
    return false;
  }
  return /^application\/(json|.*\+json)/.test(header);
};

export const isTextHeader = (header?: string | null) => {
  if (typeof header !== "string") {
    return false;
  }
  return /^(text\/|application\/x-www-form-urlencoded|application\/(xml|.*\+xml))/.test(
    header
  );
};

export const isEventStreamHeader = (header?: string | null) => {
  if (typeof header !== "string") {
    return false;
  }
  return /^text\/event-stream/.test(header);
};

export const isJsonStreamHeader = (header?: string | null) => {
  if (typeof header !== "string") {
    return false;
  }
  return /^(application\/stream\+json|application\/x-ndjson)/.test(header);
};

export const isImageHeader = (header?: string | null) => {
  if (typeof header !== "string") {
    return false;
  }
  return /^image\//.test(header);
};

const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:.\d{1,3})?Z$/;

/**
 * This function is much slower than JSON parse without reviver and is a major
 * bottleneck in the runtime performance. Especially during startup.
 */
export function parseJSONWithDate(input: string) {
  return JSON.parse(input, (_, value) => {
    if (
      typeof value === "string" &&
      value.length === 24 &&
      iso8601Regex.test(value)
    ) {
      return new Date(value);
    }
    return value;
  });
}

/**
 * Convert a component name to a valid HTML tag name according to the custom-element specs
 *
 * https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element
 */
export const safeCustomElementName = (name: string) => {
  // Remove any white spaces from the name
  const tag = name.toLocaleLowerCase().replaceAll(" ", "");

  // Add "toddle-" prefix if needed
  if (!tag.includes("-")) {
    return `toddle-${tag}`;
  }

  return tag;
};

/**
 * Removes non-alphanumeric characters except for _ from a function name
 * @param name
 * @returns "safe" function name only containing alphanumeric characters and _, e.g. "myFunction" or "my_function"
 */
export const safeFunctionName = (name: string) => {
  return (
    name
      // Remove any non-alphanumeric characters
      .replaceAll(/[^a-zA-Z0-9_]/g, "")
      // Remove any leading numbers
      .replace(/^[0-9]+/, "")
  );
};

export function kebabCase(string: string) {
  return string
    .split("")
    .map((char) => {
      return "ABCDEFGHIJKLMNOPQRSTYVWXYZ".includes(char)
        ? "-" + char.toLocaleLowerCase()
        : char;
    })
    .join("");
}

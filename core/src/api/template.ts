export const STRING_TEMPLATE = (
  type: keyof typeof templateTypes,
  name: string,
) => {
  return `{{ ${templateTypes[type]}.${name} }}`
}

const templateTypes = {
  cookies: 'cookies',
}

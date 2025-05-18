export const fillTemplate = (
  template: string,
  variables: Record<string, any>
): string => {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    try {
      const func = new Function(...Object.keys(variables), `return ${key}`);
      return func(...Object.values(variables)).toString();
    } catch {
      return "";
    }
  });
};

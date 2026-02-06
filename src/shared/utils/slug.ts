export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createDoctorSlug = (name: string, id: string | number): string => {
  const nameSlug = generateSlug(name);
  return `${nameSlug}-${id}`;
};

export const extractIdFromSlug = (slug: string): string | null => {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  return null;
};

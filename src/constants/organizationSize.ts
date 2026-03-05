export interface OrganizationSize {
  label: string;
  value: string;
}

export const organizationSizes: OrganizationSize[] = [
  { label: "Très petite entreprise (TPE)", value: "TPE" },
  { label: "Petite et moyenne entreprise (PME)", value: "PME" },
  { label: "Entreprise de taille intermédiaire (ETI)", value: "ETI" },
  { label: "Grande entreprise", value: "Grande entreprise" },
  { label: "Startup", value: "Startup" }
];

export const getOrganizationSizeByValue = (value: string): OrganizationSize | undefined => {
  return organizationSizes.find(size => size.value === value);
};

export const isValidOrganizationSize = (value: string): boolean => {
  return organizationSizes.some(size => size.value === value);
};

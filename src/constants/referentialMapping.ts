export const referentialApiMap: Record<string, string> = {
  "ISO 27001": "iso27001",
  "NIST CSF": "nist_csf",
  "RGPD": "rgpd",
  "SOC 2": "soc2"
};

export const getReferentialApiValue = (referentialName: string): string => {
  const apiValue = referentialApiMap[referentialName];
  if (!apiValue) {
    throw new Error(`Référentiel non supporté: ${referentialName}`);
  }
  return apiValue;
};

export const isValidReferential = (referentialName: string): boolean => {
  return referentialName in referentialApiMap;
};

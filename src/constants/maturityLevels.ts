export interface MaturityLevel {
  label: string;
  value: string;
}

export const maturityLevels: MaturityLevel[] = [
  {
    label: "Initial — sécurité ad hoc",
    value: "initial"
  },
  {
    label: "Repeatable — pratiques basiques",
    value: "repeatable"
  },
  {
    label: "Défini — processus documentés",
    value: "défini"
  },
  {
    label: "Géré — pilotage et métriques",
    value: "géré"
  },
  {
    label: "Optimisé — amélioration continue",
    value: "optimisé"
  }
];

export const getMaturityLevelByValue = (value: string): MaturityLevel | undefined => {
  return maturityLevels.find(level => level.value === value);
};

export const isValidMaturityLevel = (value: string): boolean => {
  return maturityLevels.some(level => level.value === value);
};

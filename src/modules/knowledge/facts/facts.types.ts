export type FactValue = string | number | boolean | null | Record<string, any>;

export interface Fact {
  key: string;
  value: FactValue;
  confidence: number;
  sourceText: string;
}

export enum FactTypes {
  NAME = 'NAME',
  DATE_OF_BIRTH = 'DATE_OF_BIRTH',
  GENDER = 'GENDER',
  COUNTRY = 'COUNTRY',
  CITY = 'CITY',
  MARITAL_STATUS = 'MARITAL_STATUS',
  HAS_CHILDREN = 'HAS_CHILDREN',
  OCCUPATION = 'OCCUPATION',
  EDUCATION_LEVEL = 'EDUCATION_LEVEL',
  PERSONALITY_TRAIT = 'PERSONALITY_TRAIT',
  FAVORITE_ACTIVITY = 'FAVORITE_ACTIVITY',
  PREFERRED_COMMUNICATION = 'PREFERRED_COMMUNICATION',
  CURRENT_LOCATION = 'CURRENT_LOCATION',
}

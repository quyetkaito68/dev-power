export type TextTransform =
  // Letter Case
  | 'lowercase'
  | 'uppercase'
  | 'capitalize-words'
  | 'sentence-case'
  | 'toggle-case'
  // Naming Convention
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  // Unicode
  | 'remove-vietnamese-accents'
  | 'remove-all-diacritics'
  | 'vietnamese-to-ascii'
  // Whitespace
  | 'trim'
  | 'remove-duplicate-spaces'
  | 'remove-empty-lines'
  // Line Operations
  | 'sort-ascending'
  | 'sort-descending'
  | 'remove-duplicate-lines';

export interface TextFormatterResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface TransformGroup {
  label: string;
  transforms: { id: TextTransform; label: string; description: string }[];
}

export const TRANSFORM_GROUPS: TransformGroup[] = [
  {
    label: 'Letter Case',
    transforms: [
      { id: 'lowercase', label: 'Lowercase', description: 'Convert all characters to lowercase' },
      { id: 'uppercase', label: 'Uppercase', description: 'Convert all characters to uppercase' },
      { id: 'capitalize-words', label: 'Capitalize Words', description: 'Capitalize the first letter of each word' },
      { id: 'sentence-case', label: 'Sentence Case', description: 'Capitalize first letter of each sentence' },
      { id: 'toggle-case', label: 'Toggle Case', description: 'Invert the case of each character' },
    ],
  },
  {
    label: 'Naming Convention',
    transforms: [
      { id: 'camelCase', label: 'camelCase', description: 'Convert to camelCase' },
      { id: 'PascalCase', label: 'PascalCase', description: 'Convert to PascalCase' },
      { id: 'snake_case', label: 'snake_case', description: 'Convert to snake_case' },
      { id: 'kebab-case', label: 'kebab-case', description: 'Convert to kebab-case' },
      { id: 'CONSTANT_CASE', label: 'CONSTANT_CASE', description: 'Convert to CONSTANT_CASE' },
    ],
  },
  {
    label: 'Unicode',
    transforms: [
      { id: 'remove-vietnamese-accents', label: 'Remove Vietnamese Accents', description: 'Remove Vietnamese diacritics (Tiếng Việt → Tieng Viet)' },
      { id: 'remove-all-diacritics', label: 'Remove All Diacritics', description: 'Remove all diacritical marks from text' },
      { id: 'vietnamese-to-ascii', label: 'Vietnamese to ASCII', description: 'Convert Vietnamese characters to closest ASCII equivalents' },
    ],
  },
  {
    label: 'Whitespace',
    transforms: [
      { id: 'trim', label: 'Trim', description: 'Remove leading and trailing whitespace' },
      { id: 'remove-duplicate-spaces', label: 'Remove Duplicate Spaces', description: 'Replace multiple spaces with single space' },
      { id: 'remove-empty-lines', label: 'Remove Empty Lines', description: 'Remove lines that contain only whitespace' },
    ],
  },
  {
    label: 'Line Operations',
    transforms: [
      { id: 'sort-ascending', label: 'Sort Ascending', description: 'Sort lines alphabetically (A-Z)' },
      { id: 'sort-descending', label: 'Sort Descending', description: 'Sort lines alphabetically (Z-A)' },
      { id: 'remove-duplicate-lines', label: 'Remove Duplicate Lines', description: 'Remove duplicate lines, keeping first occurrence' },
    ],
  },
];

export function getAllTransforms(): TextTransform[] {
  return TRANSFORM_GROUPS.flatMap((g) => g.transforms.map((t) => t.id));
}
import { TRANSFORM_GROUPS, type TextFormatterResult, type TextTransform } from './types';

export type { TextTransform };
export { TRANSFORM_GROUPS };

// Vietnamese character map for accent removal
const VIETNAMESE_MAP: Record<string, string> = {
  // Lowercase
  à: 'a',
  á: 'a',
  ả: 'a',
  ã: 'a',
  ạ: 'a',
  ă: 'a',
  ằ: 'a',
  ắ: 'a',
  ẳ: 'a',
  ẵ: 'a',
  ặ: 'a',
  â: 'a',
  ầ: 'a',
  ấ: 'a',
  ẩ: 'a',
  ẫ: 'a',
  ậ: 'a',
  è: 'e',
  é: 'e',
  ẻ: 'e',
  ẽ: 'e',
  ẹ: 'e',
  ê: 'e',
  ề: 'e',
  ế: 'e',
  ể: 'e',
  ễ: 'e',
  ệ: 'e',
  ì: 'i',
  í: 'i',
  ỉ: 'i',
  ĩ: 'i',
  ị: 'i',
  ò: 'o',
  ó: 'o',
  ỏ: 'o',
  õ: 'o',
  ọ: 'o',
  ô: 'o',
  ồ: 'o',
  ố: 'o',
  ổ: 'o',
  ỗ: 'o',
  ộ: 'o',
  ơ: 'o',
  ờ: 'o',
  ớ: 'o',
  ở: 'o',
  ỡ: 'o',
  ợ: 'o',
  ù: 'u',
  ú: 'u',
  ủ: 'u',
  ũ: 'u',
  ụ: 'u',
  ư: 'u',
  ừ: 'u',
  ứ: 'u',
  ử: 'u',
  ữ: 'u',
  ự: 'u',
  ý: 'y',
  ỵ: 'y',
  ỷ: 'y',
  ỹ: 'y',
  đ: 'd',
  // Uppercase
  À: 'A',
  Á: 'A',
  Ả: 'A',
  Ã: 'A',
  Ạ: 'A',
  Ă: 'A',
  Ằ: 'A',
  Ắ: 'A',
  Ẳ: 'A',
  Ẵ: 'A',
  Ặ: 'A',
  Â: 'A',
  Ầ: 'A',
  Ấ: 'A',
  Ẩ: 'A',
  Ẫ: 'A',
  Ậ: 'A',
  È: 'E',
  É: 'E',
  Ẻ: 'E',
  Ẽ: 'E',
  Ẹ: 'E',
  Ê: 'E',
  Ề: 'E',
  Ế: 'E',
  Ể: 'E',
  Ễ: 'E',
  Ệ: 'E',
  Ì: 'I',
  Í: 'I',
  Ỉ: 'I',
  Ĩ: 'I',
  Ị: 'I',
  Ò: 'O',
  Ó: 'O',
  Ỏ: 'O',
  Õ: 'O',
  Ọ: 'O',
  Ô: 'O',
  Ồ: 'O',
  Ố: 'O',
  Ổ: 'O',
  Ỗ: 'O',
  Ộ: 'O',
  Ơ: 'O',
  Ờ: 'O',
  Ớ: 'O',
  Ở: 'O',
  Ỡ: 'O',
  Ợ: 'O',
  Ù: 'U',
  Ú: 'U',
  Ủ: 'U',
  Ũ: 'U',
  Ụ: 'U',
  Ư: 'U',
  Ừ: 'U',
  Ứ: 'U',
  Ử: 'U',
  Ữ: 'U',
  Ự: 'U',
  Ý: 'Y',
  Ỵ: 'Y',
  Ỷ: 'Y',
  Ỹ: 'Y',
  Đ: 'D',
};

function createResult(success: boolean, output: string, error?: string): TextFormatterResult {
  return { success, output, error };
}

function normalizeLineBreaks(input: string): string {
  return input.replace(/\r\n/g, '\n');
}

function splitLines(input: string): string[] {
  return normalizeLineBreaks(input).split('\n');
}

function applyToEachLine(input: string, transform: (line: string) => string): string {
  return splitLines(input)
    .map((line) => transform(line))
    .join('\n');
}

function validateInput(input: string): TextFormatterResult | null {
  if (input === undefined || input === null) {
    return createResult(false, '', 'Input is empty');
  }
  if (input.trim() === '') {
    return createResult(false, '', 'Input is empty');
  }
  return null;
}

// --- Letter Case Transformations ---

export function toLowercase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, applyToEachLine(input, (line) => line.toLowerCase()));
}

export function toUppercase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, applyToEachLine(input, (line) => line.toUpperCase()));
}

export function toCapitalizeWords(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(
    true,
    applyToEachLine(input, (line) => line.replace(/\b\w/g, (char) => char.toUpperCase()))
  );
}

export function toSentenceCase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(
    true,
    applyToEachLine(input, (line) =>
      line.replace(/(^|[.!?]\s+)(\w)/g, (_match, prefix, char) => prefix + char.toUpperCase())
    )
  );
}

export function toToggleCase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(
    true,
    applyToEachLine(input, (line) =>
      line
        .split('')
        .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
        .join('')
    )
  );
}

// --- Naming Convention Transformations ---

function splitWords(str: string): string[] {
  return str
    .trim()
    .split(/[\s_\-\.]+/)
    .filter((w) => w.length > 0)
    .map((w) => w.toLowerCase());
}

function toCamelCaseValue(value: string): string {
  const words = splitWords(value);
  if (words.length === 0) return '';
  return words[0] + words.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function toPascalCaseValue(value: string): string {
  const words = splitWords(value);
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function toSnakeCaseValue(value: string): string {
  return splitWords(value).join('_');
}

function toKebabCaseValue(value: string): string {
  return splitWords(value).join('-');
}

function toConstantCaseValue(value: string): string {
  return splitWords(value).map((word) => word.toUpperCase()).join('_');
}

export function toCamelCase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, applyToEachLine(input, (line) => toCamelCaseValue(line)));
}

export function toPascalCase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, applyToEachLine(input, (line) => toPascalCaseValue(line)));
}

export function toSnakeCase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, applyToEachLine(input, (line) => toSnakeCaseValue(line)));
}

export function toKebabCase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, applyToEachLine(input, (line) => toKebabCaseValue(line)));
}

export function toConstantCase(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, applyToEachLine(input, (line) => toConstantCaseValue(line)));
}

// --- Unicode Transformations ---

export function removeVietnameseAccents(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(
    true,
    input.replace(/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựýỵỷỹđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰÝỴỶỸĐ]/g, (char) => VIETNAMESE_MAP[char] || char)
  );
}

export function removeAllDiacritics(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  // Normalize to NFD (decomposed) and remove combining diacritical marks
  return createResult(
    true,
    input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  );
}

export function vietnameseToAscii(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  // First remove Vietnamese accents, then remove any remaining diacritics
  let result = input.replace(
    /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựýỵỷỹđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰÝỴỶỸĐ]/g,
    (char) => VIETNAMESE_MAP[char] || char
  );
  result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return createResult(true, result);
}

// --- Whitespace Transformations ---

export function trimText(input: string): TextFormatterResult {
  if (input === undefined || input === null) {
    return createResult(false, '', 'Input is empty');
  }
  return createResult(true, input.trim());
}

export function removeDuplicateSpaces(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(true, input.replace(/[ \t]+/g, ' '));
}

export function removeEmptyLines(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  return createResult(
    true,
    input
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n')
  );
}

// --- Line Operations ---

export function sortAscending(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  const lines = input.split('\n');
  return createResult(true, [...lines].sort().join('\n'));
}

export function sortDescending(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  const lines = input.split('\n');
  return createResult(true, [...lines].sort().reverse().join('\n'));
}

export function removeDuplicateLines(input: string): TextFormatterResult {
  const err = validateInput(input);
  if (err) return err;
  const lines = input.split('\n');
  const seen = new Set<string>();
  const unique = lines.filter((line) => {
    if (seen.has(line)) return false;
    seen.add(line);
    return true;
  });
  return createResult(true, unique.join('\n'));
}

// --- Main dispatch function ---

const transformMap: Record<TextTransform, (input: string) => TextFormatterResult> = {
  // Letter Case
  lowercase: toLowercase,
  uppercase: toUppercase,
  'capitalize-words': toCapitalizeWords,
  'sentence-case': toSentenceCase,
  'toggle-case': toToggleCase,
  // Naming Convention
  camelCase: toCamelCase,
  PascalCase: toPascalCase,
  snake_case: toSnakeCase,
  'kebab-case': toKebabCase,
  CONSTANT_CASE: toConstantCase,
  // Unicode
  'remove-vietnamese-accents': removeVietnameseAccents,
  'remove-all-diacritics': removeAllDiacritics,
  'vietnamese-to-ascii': vietnameseToAscii,
  // Whitespace
  trim: trimText,
  'remove-duplicate-spaces': removeDuplicateSpaces,
  'remove-empty-lines': removeEmptyLines,
  // Line Operations
  'sort-ascending': sortAscending,
  'sort-descending': sortDescending,
  'remove-duplicate-lines': removeDuplicateLines,
};

export function transformText(input: string, transform: TextTransform): TextFormatterResult {
  const fn = transformMap[transform];
  if (!fn) {
    return createResult(false, '', `Unknown transform: ${transform}`);
  }
  return fn(input);
}
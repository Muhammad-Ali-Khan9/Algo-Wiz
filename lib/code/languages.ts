export const CODE_LANGS = [
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "javascript", label: "JavaScript" },
  { id: "csharp", label: "C#" },
] as const;

export type CodeLang = (typeof CODE_LANGS)[number]["id"];

export type CodeSnippets = Record<CodeLang, string>;

export function snippets(
  c: string,
  cpp: string,
  python: string,
  java: string,
  javascript: string,
  csharp: string,
): CodeSnippets {
  return { c, cpp, python, java, javascript, csharp };
}

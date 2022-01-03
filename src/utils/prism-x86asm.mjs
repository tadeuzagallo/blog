export default function addX86asm(Prims) {
  Prism.languages.x86asm = {
    comment: /(;|#).*$/m,
    label: {
      pattern: /^[a-z0-9_]*:/im,
      alias: "function"
    },
    keyword: /^\s*[a-z]+\b/im,
    register: {
      pattern: /%[a-z0-9]+\b/i,
      alias: "class-name"
    },
    section: {
      pattern: /\.[a-z0-9]+\b/i,
      alias: "comment"
    },
    number: /\$?-?(\d+|0x[0-9a-f]+)\b/i,
    symbol_: {
      pattern: /\b[a-z_][a-z0-9_]+\b/i,
      alias: "function",
    }
  };
}

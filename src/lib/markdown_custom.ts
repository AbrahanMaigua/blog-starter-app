import { marked } from "marked";

const colorExtension = {
  name: "color",
  level: "inline",
  start(src: string) {
    return src.match(/{color:/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^{color:(#[0-9a-fA-F]{6})}([\s\S]+?){\/color}/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "color",
        raw: match[0],
        color: match[1],
        tokens: marked.Lexer.lexInline(match[2], { gfm: true }),
      };
    }
    return;
  },
  renderer(token: any) {
    const innerHtml = marked.Parser.parseInline(token.tokens);
    return `<span style="color: ${token.color}">${innerHtml}</span>`;
  },
};

marked.use({ extensions: [colorExtension] });

export function custom_marked(input: string) {
  return marked.parse(input);
}

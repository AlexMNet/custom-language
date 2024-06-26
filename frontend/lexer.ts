export enum TokenType {
  Null,
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Let,
  EOF, //Signifies the end of file
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value = '', type: TokenType): Token {
  return { value, type };
}

function isAlpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isSkippable(str: string) {
  return str == ' ' || str == '\n' || str == '\t';
}

function isInt(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

  return c >= bounds[0] && c <= bounds[1];
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split('');

  // Build each token until end of file
  while (src.length > 0) {
    // if (src[0] === undefined) break;

    if (src[0] == '(') {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ')') {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (
      src[0] == '+' ||
      src[0] == '-' ||
      src[0] == '*' ||
      src[0] == '/' ||
      src[0] == '%'
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] === '=') {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else {
      //Hanlde multicharacter tokens

      // Build number token
      if (isInt(src[0])) {
        let num = '';

        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }

        tokens.push(token(num, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let ident = '';

        while (src.length > 0 && isAlpha(src[0])) {
          ident += src.shift();
        }

        // Check for reservered Keywords
        const reserved = KEYWORDS[ident];
        if (typeof reserved == 'number') {
          tokens.push(token(ident, reserved));
        } else {
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else if (isSkippable(src[0])) {
        src.shift(); //SKIP the current empty space, tab or newline
      } else {
        console.log('Unrecognized character found in source: ', src[0]);
        Deno.exit(1);
      }
    }
  }
  tokens.push({ type: TokenType.EOF, value: 'EndOfFile' });
  return tokens;
}

// const source = await Deno.readTextFile('./test.txt');
// for (const token of tokenize(source)) {
//   console.log(token);
// }
// console.log(tokenize(source));

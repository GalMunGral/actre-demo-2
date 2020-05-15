import { v4 as uuidv4 } from "uuid";

const cache = new Map();
const subruleCache = new Set();
var styleSheet = null;

const compileCSS = (segments, ...fns) => (props) => {
  const computed = [segments[0]];
  for (let i = 0; i < fns.length; i++) {
    computed.push(fns[i](props));
    computed.push(segments[i + 1]);
  }
  return computed.join("");
};

const css = (...args) => {
  const subrules = [];
  const generateClass = (props) => {
    const styleDeclaration = compileCSS(...args)(props);

    if (!cache.has(styleDeclaration)) {
      const className = "s-" + uuidv4();
      if (!styleSheet) {
        document.head.append(document.createElement("style"));
        styleSheet = document.styleSheets[document.styleSheets.length - 1];
      }
      styleSheet.insertRule(`.${className} { ${styleDeclaration} }`);
      cache.set(styleDeclaration, className);
    }

    const className = cache.get(styleDeclaration);

    for (let rule of subrules) {
      rule = "." + className + rule(props);
      // console.log(rule);
      if (!subruleCache.has(rule)) {
        styleSheet.insertRule(rule);
        subruleCache.add(rule);
      }
    }

    return className;
  };

  generateClass.and = (...args) => {
    subrules.push(compileCSS(...args));
    return generateClass;
  };

  return generateClass;
};

export default css;

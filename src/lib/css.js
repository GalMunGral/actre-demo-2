import uid from "uid";
import htmlTags from "html-tags";

var classCache = new Map();
var ruleCache = new Set();
document.head.append(document.createElement("style"));
var styleSheet = document.styleSheets[document.styleSheets.length - 1];

const compileCSS = (segments, ...fns) => (props) => {
  const computed = [segments[0]];
  for (let i = 0; i < fns.length; i++) {
    computed.push(fns[i](props));
    computed.push(segments[i + 1]);
  }
  return computed.join("");
};

const styled = (component) => (...args) => {
  const declarations = compileCSS(...args);
  const rules = [];

  const StyleWrapper = () => (props, children) => {
    const computedDeclarations = declarations(props);

    let className;
    if (!classCache.has(computedDeclarations)) {
      className = "s-" + uid();
      styleSheet.insertRule("." + className + "{" + computedDeclarations + "}");
      classCache.set(computedDeclarations, className);
    } else {
      className = classCache.get(computedDeclarations);
    }

    rules.forEach((rule) => {
      const computedRule = "." + className + rule(props);
      if (!ruleCache.has(computedRule)) {
        styleSheet.insertRule(computedRule);
        ruleCache.add(computedRule);
      }
    });

    return [
      [
        component,
        {
          ...props,
          className: className + (props.className ? " " + props.className : ""),
        },
        children,
      ],
    ];
  };

  StyleWrapper.and = function attachRules(...args) {
    rules.push(compileCSS(...args));
    return this;
  };

  return StyleWrapper;
};

htmlTags.forEach((tag) => (styled[tag] = styled(tag)));

export default styled;

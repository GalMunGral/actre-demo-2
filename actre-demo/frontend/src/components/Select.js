export const Label = (_, context) => (_, children) =>
  // use transform
  label((className = "label"), children);

export const Option = () => ({ forEach: options, keyFn }, reprFn) =>
  // use transform
  options.map((o) => option((key = keyFn(o)), (value = keyFn(o)), reprFn(o)));

export const Select = (_, context) => {
  return ({ value, onchange, disabled, required }, children) => {
    const childMap = new Map(children.map((child) => [child[0], child]));
    const labelEl = childMap.get(Label);
    const optionEl = childMap.get(Option);
    const { forEach: options, keyFn } = optionEl[1];
    const optionMap = new Map(options.map((o) => [keyFn(o), o]));

    return (
      // use transform
      div((className = "field"), (style = { ...context.sharedStyles }), [
        labelEl,
        div((className = "select"), (style = { ...context.sharedStyles }), [
          select(
            (value = value ? keyFn(value) : ""),
            (disabled = disabled),
            (required = required),
            (onchange = (e) => {
              const selectedKey = e.target.value;
              const selected = optionMap.get(selectedKey);
              onchange(selected);
            }),
            [option("Please select"), optionEl]
          ),
        ]),
      ])
    );
  };
};

export default Select;

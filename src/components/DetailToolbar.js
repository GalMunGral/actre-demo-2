import IconButton from "./IconButton";

const DetailButtons = (_, context) => () => {
  const { dispatch, Type: T } = context.store;
  const { getFolder, getMailId, navigate } = context.route;
  const folder = getFolder();
  const mailId = getMailId();

  const goBack = () => window.history.back();

  const deleteMail = () => {
    goBack();
    dispatch((d) => {
      setTimeout(
        () =>
          d({
            type: T.DELETE,
            payload: { id: mailId, folder },
          }),
        200
      );
    });
  };

  return (
    // use transform
    [
      IconButton((onclick = goBack), (type = "arrow-left")),
      folder === "trash"
        ? null
        : IconButton((onclick = deleteMail), (type = "trash")),
    ]
  );
};

export default DetailButtons;

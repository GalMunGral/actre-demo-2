const Notification = (_, context) => {
  return () => {
    const close = () => (context.showMessage = false);
    const message = context.messageQueue[0];

    return (
      // use transform
      div(
        (className = `notification ${context.showMessage ? "" : "hidden"}`),
        (style = {
          position: "fixed",
          bottom: "10px",
          right: "10px",
        }),
        [button((className = "delete"), (onclick = close)), p(message)]
      )
    );
  };
};

export default Notification;

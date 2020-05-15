const folder = Symbol("folder");
const tab = Symbol("tab");
const mailId = Symbol("mailId");

const useRoute = (state) => {
  state[folder] = state[folder] || "inbox";
  state[tab] = state[tab] || "primary";
  state[mailId] = state[mailId] || null;

  return {
    getFolder: () => state[folder],
    setFolder: (v) => (state[folder] = v),
    getTab: () => state[tab],
    setTab: (v) => (state[tab] = v),
    getMailId: () => state[mailId],
    setMailId: (v) => (state[mailId] = v),
  };
};

export default useRoute;

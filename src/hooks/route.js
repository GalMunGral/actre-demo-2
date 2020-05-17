const folder = Symbol("folder");
const tab = Symbol("tab");
const id = Symbol("mailId");

const useRoute = (state) => {
  if (document.location.pathname === "/") {
    history.pushState(null, "", "/inbox");
  }
  updateStateWithPath(document.location.pathname);
  document.title = `Mail - ${state[folder]}`;

  window.onpopstate = () => {
    const path = document.location.pathname;
    updateStateWithPath(path);
  };

  function updateStateWithPath(path) {
    const regex = /^\/(?<folder>[\w-]+)(\/(?<id>[\w-]+))?/;
    const result = path.match(regex);
    state[folder] = result.groups.folder;
    state[tab] = state[tab] || "primary";
    state[id] = result.groups.id;
  }

  function updateHistoryWithState(replace = false) {
    const folder = getFolder();
    const mailId = getMailId();
    const path = mailId ? `/${folder}/${mailId}` : `/${folder}`;
    if (replace) {
      window.history.replaceState(null, "test", path);
    } else {
      window.history.pushState(null, "test", path);
    }
    document.title = `Mail - ${folder}`;
  }

  const withHistory = (fn, replace = false) => (...args) => {
    const ret = fn(...args);
    updateHistoryWithState(replace);
    return ret;
  };

  const getFolder = () => state[folder];
  const getTab = () => state[tab];
  const getMailId = () => state[id];
  const setFolder = withHistory((v) => (state[folder] = v));
  const setTab = withHistory((v) => (state[tab] = v));
  const setMailId = withHistory((v) => (state[id] = v));

  const navigate = withHistory(updateStateWithPath);
  const redirect = withHistory(updateStateWithPath, true);

  return {
    getFolder,
    setFolder,
    getTab,
    setTab,
    getMailId,
    setMailId,
    navigate,
    redirect,
  };
};

export default useRoute;

import {
  Container,
  Group,
  MenuButton,
  MenuIcon,
  AppLogo,
  SearchBar,
  SearchIcon,
  SearchInput,
} from "./AppBarComponents";

const AppBar = () => ({ toggle }) =>
  // use transform
  Container([
    Group([
      MenuButton((onclick = toggle), [MenuIcon((className = "fas fa-bars"))]),
      AppLogo((src = "/assets/images/logo.png"), (alt = "logo")),
    ]),
    SearchBar([
      SearchIcon((className = "fas fa-search")),
      SearchInput((placeholder = "Search mail")),
    ]),
    Group(),
  ]);

export default AppBar;

import Card from "./Card";
import Container from "./Container";
import Trip from "./Trip";
import Notification from "./Notification";
import axios from "axios";

const App = (state, context) => {
  state.user = { username: "commuter14", userType: "PASSENGER" };
  state.stations = [];
  state.cards = [];

  context.title = "New Trip";
  context.messageQueue = [];
  context.showMessage = false;

  context.postMessage = (message) => {
    context.messageQueue.push(message);
    if (context.messageQueue.length === 1) {
      context.showMessage = true;
      setTimeout(function close() {
        context.messageQueue = context.messageQueue.slice(1);
        if (context.messageQueue.length === 0) {
          context.showMessage = false;
        } else {
          setTimeout(close, 3000);
        }
      }, 3000);
    }
  };

  state.on("mounted", () => {
    Promise.all([fetchCards(), fetchStations()]).then(([cards, stations]) => {
      state.cards = cards;
      state.stations = stations;
    });
  });

  async function fetchStations() {
    try {
      const { data: stations } = await axios.get("/api/stations");
      return stations;
    } catch (error) {
      context.postMessage("Failed to load stations");
      console.error(error);
    }
  }

  async function fetchCards() {
    try {
      const { data: cards } = await axios.get("/api/passenger/my-cards", {
        params: { user: state.user.username },
      });
      return cards;
    } catch (error) {
      context.postMessage("Failed to load cards");
      console.error(error);
    }
  }

  return () =>
    // use transform
    Container([
      Card([
        Trip(
          (stations = state.stations),
          (cards = state.cards),
          (reloadCards = async () => {
            state.cards = await fetchCards();
          })
        ),
      ]),
      Notification(),
    ]);
};

export default App;

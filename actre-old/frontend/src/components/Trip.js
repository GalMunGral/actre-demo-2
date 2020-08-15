import Form from "./Form";
import { Select, Option, Label } from "./Select";
import Text from "./Text";
import Button from "./Button";
import axios from "axios";

const Trip = (state, context) => {
  state.selectedCard = null;
  state.startStation = null;
  state.endStation = null;
  state.startTime = null;

  state.on("beforeupdate", ({ nextProps }) => {
    if (state.selectedCard) {
      state.__selectedCard__ = nextProps.cards.find(
        (c) => c.BreezecardNum === state.selectedCard.BreezecardNum
      );
    }
  });

  return ({ stations, cards, reloadCards }) => {
    function startTrip() {
      if (+state.selectedCard.Value >= +state.startStation.EnterFare) {
        state.startTime = new Date();
        context.postMessage("Trip started");
      } else {
        context.postMessage("Insufficient funds");
      }
    }

    async function endTrip() {
      if (!state.endStation) {
        context.postMessage("Please select a station");
        return;
      }
      try {
        await axios.post("/api/passenger/complete-trip", {
          breezecardNum: state.selectedCard.BreezecardNum,
          currentFare: state.startStation.EnterFare,
          startTime: state.startTime
            .toISOString()
            .replace("T", " ")
            .replace(/\..*$/, ""),
          startID: state.startStation.StopID,
          endID: state.endStation.StopID,
        });
        state.startStation = state.endStation;
        state.startTime = null;
        reloadCards();
        context.postMessage("Trip completed. Thanks for choosing MARTA!");
      } catch (error) {
        context.postMessage("Failed to end trip");
        console.error(error);
      }
    }

    return (
      // use transform
      Form([
        Select(
          (value = state.selectedCard),
          (disabled = !!state.startTime),
          (onchange = (c) => {
            state.selectedCard = c;
          }),
          [
            Label("Select Breeze card"),
            Option(
              (forEach = cards),
              (keyFn = (c) => c.BreezecardNum),
              (c) => c.BreezecardNum
            ),
          ]
        ),

        Text(
          `Balance: $${Number(
            state.selectedCard ? state.selectedCard.Value : 0
          ).toFixed(2)}`
        ),

        Select(
          (value = state.startStation),
          (disabled = !!state.startTime),
          (onchange = (s) => (state.startStation = s)),
          [
            Label(`I'm currently at`),
            Option(
              (forEach = stations),
              (keyFn = (s) => s.StopID),
              (s) => s.Name
            ),
          ]
        ),

        state.selectedCard && state.startStation && !state.startTime
          ? Button((isDanger = true), (onclick = startTrip), "Start Trip")
          : null,

        ...(state.startTime
          ? [
              Select(
                (onchange = (s) => (state.endStation = s)),
                (value = state.endStation),
                (disabled = !state.startTime),
                [
                  Label(`I'm going to`),
                  Option(
                    (forEach = stations),
                    (keyFn = (s) => s.StopID),
                    (s) => s.Name
                  ),
                ]
              ),
              Button(
                (isDanger = true),
                (disabled = !state.startTime),
                (onclick = endTrip),
                "End Trip"
              ),
            ]
          : []),
      ])
    );
  };
};

export default Trip;

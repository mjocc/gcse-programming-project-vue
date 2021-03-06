function getSelectedFlightPlan(state) {
  return state.flightplans[state.selected.flightPlanName];
}

export default {
  enterAirportDetails(state, payload) {
    const flightplan = getSelectedFlightPlan(state);
    flightplan.UKAirportCode = payload.UKAirportCode;
    flightplan.foreignAirportCode = payload.foreignAirportCode;
  },
  enterAircraftDetails(state, payload) {
    const flightplan = getSelectedFlightPlan(state);
    flightplan.aircraftID = parseInt(payload.aircraftID);
    flightplan.numFirstClass = parseInt(payload.numFirstClass);
  },
  enterPricingDetails(state, payload) {
    const flightplan = getSelectedFlightPlan(state);
    flightplan.standardClassPrice = parseFloat(payload.standardClassPrice);
    flightplan.firstClassPrice = parseFloat(payload.firstClassPrice);
  },
};

export default {
  namespaced: true,
  state: {
    flightPlanName: null,
  },
  mutations: {
    updateSelectedFlightPlanName(state, name) {
      state.flightPlanName = name;
    },
    clearSelectedFlightPlanName(state) {
      state.flightPlanName = null;
    },
  },
  actions: {
    updateSelectedFlightPlan({ commit }, name) {
      commit('updateSelectedFlightPlanName', name);
    },
    clearSelectedFlightPlan({ commit }) {
      commit('clearSelectedFlightPlanName');
    },
  },
  getters: {
    flightplan(state, getters, rootState) {
      return rootState.flightplans[state.flightPlanName];
    },
    foreignAirport(state, getters, rootState) {
      let flightplan = getters.flightplan;
      if (flightplan) {
        return rootState.airports[getters.flightplan.foreignAirportCode];
      }
    },
    aircraft(state, getters, rootState) {
      let flightplan = getters.flightplan;
      if (flightplan) {
        return rootState.aircraft[getters.flightplan.aircraftID];
      }
    },
    distance(state, getters) {
      let flightplan = getters.flightplan;
      if (flightplan && getters.airportDetailsExist) {
        return getters.foreignAirport[
          flightplan.UKAirportCode === 'LPL'
            ? 'distanceFromLPL'
            : 'distanceFromBOH'
        ];
      }
    },
    numStandardClass(state, getters) {
      let flightplan = getters.flightplan;
      if (flightplan && getters.aircraftDetailsExist && getters.inRange) {
        return getters.aircraft.maxStandardClass - flightplan.numFirstClass;
      }
    },
    costPerSeat(state, getters) {
      let flightplan = getters.flightplan;
      if (flightplan && getters.complete) {
        return getters.aircraft.runningCost * (getters.distance / 100);
      }
    },
    runningCost(state, getters) {
      let flightplan = getters.flightplan;
      if (flightplan && getters.complete) {
        return (
          getters.costPerSeat *
          (flightplan.numFirstClass + getters.numStandardClass)
        );
      }
    },
    income(state, getters) {
      let flightplan = getters.flightplan;
      if (flightplan && getters.complete) {
        return (
          flightplan.numFirstClass * flightplan.firstClassPrice +
          getters.numStandardClass * flightplan.standardClassPrice
        );
      }
    },
    profit(state, getters) {
      if (getters.income && getters.complete) {
        return getters.income - getters.runningCost;
      }
    },
    airportDetailsExist(state, getters) {
      let flightplan = getters.flightplan;
      return airportDetailsExist(flightplan);
    },
    aircraftDetailsExist(state, getters) {
      let flightplan = getters.flightplan;
      return aircraftDetailsExist(flightplan);
    },
    pricingDetailsExist(state, getters) {
      let flightplan = getters.flightplan;
      return pricingDetailsExist(flightplan);
    },
    inRange(state, getters) {
      if (getters.airportDetailsExist && getters.aircraftDetailsExist) {
        return getters.aircraft.range > getters.distance;
      }
    },
    complete(state, getters) {
      return (
        getters.airportDetailsExist &&
        getters.aircraftDetailsExist &&
        getters.pricingDetailsExist &&
        getters.inRange
      );
    },
  },
};

export function airportDetailsExist(flightplan) {
  if (flightplan) {
    return (
      flightplan.UKAirportCode != null && flightplan.foreignAirportCode != null
    );
  }
}

export function aircraftDetailsExist(flightplan) {
  if (flightplan) {
    return flightplan.aircraftID != null && flightplan.numFirstClass != null;
  }
}

export function pricingDetailsExist(flightplan) {
  if (flightplan) {
    return (
      flightplan.standardClassPrice != null &&
      flightplan.firstClassPrice != null
    );
  }
}

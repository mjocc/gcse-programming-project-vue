<template>
  <h1>Aircraft details</h1>
  <data-entry-form @submit.prevent="updateAircraftData">
    <div class="form-group my-3">
      <label class="mb-1" for="aircraft-type-field">Aircraft type</label>
      <select
        v-model="aircraftType"
        class="form-select"
        id="aircraft-type-field"
        autofocus
        required
      >
        <option value="default" disabled selected hidden>
          Select an option
        </option>
        <option
          v-for="aircraft in selectAircrafts"
          :key="aircraft.value"
          :value="aircraft.value"
        >
          {{ aircraft.text }}
        </option>
      </select>
    </div>
    <div class="form-group my-3">
      <label class="mb-1" for="num-first-class-field"
        >Number of first class seats</label
      >
      <input
        v-model="numFirstClass"
        id="num-first-class-field"
        class="form-control"
        type="number"
        :disabled="disableFirstClassField"
        :min="minFirstClass"
        :max="maxFirstClass"
        required
      />
    </div>
  </data-entry-form>
</template>

<script>
import toastr from 'toastr';
import { mapState, mapGetters, mapActions } from 'vuex';

import DataEntryForm from '../components/DataEntryForm.vue';

export default {
  components: {
    DataEntryForm,
  },
  data() {
    return {
      aircraftType: null,
      numFirstClass: null,
    };
  },
  methods: {
    ...mapActions(['enterAircraftDetails']),
    updateAircraftData() {
      this.enterAircraftDetails({
        aircraftID: this.aircraftType,
        numFirstClass: this.numFirstClass,
      });
      this.$router.push({ name: 'HomePage' });
      toastr.success('Aircraft data submitted');
      if (this.airportDetailsExist && !this.inRange) {
        toastr.warning(
          'The distance between the selected airports is greater than the range of the selected aircraft'
        );
      }
    },
  },
  computed: {
    ...mapState(['aircraft']),
    ...mapGetters('selected', ['flightplan', 'airportDetailsExist', 'inRange']),
    selectAircrafts() {
      return Object.values(this.aircraft).map((aircraft) => {
        return {
          value: aircraft.id,
          text: aircraft.type,
        };
      });
    },
    disableFirstClassField() {
      return this.aircraftType === 'default';
    },
    minFirstClass() {
      if (this.aircraftType !== 'default' && this.aircraftType !== null) {
        return this.aircraft[this.aircraftType].minFirstClass;
      } else {
        return 0;
      }
    },
    maxFirstClass() {
      if (this.aircraftType !== 'default' && this.aircraftType !== null) {
        return this.aircraft[this.aircraftType].maxStandardClass / 2;
      } else {
        return 0;
      }
    },
  },
  mounted() {
    if (this.flightplan.aircraftID !== null) {
      this.aircraftType = this.flightplan.aircraftID;
    } else {
      this.aircraftType = 'default';
    }
    if (this.flightplan.numFirstClass !== null) {
      this.numFirstClass = this.flightplan.numFirstClass;
    }
  },
};
</script>

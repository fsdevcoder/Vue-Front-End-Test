<template>
  <div class="order-form-component">
      <validation-observer v-slot="{ invalid }">
        <b-form @submit="onSubmit" v-if="show">
          <div class="mandatory-fields">
            <validation-provider name="source" rules="required|url" v-slot="{ valid, errors }">
              <b-form-group
                id="input-group-source"
                label="source"
                label-for="input-source"
              >
                <b-form-input
                  id="input-source"
                  v-model="form.source"
                  type="text"
                  :state="errors[0] ? false : (valid ? true : null)"
                  :placeholder="sourcePlaceholder"
                ></b-form-input>
                <!-- <b-form-invalid-feedback class="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback> -->
              </b-form-group>
            </validation-provider>

            <validation-provider name="instructions" rules="required|max:30" v-slot="{ valid, errors }">
              <b-form-group id="input-group-instructions" label="instructions" label-for="input-instructions">
                <b-form-textarea
                  id="input-instructions"
                  v-model="form.instructions"
                  :state="errors[0] ? false : (valid ? true : null)"
                  :placeholder="instructionsPlaceholder"
                  rows="2"
                  no-resize
                ></b-form-textarea>
              </b-form-group>
            </validation-provider>

            <b-row class="writers-and-budget">
              <b-col>
                <validation-provider name="number of writers" rules="required" v-slot="{ valid, errors }">
                  <b-form-group
                    id="input-group-writers"
                    label="number of writers"
                    label-for="input-writers"
                  >
                    <b-form-select
                      id="input-writers"
                      v-model="form.writers"
                      :state="errors[0] ? false : (valid ? true : null)"
                      :placeholder="numberWritersPlaceholder"
                      :options="writersOptions"
                    ></b-form-select>
                  </b-form-group>
                </validation-provider>
              </b-col>
              <b-col>
                <validation-provider name="budget" rules="required|between:5,500" v-slot="{ valid, errors }">
                  <b-form-group
                    id="input-group-budget"
                    label="budget (USD)"
                    label-for="input-budget"
                  >
                    <b-input-group prepend="$">
                      <b-form-input
                        id="input-budget"
                        v-model="form.budget"
                        type="text"
                        :state="errors[0] ? false : (valid ? true : null)"
                        :placeholder="budgetPlaceholder"
                      ></b-form-input>
                    </b-input-group>
                  </b-form-group>
                </validation-provider>
              </b-col>
            </b-row>
          </div>
          <div class="optional-fields">
            <div class="select-option">
              Please select options (optional)
            </div>
            <b-form-checkbox-group class="options" v-model="form.options" name="options">
              <b-container fluid>
                <b-row class="option" v-for="option in orderOptions" :key="option.id">
                  <b-col>{{ option.name }}</b-col>
                  <b-col class="additional">(add {{ optionLabel(option) }})</b-col>
                  <b-col cols="1">
                    <b-form-checkbox
                      :value="option"
                    />
                  </b-col>
                </b-row>
              </b-container>
            </b-form-checkbox-group>
          </div>
          <b-button :disabled="invalid" class="submit" type="submit" variant="primary">
                <div class="shopping-cart">
                  <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                </div>
                  Submit
                <div class="total-budget">
                  $ {{ totalBudget }}
                </div>
          </b-button>
        </b-form>
      </validation-observer>
    </div>
</template>

<script>
  import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
  import { required, max, between } from 'vee-validate/dist/rules';
  const URL_REGEX=/^(http|https):\/\//;

  extend('required', {...required, message: "'{_field_}' is required"});
  extend('max', {...max, message: "There is a maximum of {length} characters"});
  extend('between', {...between, message: "'{_field_}' must be a number between {min} and {max}"});
  extend('url', {
    validate: (value) => (
      URL_REGEX.test(value)
    ),
    message: "'{_field_}'' must be valid URL"
  });

  const getPlaceholder = function(orderDetails, name) {
    return orderDetails.find(element => element.name == name).placeholder;
  }

  export default {
    name: 'order-form-component',
    components: {
      ValidationProvider,
      ValidationObserver
    },
    props: {
      "order-details": Array,
      "order-options": Array,
      "reset-form": Boolean
    },
    data() {
      const writerOptions = Array(15).fill(null).map((value, index) => ({ value: index + 1, text: index + 1 }));
      writerOptions.unshift({ value: null, text: 'select' });

      return {
        form: {
          source: '',
          instructions: '',
          writers: null,
          options: [],
          budget: null
        },
        show: true,
        writersOptions: writerOptions
      }
    },
    watch: {
      resetForm(newValue) {
        if (newValue) {
          // Reset our form values
          this.form.source = '';
          this.form.instructions = '';
          this.form.writers = null;
          this.form.options = [];
          this.form.budget = null;

          // Trick to reset/clear native browser form validation state
          this.show = false;
          this.$nextTick(() => {
            this.show = true,
            this.$emit('form-reseted');
          })
        }
      }
    },
    computed: {
      sourcePlaceholder() {
        return getPlaceholder(this.orderDetails, "source");
      },
      instructionsPlaceholder() {
        return getPlaceholder(this.orderDetails, "instructions");
      },
      numberWritersPlaceholder() {
        return getPlaceholder(this.orderDetails, "number_writers");
      },
      budgetPlaceholder() {
        return getPlaceholder(this.orderDetails, "budget");
      },
      totalBudget() {
        if (this.form.budget === null || this.form.writers == null) {
          return "-";
        } else {


          let totalIncrease = 0;
          let totalPrice = 0;
          this.form.options.forEach( (option) => {
            totalIncrease = totalIncrease +  (option.increase ? parseInt(option.increase) : 0);
            totalPrice = totalPrice +  (option.price ? parseInt(option.price) : 0);
          }, 0);
          const totalBudget = this.form.budget * parseInt(this.form.writers) * ( 1 + totalIncrease/100 )
            + totalPrice;
          return totalBudget.toFixed(2);
        }
      }
    },
    methods: {
      optionLabel(option) {
        if (option.increase) {
          return option.increase + "%";
        } else if (option.price) {
          return "$" + option.price;
        }
      },
      onSubmit(evt) {
        evt.preventDefault();
        this.$emit("submit-budget", this.totalBudget);
      }
    }
  }
</script>

<style>
  .order-form-component {
    font-size: 0.8em;
    padding-top: 0.5rem;
    font-weight: 300;
  }
  .order-form-component .mandatory-fields {
    padding-left: 0.5rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
  }

  .order-form-component .form-group {
    margin-bottom: 0.4rem;
  }
  .order-form-component label {
    margin-bottom: 0.2rem;
  }
  .order-form-component .form-control,
  .order-form-component .custom-select,
  .order-form-component .input-group-text {
    font-size: 0.8em;
    border: none;
    background-color: #f8f8fa;
    padding: 0.1rem 0.5rem;
    height: calc(1.5em + 0.5rem + 2px);
  }
  .order-form-component textarea.form-control {
    height: auto;
    padding: 0.4rem 0.5rem;
  }
  .order-form-component .form-control::placeholder {
    color: #b9b8bd;
  }

  /* Hide validation 'tick' */
  .order-form-component .was-validated .form-control:valid,
  .order-form-component .form-control.is-valid,
  .order-form-component .was-validated .custom-select:valid,
  .order-form-component .custom-select.is-valid {
    background-image: none;
  }
  .order-form-component .was-validated .custom-select:valid,
  .order-form-component .custom-select.is-valid {
    background-color: #f8f8fa;
  }
  /*--*/

  .row.writers-and-budget {
    margin-right: 0;
    margin-left: -17px;
    margin-top: 0.7rem;
  }
  .row.writers-and-budget .col {
    padding-right: 0px;
    padding-left: 17px;
  }

  .select-option {
    font-size: 0.6em;
    font-weight: 500;
    padding: 0.9em;
    background-color: #e5e5e5;
  }

  .options .container-fluid {
    font-size: 0.9em;
    padding: 0;
  }
  .options .option {
    padding-top: 0.8rem;
    margin: 0;
    padding-left: 0.5rem;
    padding-right: 1.5rem;
    border-top: 1px solid #fcfcfc;
    border-bottom: 1px solid #f8f8f8;
  }
  .options .option:first-child {
    border-top: none;
  }
  .options .option:last-child {
    border-bottom: none;
  }
  .options .option .col,
  .options .option .col-1 {
    padding: 0;
  }

  .options .option .custom-checkbox .custom-control-label::before {
    border-radius:50%;
    top: 0.15rem;
    left: -1.2rem;
    width: 0.7rem;
    height: 0.7rem;
    border: #555555 solid 1.5px;
  }

  .options .option .custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
    background-image: none;
    border: none;
    background-color: green;
  }

  .options .option .custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
    background-image: none;
    /* background-color: green; */
  }

  .options .option .additional {
    color: #b1b1b3;
  }

  .btn.submit {
    width: 90%;
    margin: auto;
    margin-top: 1.2rem;
    display: block;
    border-radius: 8px;
    background-color: #2b62fe;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.1em;
  }

  .btn.submit .shopping-cart {
    float: left;
  }

  .btn.submit .total-budget {
    float: right;
    font-size: 0.8em;
    padding-top: 2px;
  }


</style>
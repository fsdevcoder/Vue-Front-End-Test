
<template>
  <div class="order-component" :class="innerVisible? '' : 'hidden'">
    <div class="order-modal">
      <div class="order-wrapper">
        <header>
          <order-images-component :images="order.images"/>
          <button class="bo-back" @click="onGoBack">
            <i class="fas fa-arrow-left arrow" aria-hidden="true"></i>
          </button>
          <order-description-component :order-description="order.order_description"/>
        </header>
        <order-form-component
          :order-details="order.Order_details"
          :order-options="order.options"
          :reset-form="resetForm"
          @form-reseted="onFormReseted"
          @submit-budget="onBudgetSubmitted"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import OrderImagesComponent from './order-images-component.vue';
  import OrderDescriptionComponent from './order-description-component.vue';
  import OrderFormComponent from './order-form-component.vue';

  export default {
    name: 'order-component',
    components: {
      OrderImagesComponent,
      OrderDescriptionComponent,
      OrderFormComponent,
    },
    props: {
      order: Object,
      visible: Boolean,
    },
    watch: {
      visible(newValue) {
        this.innerVisible = newValue;
      }
    },
    data() {
      return {
        innerVisible: this.visible,
        resetForm: false
      }
    },
    methods: {
      onFormReseted() {
        this.resetForm = false;
      },
      onGoBack() {
        this.innerVisible = false;
        this.resetForm = true;
        this.$emit("close");
      },
      onBudgetSubmitted(totalBudget) {
        this.onGoBack();
        this.$emit("submit-budget", totalBudget);
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,500,700,900&display=swap');
  @import "../assets/lib/fontawesome/css/fontawesome.min.css";
  @import "../assets/lib/fontawesome/css/solid.min.css";

  .order-component {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    min-width: 271px;
    min-height: 641px;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
  }
  .order-component.hidden {
    display: none;
  }

  .order-component .order-modal {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
  }

  .order-component .order-modal .order-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    /* bottom: 10px; */
    border-bottom: 1px solid #ececec;
    overflow: auto;
  }

  .order-component header {
    border-bottom: 1px solid #f1f1f1;
    position: relative;
  }

  .arrow {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .order-component header .bo-back {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 34px;
    width: 34px;
    border: none;
    border-radius: 100%;
    background-color: #fdfdfd;
    color: #aeaeae;
  }

  .order-component header .container {
    padding: 9px 7px;
    padding-bottom: 5px;
  }

  .order-component .title {
    font-weight: 900;
    font-size: 0.8em;
    letter-spacing: 0.5px;
  }
  .order-component .home {
    font-size: 0.55em;
    margin-top: 3px;
  }
  .order-component .home a {
    color: #57e8bb;
    background-color: #f6f9fa;
    padding: 2px 3px;
    border-radius: 2px;
  }
  
  .order-component .description {
    font-size: 0.59em;
    margin-top: 10px;
    color: #2b5da9;
  }

  @media (min-height: 700px) {
    .order-component {
      font-size: 18px;
      background-color: rgba(0,0,0,0.5);
      /* box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12); */
    }
    .order-component .order-modal {
      max-width: 500px;
      max-height: 680px;
      width:90%;
      
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      /* border: 3px solid #2c68c1; */
      border-radius: 13px;
      box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
    }
  }
</style>

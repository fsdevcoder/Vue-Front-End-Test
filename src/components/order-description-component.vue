<template>
  <div class="container">
    <div class="head">
      <div class="title">{{ orderDescription.name }}</div>
      <div class="home">
        <a :href="absolutePublication" target="_blank">
          {{ orderDescription.publication }}
        </a>
      </div>
      <div class="description">{{ orderDescription.description }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "order-description-component",
    props: {
      "order-description": Object
    },
    computed: {
      // TODO test this
      absolutePublication() {
        if (!this.orderDescription.publication.startsWith("http")) {
          return "https://" + this.orderDescription.publication;
        } else {
          return this.orderDescription.publication;
        }
      }
    }
  }
</script>

<style></style>
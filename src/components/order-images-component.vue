<template>
  <div class="img-wrapper">
    <img :src="images.thumbnail"/>
  </div>
</template>

<script>
  export default {
    name: 'order-images-component',
    props: {
      images: Object
    }
  }
</script>

<style>
  .img-wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 144px;
  }

  .img-wrapper img {
    display: block;
    position: absolute;
    height: auto;
    width: 100%;
    top: -20%;
    left: 50%;
    margin-left:0px;
    transform: translateX(-50%);
  }

  @media (min-height: 700px) {
    .img-wrapper {
      position: relative;
      overflow: hidden;
      max-width: 100%;
      border-radius: 13px 13px 0px 0px;
    }
  }

  

</style>
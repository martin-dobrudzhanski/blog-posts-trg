<template lang="html">
  <div
    data-component="generic-loader-overlay"
    :data-fullheight="fullScreen"
  >
    <div
      data-element="loader-container"
      :data-fullheight="fullScreen"
    >
      <div
        data-element="loader-child"
        data-order="first"
        :data-black="isBlack"
      />
      <div
        data-element="loader-child"
        data-order="second"
        :data-black="isBlack"
      />
      <div
        data-element="loader-child"
        data-order="third"
        :data-black="isBlack"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isBlack: {
        type: Boolean,
        default: true
      },
      fullScreen: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>

  [data-component='generic-loader-overlay'] {
    height: 100%;
    display: flex;
    justify-content: center;
    padding-top: 2rem;
    &[data-fullheight] {
      height: 100vh;
      position: relative;
      display:flex;
      justify-content:center;
      align-items:center;
    }
    [data-element='loader-container'] {
      margin: 0 auto;
      width:50px;
      text-align:center;
      display:flex;
      justify-content:space-between;
      [data-element='loader-child'] {
        width:10px;
        height:10px;
        background-color:#fff;
        border-radius:100%;
        display:inline-block;
        -webkit-animation:bouncedelay 1.4s infinite ease-in-out both;
        animation:bouncedelay 1.4s infinite ease-in-out both;
        &[data-black] {
          background-color:black;
        }
        &[data-order='first'] {
          -webkit-animation-delay:-0.32s;
          animation-delay:-0.32s;
        }
        &[data-order='second'] {
          -webkit-animation-delay:-0.16s;
          animation-delay:-0.16s;
        }
      }
    }
  }

  @-webkit-keyframes bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0)
    }
    40% {
      -webkit-transform: scale(1.0)
    }
  }

  @keyframes bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }

</style>

<template>
  <video
    class="image-card-video"
    v-if="isVideoAsset"
    autoplay
    loop
    muted
    playsinline
  >
    <source :src="assetUrl" type="video/mp4" />
  </video>
  <img
    v-else
    :src="`${assetUrl}?w=960`"
    :alt="assetAlt"
    class="image-card-image"
  />
</template>

<script>
export default {
  props: {
    isVideoAsset: {
      type: Boolean,
      required: true
    },
    assetUrl: {
      type: String,
      required: true
    },
    assetAlt: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.image-card-image,
.image-card-video {
  display: block;
}
</style>

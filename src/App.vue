<template>
  <div>
    <main>
        <topbar></topbar>
        <router-view></router-view>
    </main>
  </div>
</template>

<script>
// Vue components
import topbar from './components/Header.vue'

export default {
  name: 'app',
  components: {
    'topbar': topbar
  },
  data () {
    return {
    }
  }
}
</script
<style>
  body {
    background-color:#DDD;
  }

  .qr {
    background-color: #000;
  }
</style>


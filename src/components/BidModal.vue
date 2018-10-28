<template>
<b-modal ref="myModalRef" hide-footer title="Using Component Methods">
      <div class="d-block text-center">
        <h3>Hello From My Modal!</h3>
      </div>
      <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn>
    </b-modal>
</template>

<script>

  export default {
    name: 'BidModal',
    methods: {
    },
    components: {
    }
  }
</script>

<style scoped>
.nav-link {
  color: white !important;
}

</style>

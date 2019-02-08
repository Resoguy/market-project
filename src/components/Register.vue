<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8">

          <register-form/>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RegisterForm from './RegisterComponents/RegisterForm.vue'

export default {
  name: 'Register',
  components: {
    RegisterForm,
    // Components...
  },
  data () {
    return {
      // Local data...
    }
  },
  methods: {
    // Methods...
  }
}
</script>

<style lang="css">
</style>

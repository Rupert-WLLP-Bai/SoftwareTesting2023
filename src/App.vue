<template>
  <HeaderComponent/>
  <HomePage />
</template>

<script>
import HomePage from './components/HomePage.vue'
import HeaderComponent from './components/HeaderComponent.vue'

export default {
  name: 'App',
  components: {
    HomePage: HomePage,
    HeaderComponent: HeaderComponent,
  }
}
</script>

<style>

</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body,html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}
* {
  box-sizing: border-box;
}
#app {
  font-family: "Roboto", sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  /*background:#191919;*/
}
</style>

<!-- For details about routing, please see https://framework7.io/vue/navigation-router.html -->

<template>
  <f7-page>
    <f7-navbar title="Flexible Routing" back-link="Back" sliding></f7-navbar>
    <f7-block inner inset>
      <p style="text-align: center">Use multiple ways to fit the routing perfectly to your application needs.</p>
      <p style="text-align: center">By default, routes for all pages will be created automatically!</p>
    </f7-block>
    <f7-block inner>
      <ul>
        <li><b>Route:</b> {{$route.route.path}}</li>
        <li><b>Url:</b> {{$route.url}}</li>
        <li><b>Path:</b> {{$route.path}}</li>
        <li><b>Params:</b>
          <ul>
            <li v-for="(value, key) in $route.params"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Query:</b>
          <ul>
            <li v-for="(value, key) in $route.query"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Hash:</b> {{$route.hash}}</li>
      </ul>
    </f7-block>
    <f7-block inner>
      <f7-link @click="$router.back()">Go back via Router API</f7-link>
    </f7-block>

  </f7-page>
</template>

<script>
  module.exports = {}
</script>

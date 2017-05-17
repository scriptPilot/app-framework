<!-- For details about routing, please see https://framework7.io/vue/navigation-router.html -->

<template>
  <f7-page>
    <f7-navbar title="Flexible Routing" back-link="Back" sliding></f7-navbar>
    <f7-block>
      Use multiple ways to fit the routing perfectly to your application needs.<br />
      <br />
      By default, routes for all nested components are created automatically.<br />
      <br />
      In addition, you can easily require dynamic and login-protected routes.
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
  </f7-page>
</template>

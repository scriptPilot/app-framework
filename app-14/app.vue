<!--

  Take this template as base for your own application.

  For real modularization, all pages are extracted to their own page component in /pages folder.
  You can define the initial page for each view with the URL attribute.
  Initial pages should not require a login (to configure in package.json file).

  Read more about application layouts: https://framework7.io/vue/app-layout.html

-->

<template>

  <!-- Will replace app container -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Left panel -->
    <f7-panel left reveal layout="dark">
      <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true" url="panel-left"></f7-view>
    </f7-panel>

    <!-- Right panel -->
    <f7-panel right cover layout="dark">
      <f7-view id="right-panel-view" navbar-through :dynamic-navbar="true" url="panel-right"></f7-view>
    </f7-panel>

    <!-- Main view -->
    <f7-views navbar-through>
      <f7-view main url="/home/" :dynamic-navbar="true"></f7-view>
    </f7-views>

    <!-- f7vue-modals -->
    <f7-popover id="demo-popover" style="width:200px">
      <f7-block>
        <p>Hello, i'm Popover</p>
      </f7-block>
    </f7-popover>
    <f7-picker-modal id="demo-picker" :opened="pickerOpened">
      <f7-toolbar>
        <f7-nav-left></f7-nav-left>
        <f7-nav-right>
          <!-- Using state: -->
          <f7-link @click="pickerOpened=false">Done</f7-link>
          <!--
          Or using F7 API:
          <f7-link close-picker>Done</f7-link>
          -->
        </f7-nav-right>
      </f7-toolbar>
      <f7-block>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis iste qui architecto recusandae veniam delectus vero libero illo aliquid, fuga ratione vel facilis iure est fugiat sunt nihil, consectetur veritatis.</p>
      </f7-block>
    </f7-picker-modal>
    <f7-popup id="demo-popup" :opened="popupOpened" @popup:closed="popupOpened=false">
      <f7-view>
        <f7-pages>
          <f7-page navbar-fixed>
            <f7-navbar title="Demo Popup">
              <f7-nav-right>
                <!-- Using state: -->
                <f7-link @click="popupOpened=false">Close</f7-link>
                <!--
                Or using F7 API:
                <f7-link close-popup>Close</f7-link>
                -->
              </f7-nav-right>
            </f7-navbar>
            <f7-block>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis iste qui architecto recusandae veniam delectus vero libero illo aliquid, fuga ratione vel facilis iure est fugiat sunt nihil, consectetur veritatis.</p>
              <p>Itaque impedit, nam, sed reprehenderit quaerat commodi veritatis ducimus eos nisi, at aliquam dolorum alias optio natus. Sit voluptate aperiam, cupiditate repellat quod fugiat non doloribus eveniet dolorem fugit nihil.</p>
              <p>Error cumque sunt dolorem aut, similique accusantium delectus. Minima, natus. Doloremque ratione veniam cupiditate modi aspernatur debitis possimus iure id delectus! Totam eveniet, impedit minus deserunt aliquid facere laboriosam dignissimos.</p>
              <p>Aliquid autem saepe sit cumque odit nihil eius consectetur impedit accusantium sunt, repudiandae quaerat cum! Esse autem ipsum aliquam, distinctio laborum excepturi facilis fuga vitae atque iusto eligendi, explicabo corporis.</p>
              <p>Necessitatibus minima quidem fugit corporis reprehenderit saepe facilis perspiciatis sit, consectetur nulla officia, pariatur accusantium quas voluptas. Illum placeat eligendi dolor nihil libero culpa, ex quas voluptas deleniti, unde id.</p>
            </f7-block>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-popup>
    <f7-login-screen id="demo-login-screen" :opened="loginScreenOpened">
      <f7-view>
        <f7-pages>
          <f7-page login-screen>
            <f7-login-screen-title>My App</f7-login-screen-title>
            <f7-list form>
              <f7-list-item>
                <f7-label>Username</f7-label>
                <f7-input name="username" placeholder="Username"></f7-input>
              </f7-list-item>
              <f7-list-item>
                <f7-label>Password</f7-label>
                <f7-input name="password" type="password" placeholder="Password"></f7-input>
              </f7-list-item>
            </f7-list>
            <f7-list>
              <!-- Using state: -->
              <f7-list-button title="Sign In" @click="loginScreenOpened=false"></f7-list-button>
              <!--
              Or using F7 API:
              <f7-list-button title="Sign In" close-login-screen></f7-list-button>
              -->
              <f7-list-label>
                <p>Click Sign In to close Login Screen</p>
              </f7-list-label>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-login-screen>
    <f7-actions :opened="actionsOpened" @actions:closed="actionsOpened=false">
      <f7-actions-group>
        <f7-actions-label>Hello</f7-actions-label>
        <f7-actions-button>Button 1</f7-actions-button>
        <f7-actions-button>Button 2</f7-actions-button>
      </f7-actions-group>
      <f7-actions-group>
        <f7-actions-button color="red" bold>Cancel</f7-actions-button>
      </f7-actions-group>
    </f7-actions>
    <!-- /f7vue-modals -->

  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        user: {
          name: 'Vladimir',
          lastName: 'Kharlampidi',
          age: 30
        },
        popupOpened: false,
        loginScreenOpened: false,
        pickerOpened: false,
        actionsOpened: false
      }
    }
  }
</script>

<!-- Style - for whole app, as there is no scope property -->
<style>

  /* Icon sizes */
  .item-media .fa,
  .swipeout-actions-left .fa,
  .swipeout-actions-right .fa  {
    font-size: 20px;
  }

</style>

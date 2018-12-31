<template>

  <!-- Will replace app container -->
  <div id="app">
    <login-popup />

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

  </div>

</template>

<script>
  require('./kitchen-sink-ios.css')
  require('./kitchen-sink-material.css')
  let iosKitchenSinkCode = require('./kitchen-sink-ios.js')
  let materialKitchenSinkCode = require('./kitchen-sink-material.js')
  let iosKitchenSinkHtml = require('./kitchen-sink-ios-html.js')
  let materialKitchenSinkHtml = require('./kitchen-sink-material-html.js')
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
    },
    created () {
      // Update status bar text color after theme color change
      this.$watch(() => {
        return this.$root.color
      }, (newColor, oldColor) => {
        this.$root.statusbarTextColor = newColor === 'white' ? 'black' : 'white'
        this.$root.statusbarBackgroundColor = newColor === 'white' && window.cordova === undefined ? '000000' : this.$root.colors[this.$root.theme][newColor]
      })
    },
    methods: {
      onF7Init: function () {
        if (this.$root.theme === 'ios') {
          iosKitchenSinkCode(this.$root)
        } else {
          materialKitchenSinkCode(this.$root)
        }
        this.$$(document).on('page:beforeinit', e => {
          if (e.detail.page.url && e.detail.page.url.indexOf('f7ios/index') > -1) {
            this.$$('#app').append(iosKitchenSinkHtml)
          } else if (e.detail.page.url && e.detail.page.url.indexOf('f7material/index') > -1) {
            this.$$('#app').append(materialKitchenSinkHtml)
          }
        })
      }
    }
  }
</script>

<style>
  .popover {
    max-width: 95%;
  }
</style>

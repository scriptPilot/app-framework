<!-- Initial page of the main view, please see ../app.vue for more information about the application layout -->

<template>
  <f7-page>

    <!-- Navbar -->
    <f7-navbar sliding :title="$root.config.title">
      <f7-nav-right v-if="$root.user"><f7-link icon-material="person" open-popup="#app-framework-login-popup" /></f7-nav-right>
    </f7-navbar>

    <!-- Installation notice -->
    <f7-block inner inset style="text-align: center" v-if="$root.appMode==='mobile'">
      <p><b>For native App feeling, please pin this page to your homescreen and open it from there!</b></p>
    </f7-block>

    <!-- Configuration -->
    <f7-block-title>Style Configuration</f7-block-title>
    <f7-list>
      <f7-list-item smart-select smart-select-back-on-select
        title="Select Theme"
        :media="'<img src=\'' + images['theme_' + $root.theme] + '\' width=\'29\' />'">
        <select v-model="$root.theme">
          <option value="ios" :data-option-image="images.theme_ios">iOS</option>
          <option value="material" :data-option-image="images.theme_material">Material</option>
        </select>
      </f7-list-item>
      <f7-list-item title="Select Color" :link="'/f7' + $root.theme + '/color-themes/'" media="<i class='f7-icons'>keyboard_fill</i>" />
      <f7-list-item title="Show Statusbar" media="<i class='f7-icons'>delete</i>" v-if="$root.appMode==='native'">
        <div slot="after">
          <label class="label-switch">
            <input type='checkbox' :checked="$root.statusbarVisibility" @change="$root.statusbarVisibility=$event.target.checked">
            <div class='checkbox'></div>
          </label>
        </div>
      </f7-list-item>
      <f7-list-item title="Change text color" @click="$root.statusbarTextColor=$root.statusbarTextColor==='white'?'black':'white'" v-if="$root.$f7.device.ios && $root.appMode === 'native' && $root.statusbarVisibility" link="#" media="<i class='f7-icons'>delete</i>" />
    </f7-list>

    <!-- Demonstration -->
    <f7-block-title>Feature Demonstration</f7-block-title>
    <f7-list>
      <f7-list-item link="/f7ios/index/" title="iOS Components" media="<i class='icon icon-f7' />" v-if="$root.theme === 'ios'" />
      <f7-list-item link="/f7material/index/" title="Material Components" media="<i class='icon icon-f7' />" v-if="$root.theme === 'material'" />
      <f7-list-item link="/firebase-public/" title="Realtime Database" :media="'<img src=\'' + images.firebase + '\' width=\'29\' />'" />
      <f7-list-item link="/firebase-private/" title="Authentication & Storage" :media="'<img src=\'' + images.firebase + '\' width=\'29\' />'" />
      <f7-list-item link="/state-restoration/" title="App State Restoration" media="<i class='f7-icons'>refresh</i>" />
      <f7-list-item link="/flexible-routing/blog/123/post/456/?display=summary#gotoend" title="Flexible Routing" media="<i class='f7-icons'>forward</i>" />
      <f7-list-item link="/multiple-languages/" title="Multiple languages" :media="'<img src=\'' + (images['flag_' + $root.language] || images['flag_en']) + '\' width=\'29\' />'" />
    </f7-list>

    <!-- Link to GitHub repository -->
    <f7-block style="text-align: center">
      <f7-link href="http://app-framework.com" external><f7-icon material="open_in_browser" size="18" style="padding-bottom: 3px" />&nbsp;&nbsp;Made with App Framework - {{$root.frameworkVersion}}</f7-link>
    </f7-block>

  </f7-page>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        images: {
          flag_en: require('../images/flag-en.png'),
          flag_de: require('../images/flag-de.png'),
          theme_ios: require('../images/theme-ios.png'),
          theme_material: require('../images/theme-material.png'),
          firebase: require('../images/firebase.png')
        }
      }
    },
    methods: {
      updateSmartlist: function (e) {
        setTimeout(function () {
          let text = this.$$(e.target).find('option[value=' + e.target.value + ']').text()
          this.$$(e.target).parent().find('.item-after').html(text)
        }.bind(this), 0)
      }
    }
  }
</script>

<style>
  .f7-icons  {
    width: 29px;
    font-size: 29px;
    height: 29px;
    text-align: center;
    color: gray;
  }
</style>

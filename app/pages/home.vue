<!-- Initial page of the main view, please see ../app.vue for more information about the application layout -->

<template>
  <f7-page>

    <!-- Navbar -->
    <f7-navbar sliding :title="$root.config.title" />

    <!-- Installation notice -->
    <f7-block inner inset style="text-align: center" v-if="$root.appMode==='mobile'">
      <p><b>For native App feeling, please pin this page to your homescreen and open it from there!</b></p>
    </f7-block>

    <!-- Configuration -->
    <f7-block-title>{{text.configuration}}</f7-block-title>
    <f7-list>
      <f7-list-item smart-select smart-select-back-on-select
        :title="text.selectLanguage"
        :media="'<img src=\'' + images['flag_' + $root.language] + '\' width=\'29\' />'">
        <select @change="updateSmartlist" v-model="$root.language">
          <option value="en" :data-option-image="images.flag_en">{{text.english}}</option>
          <option value="de" :data-option-image="images.flag_de">{{text.german}}</option>
        </select>
      </f7-list-item>
      <f7-list-item smart-select smart-select-back-on-select
        :title="text.selectTheme"
        :media="'<img src=\'' + images['theme_' + $root.theme] + '\' width=\'29\' />'">
        <select v-model="$root.theme">
          <option value="ios" :data-option-image="images.theme_ios">iOS</option>
          <option value="material" :data-option-image="images.theme_material">Material</option>
        </select>
      </f7-list-item>
      <f7-list-item :title="text.selectColors" :link="'/f7' + $root.theme + '/color-themes/'" media="<i class='f7-icons'>keyboard_fill</i>" />
      <f7-list-item :title="text.showStatusbar" media="<i class='f7-icons'>delete</i>" v-if="$root.appMode==='native'">
        <div slot="after">
          <label class="label-switch">
            <input type='checkbox' :checked="$root.statusbarVisibility==='visible'" @change="$root.statusbarVisibility=$event.target.checked===true?'visible':'hidden'">
            <div class='checkbox'></div>
          </label>
        </div>
      </f7-list-item>
    </f7-list>

    <!-- Demonstration -->
    <f7-block-title>{{text.demonstration}}</f7-block-title>
    <f7-list>
      <f7-list-item link="/f7ios/index/" :title="'iOS ' + text.uiComponents" media="<i class='icon icon-f7' />" v-if="$root.theme === 'ios'" />
      <f7-list-item link="/f7material/index/" :title="'Material ' + text.uiComponents" media="<i class='icon icon-f7' />" v-if="$root.theme === 'material'" />
      <f7-list-item link="/state-restoration/" title="App State Restoration" media="<i class='f7-icons'>refresh</i>" />
      <f7-list-item title="white" @click="$root.statusbarTextColor='white'" />
      <f7-list-item title="black" @click="$root.statusbarTextColor='black'" />
      <!--
      <f7-list-item link="/" title="Realtime Database" :media="'<img src=\'' + images.firebase + '\' width=\'29\' />'" />
      <f7-list-item link="/" title="Responsive Charts" media="<i class='f7-icons'>graph_round_fill</i>" />
      <f7-list-item link="/" title="Flexible Routing" media="<i class='f7-icons'>forward</i>" />
      -->
    </f7-list>

    <!-- Link to GitHub repository -->
    <f7-block style="text-align: center">
      <f7-link href="https://github.com/scriptPilot/app-framework" external>
        <f7-icon fa="github" size="20"></f7-icon>&nbsp;&nbsp;App Framework - v{{$root.frameworkVersion}}
      </f7-link>
    </f7-block>

  </f7-page>
</template>

<script>

  // Define text patterns
  let text = {
    en: {
      selectLanguage: 'Select Language',
      english: 'English',
      german: 'German',
      selectTheme: 'Select Theme',
      selectColors: 'Select Colors',
      showStatusbar: 'Show statusbar',
      configuration: 'Configuration',
      demonstration: 'Demonstration',
      uiComponents: 'UI Components'
    },
    de: {
      selectLanguage: 'Sprache auswählen',
      english: 'Englisch',
      german: 'Deutsch',
      selectTheme: 'Thema auswählen',
      selectColors: 'Farben auswählen',
      showStatusbar: 'Statusleiste anzeigen',
      configuration: 'Konfiguration',
      demonstration: 'Demonstration',
      uiComponents: 'UI-Komponenten'
    }
  }

  // Define images
  let images = {
    flag_en: require('../images/flag-en.png'),
    flag_de: require('../images/flag-de.png'),
    theme_ios: require('../images/theme-ios.png'),
    theme_material: require('../images/theme-material.png'),
    firebase: require('../images/firebase.png')
  }

  // Export page module
  module.exports = {
    data: function () {
      return {
        images: images
      }
    },
    computed: {
      text: function () {
        return text[this.$root.language] ? text[this.$root.language] : text[0]
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

<!-- Initial page of the main view, please see ../app.vue for more information about the application layout -->

<template>
  <f7-page>

    <!-- Navbar -->
    <f7-navbar sliding :title="$root.config.title" />

    <!-- Content block -->
    <f7-block inner inset style="text-align: center" v-if="$root.isMobileDevice && !$root.isNativeApp && !$root.isHomescreenApp">
      <p><b>For native App feeling, please pin this page to your homescreen and open it from there!</b></p>
    </f7-block>

    <!-- Language, theme, layout and color selection -->
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
      <f7-list-item smart-select smart-select-back-on-select
        :title="text.selectLayout"
        :media="'<div style=\'width: 20px; height: 20px; border-radius: 10px; margin: 0 4px 3px 5px; background: #' + $root.colors.ios[$root.layout === 'dark' ? 'black' : $root.layout === 'white' ? 'white' : 'gray'] + ';\'></div>'">
        <select v-model="$root.layout">
          <option value="default">default</option>
          <option v-if="$root.theme === 'ios'" value="white">white</option>
          <option value="dark">dark</option>
        </select>
      </f7-list-item>
      <f7-list-item smart-select smart-select-back-on-select
        :title="text.selectColor"
        :media="'<div style=\'width: 20px; height: 20px; border-radius: 10px; margin: 0 4px 3px 5px; background: #' + $root.colors[$root.theme][$root.color] + ';\'></div>'">
        <select v-model="$root.color">
          <option v-for="(hex, name) in $root.colors[$root.theme]" :value="name" :data-option-color="name">{{name}}</option>
        </select>
      </f7-list-item>
    </f7-list>

    <!-- UI elements / Framework7 and Framework7-Vue kitchen sinks -->
    <f7-list>
      <f7-list-item link="/f7ios/index/" title="iOS UI Components" media="<i class='icon icon-f7' />" v-if="$root.theme === 'ios'" />
      <f7-list-item link="/f7material/index/" title="Material UI Components" media="<i class='icon icon-f7' />" v-if="$root.theme === 'material'" />
      <f7-list-item link="/f7vue/index/" title="F7-Vue Components" media="<i class='icon icon-f7' />" />
    </f7-list>

    <f7-list>
      <f7-list-item link="simple-todo" title="Simple ToDo List"></f7-list-item>
      <f7-list-item link="firebase-public" title="Public Firebase ToDo List"></f7-list-item>
      <f7-list-item link="firebase-private" title="Private Firebase Storage"></f7-list-item>
      <f7-list-item link="multiple-languages" title="Multiple Languages"></f7-list-item>
      <f7-list-item link="form" title="Form Handling"></f7-list-item>
      <f7-list-item link="flexible-routing/blog/45/post/125?foo=bar#about" title="Flexible Routing"></f7-list-item>
      <f7-list-item link="image" title="Icon & Image"></f7-list-item>
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
      selectLanguage: 'Select language',
      english: 'English',
      german: 'German',
      selectTheme: 'Select theme',
      selectLayout: 'Select layout',
      selectColor: 'Select color'
    },
    de: {
      selectLanguage: 'Sprache auswählen',
      english: 'Englisch',
      german: 'Deutsch',
      selectTheme: 'Thema auswählen',
      selectLayout: 'Layout auswählen',
      selectColor: 'Farbe auswählen'
    }
  }

  // Define images
  let images = {
    flag_en: require('../images/flag-en.png'),
    flag_de: require('../images/flag-de.png'),
    theme_ios: require('../images/theme-ios.png'),
    theme_material: require('../images/theme-material.png')
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

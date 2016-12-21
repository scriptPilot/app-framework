<template>
  <f7-page>
  
    <!-- Multi language pages use bindings instead of fix text patterns -->
  
    <f7-navbar :title="text.title"></f7-navbar>
    
    <f7-list>
     
      <!-- Language selection -->
      <f7-list-item smart-select smart-select-back-on-select :title="text.selectLang" :media="'<img src=\'' + images['flag_' + $root.lang] + '\' width=\'29\' />'">              
        <select @change="changeLanguage" v-model="$root.lang">
          <option value="en" :data-option-image="images.flag_en">{{text.en}}</option>
          <option value="de" :data-option-image="images.flag_de">{{text.de}}</option>
        </select>             
      </f7-list-item>
      
      <!-- Theme selection -->
      <f7-list-item smart-select smart-select-back-on-select :title="text.selectTheme" :media="'<img src=\'' + images['theme_' + $root.theme] + '\' width=\'29\' />'">                
        <select @change="$root.theme=($event.target.value)" v-model="$root.theme">
          <option value="ios" :data-option-image="images.theme_ios">iOS</option>
          <option value="material" :data-option-image="images.theme_material">Material</option>
        </select>   
      </f7-list-item>
      
    </f7-list>
    
    <f7-list>
      <f7-list-item link="minimum" :title="text.minPage"></f7-list-item>
      <f7-list-item link="withComponents" :title="text.withComponents"></f7-list-item>
      <f7-list-item link="withoutComponents" :title="text.withoutComponents"></f7-list-item>
      <f7-list-item link="keepState" :title="text.keepState"></f7-list-item>
      <f7-list-item link="routerTest#/dir1/dir2/dir3/?foo=bar#something" :title="text.routerTest"></f7-list-item>
    </f7-list>
    
    <f7-list>
      <f7-list-item link="http://framework7.io/kitchen-sink-ios/" :title="text.examplesFor + ' iOS'" linkExternal></f7-list-item>
      <f7-list-item link="http://framework7.io/kitchen-sink-material/" :title="text.examplesFor + ' Material'" linkExternal></f7-list-item>
    </f7-block>
    
    <f7-block>
      <small>
        Version {{$root.version}}<br />
        <a href="https://github.com/scriptPilot/app-framework/" class="link external"><f7-icon material="build"></f7-icon>&nbsp;GitHub</a>
      </small>
    </f7-block>
    
  </f7-page>
</template>
<script>

  // Multi language pages need an object (we use "text") with sub-item per language and sub-sub-items per text pattern
  var text = {
    en: {
      title: 'Hello World',
      de: 'German',
      en: 'English',
      homescreenHint: 'This App Framework demo could be used as template for your own application - add it to your homescreen for best experience.',
      selectLang: 'Select language',
      selectTheme: 'Select theme',
      minPage: 'Minimum Page',
      withComponents: 'Page made with components',
      withoutComponents: 'Page made without components',
      routerTest: 'Router test page',
      loggedOut: 'Signed out',
      login: 'login',
      logout: 'logout',
      examplesFor: 'More examples for',
      keepState: 'Restore runtime environment'
    },
    de: {
      title: 'Hallo Welt',
      de: 'Deutsch',
      en: 'Englisch',
      homescreenHint: 'Dieses Template kannst du als Grundlage für deine eigene App nutzen - füge sie für ein schöneres Erlebnis zum Homescreen hinzu.',
      openTestPage: 'Testseite öffnen',
      selectLang: 'Sprache wählen',
      selectTheme: 'Thema wählen',
      minPage: 'Minimale Seite',
      withComponents: 'Beispiel mit Komponenten',
      withoutComponents: 'Beispiel ohne Komponenten',
      routerTest: 'Router-Testseite',
      loggedOut: 'Nicht angemeldet',
      login: 'anmelden',
      logout: 'abmelden',
      examplesFor: 'Mehr Beispiele für',
      keepState: 'Laufzeitumgebung wiederherstellen'
    }
  }

  // To use images, you have to require them before
  var images = {
    flag_en: require('../images/flag_en.png'),
    flag_de: require('../images/flag_de.png'),
    theme_ios: require('../images/theme_ios.png'),
    theme_material: require('../images/theme_material.png')
  }

  // To keep the text pattern assigned updated with the current selected language, it has to be assigned as computed property
  // If image resources are not changing during runtime, you could assign them as data property instead of computed property
  module.exports = {
    data: function() {
      return {
        images: images
      }
    },
    computed: {
      text: function() {
        return text[this.$root.lang]
      }
    },
    methods: {
      changeLanguage: function(e) {
        this.$root.lang = e.target.value
        setTimeout(function() {
          this.$$(e.target).parent().find('.item-after').html(this.text[e.target.value])
        }.bind(this), 0)
      }
    },
    mounted: function() {
      this.$$('.external').attr('target', '_blank');
    }
  }

</script>
<style scoped>
  .content-block {
    text-align: center
  }
</style>
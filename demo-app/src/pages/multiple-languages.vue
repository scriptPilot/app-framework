<template>
  <f7-page>
  
    <!-- Multi language pages use bindings instead of fix text patterns -->
    
    <f7-navbar :title="text.title" :back-link="text.backlink" sliding></f7-navbar>
    
    <!-- Language selection > $root.language must be changed to update language -->
    <f7-list inset>
      <f7-list-item smart-select smart-select-back-on-select
        :title="text.selectLang"
        :media="'<img src=\'' + images['flag_' + $root.language] + '\' width=\'29\' />'">              
        <select @change="updateLanguageText" v-model="$root.language">
          <option value="en" :data-option-image="images.flag_en">{{text.en}}</option>
          <option value="de" :data-option-image="images.flag_de">{{text.de}}</option>
        </select>             
      </f7-list-item>
    </f7-list>
    
    <f7-block inner inset><p>{{text.text}}</p></f7-block>    
    
    <f7-block inset>
      <f7-button :text="text.openPage" href="simple-page"></f7-button>
    </f7-block>
    
    <f7-block inset>
      <f7-button open-login-screen="#login-screen" :text="$root.user ? text.logout : text.login"></f7-button>
    </f7-block inset>
    
    <f7-block inner inset style="text-align: center">
      <p>Standard text patterns and the login screen will change their language as well - currently English and German are supported - Please request other in our <f7-link href="https://github.com/scriptPilot/app-framework/issues" external>GitHub Issue List</f7-link>.</p>
    </f7-block>
    
  </f7-page> 
</template>
<script>

  // Multi language pages need an object (we use "text") with sub-item per language and sub-sub-items per text pattern
  var text = {
    en: {
      backlink: 'Back',
      title: 'Multiple Languages',
      text: 'This page is made with Framework7-vue components and ready for multiple languages. Your selection is saved in the local storage and restored after you reopen the application. Please check the source code to see how it\'s done.',
      selectLang: 'Select language',
      de: 'German',
      en: 'English',
      openPage: 'Open simple sub page',
      login: 'Open login screen',
      logout: 'Open logout screen'
    },
    de: {
      backlink: 'Zurück',
      title: 'Mehrsprachigkeit',
      text: 'Diese Seite wurde mit Framework7-vue-Komponenten erstellt und ist mehrsprachig. Deine Auswahl wird im Local Storage gespeichert und beim Neuladen der Anwendung wiederhergestellt. Bitte schau dir den Quelltext als Beispiel an.',
      selectLang: 'Sprache wählen',
      de: 'Deutsch',
      en: 'Englisch',
      openPage: 'Einfache Unterseite öffnen',
      login: 'Anmeldebildschirm öffnen',
      logout: 'Abmeldebildschirm öffnen'
    }
  }
  
  // Load images (flags)
  var images = {
    'flag_en': require('../images/flag-en.png'),
    'flag_de': require('../images/flag-de.png')
  }
  
  module.exports = {
  
    // Assign images
    data: function () {
      return {
        images: images
      }
    },
  
    // To keep the text pattern assigned updated with the current selected language, it has to be assigned as computed property
    computed: {
      text: function () {
        return text[this.$root.language]
      }
    },
  
    methods: {
  
      // To change selected language text right after change, it has to be updated with this helper function
      updateLanguageText: function (e) {
        setTimeout(function () {
          this.$$(e.target).parent().find('.item-after').html(this.text[e.target.value])
        }.bind(this), 0)
      }
  
    }
  
  }
  
</script>

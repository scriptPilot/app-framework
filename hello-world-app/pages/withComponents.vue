<template>
  <f7-page navbar-fixed>
  
    <!-- Multi language pages use bindings instead of fix text patterns -->
    
    <f7-navbar :back-link="text.backlink" :title="text.title"></f7-navbar>
    
    <f7-block inner><p>{{text.text}}</p></f7-block>    
    
  </f7-page> 
</template>
<script>

  // Multi language pages need an object (we use "text") with sub-item per language and sub-sub-items per text pattern
  var text = {
    en: {
      backlink: 'Back',
      title: 'With Components',
      text: 'This page is made with Framework7-vue components and ready for multiple languages. You can try it out - go back, select German and come back Please check the source code to see how it\'s done.'
    },
    de: {
      backlink: 'Zurück',
      title: 'Mit Komponenten',
      text: 'Diese Seite wurde mit Framework7-vue-Komponenten erstellt und ist mehrsprachig. Du kannst es ausprobieren, indem du zurück gehst, "Englisch" auswählst und erneut diese Seite aufrust. Bitte schau dir den Quelltext als Beispiel an.'
    }
  }

  // To keep the text pattern assigned updated with the current selected language, it has to be assigned as computed property
  module.exports = {
    computed: {
      text: function() {
        return text[this.$root.lang]
      }
    }
  }
  
</script>
<template>
  <div class="page navbar-fixed">
  
    <!-- Multi language pages use bindings instead of fix text patterns -->
    
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left">
          <a href="#" class="link back">
            <i class="icon icon-back"></i>
            <span>{{text.backlink}}</span>
          </a>
        </div>
        <div class="center">{{text.title}}</div>
      </div>
    </div>
    
    <div class="page-content">
      <div class="content-block inset">
        <div class="content-block-inner">
          <p>{{text.text}}</p>
        </div>
      </div>
    </div>
    
  </div> 
</template>
<script>

  // Multi language pages need an object (we use "text") with sub-item per language and sub-sub-items per text pattern
  var text = {
    en: {
      backlink: 'Back',
      title: 'Without Components',
      text: 'This page is made with basic Framework7 HTML code and ready for multiple languages. You can try it out - go back, select German and come back Please check the source code to see how it\'s done.'
    },
    de: {
      backlink: 'Zurück',
      title: 'Ohne Komponenten',
      text: 'Diese Seite wurde mit standardmäßigem Framework7-HTML-Code erstellt und ist mehrsprachig. Du kannst es ausprobieren, indem du zurück gehst, "Englisch" auswählst und erneut diese Seite aufrust. Bitte schau dir den Quelltext als Beispiel an.'
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
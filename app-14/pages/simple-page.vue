<!-- You can use this template for multi-lingual pages -->

<template>
  <f7-page>
    <f7-navbar :title="text.title" :back-link="text.backlink" sliding></f7-navbar>   
    <f7-block inner inset>
      <p>{{text.text}}</p>
    </f7-block>        
  </f7-page> 
</template>

<script>

  var text = {
    en: {
      backlink: 'Back',
      title: 'Simple Page',
      text: 'Simple multi-language page, created with Framework7-Vue components.'
    },
    de: {
      backlink: 'Zurück',
      title: 'Einfache Seite',
      text: 'Einfache, mehrsprachige Seite, mit Framework7-Vue-Komponenten erstellt.'
    }
  }
  
  module.exports = {
    computed: {
      text: function () {
        return text[this.$root.language]
      }
    }
  }
  
</script>

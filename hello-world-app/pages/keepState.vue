<template>
  <f7-page :with-subnavbar="$root.theme=='ios'">
  
    <!-- Multi language pages use bindings instead of fix text patterns -->
    
    <f7-navbar :back-link="text.backlink" :title="text.title">
      <f7-subnavbar v-if="$root.theme=='ios'">
        <f7-buttons>
          <f7-button tab-link="#tab1" active>Tab 1</f7-button>
          <f7-button tab-link="#tab2">Tab 2</f7-button>
          <f7-button tab-link="#tab3">Tab 3</f7-button>
        </f7-buttons>
      </f7-subnavbar>
    </f7-navbar>
    
    <f7-toolbar tabbar v-if="$root.theme=='material'">
      <f7-button tab-link="#tab1" active>Tab 1</f7-button>
      <f7-button tab-link="#tab2">Tab 2</f7-button>
      <f7-button tab-link="#tab3">Tab 3</f7-button>
    </f7-toolbar>
    
    <f7-tabs animated>
      <f7-tab id="tab1" active>
        <f7-block inner inset>{{text.text}}</f7-block>
        <f7-block>
          <p><b>Tab 1</b></p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure odio dolor, soluta reprehenderit, corporis officia earum corrupti amet ea aspernatur praesentium, distinctio ipsa atque officiis. Recusandae ab error, atque natus.</p>
          <p>Quibusdam repellendus, repudiandae nulla commodi ut nemo eum, quia dolorum dicta voluptate reprehenderit. Omnis, temporibus iure quia ad sit incidunt similique et quaerat dicta delectus aspernatur, unde illo cum ipsam?</p>
          <p>Officia alias inventore soluta illo, omnis tempore obcaecati at, harum impedit nemo enim, iure fugit est explicabo commodi ipsam distinctio architecto voluptatum reprehenderit, aperiam dolorem praesentium repellendus repudiandae ducimus saepe.</p>
          <p>Autem ullam tempore suscipit consectetur, odit soluta. Neque quasi mollitia culpa autem, quis ab nostrum non distinctio illo magni perspiciatis et consequuntur possimus aliquam reprehenderit reiciendis praesentium consectetur, voluptas obcaecati?</p>
          <p>Quae repellendus aut iste provident consectetur inventore voluptatibus, saepe ad dolorem voluptatum recusandae praesentium animi harum officiis error nulla ullam nobis? Mollitia possimus voluptatum pariatur omnis quibusdam, quidem recusandae velit.</p>
        </f7-block>
        <f7-list>
          <f7-list-item>
            <f7-input type="text" :placeholder="text.placeholder" v-model="input1"></f7-input>
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab2">
        <f7-block inner inset>{{text.text}}</f7-block>
        <f7-block>
          <p><b>Tab 2</b></p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure odio dolor, soluta reprehenderit, corporis officia earum corrupti amet ea aspernatur praesentium, distinctio ipsa atque officiis. Recusandae ab error, atque natus.</p>
          <p>Quibusdam repellendus, repudiandae nulla commodi ut nemo eum, quia dolorum dicta voluptate reprehenderit. Omnis, temporibus iure quia ad sit incidunt similique et quaerat dicta delectus aspernatur, unde illo cum ipsam?</p>
          <p>Officia alias inventore soluta illo, omnis tempore obcaecati at, harum impedit nemo enim, iure fugit est explicabo commodi ipsam distinctio architecto voluptatum reprehenderit, aperiam dolorem praesentium repellendus repudiandae ducimus saepe.</p>
          <p>Autem ullam tempore suscipit consectetur, odit soluta. Neque quasi mollitia culpa autem, quis ab nostrum non distinctio illo magni perspiciatis et consequuntur possimus aliquam reprehenderit reiciendis praesentium consectetur, voluptas obcaecati?</p>
          <p>Quae repellendus aut iste provident consectetur inventore voluptatibus, saepe ad dolorem voluptatum recusandae praesentium animi harum officiis error nulla ullam nobis? Mollitia possimus voluptatum pariatur omnis quibusdam, quidem recusandae velit.</p>
        </f7-block>
        <f7-list>
          <f7-list-item>
            <f7-input type="text" :placeholder="text.placeholder" v-model="input2"></f7-input>
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab3">
        <f7-block inner inset>{{text.text}}</f7-block>
        <f7-block>
          <p><b>Tab 3</b></p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure odio dolor, soluta reprehenderit, corporis officia earum corrupti amet ea aspernatur praesentium, distinctio ipsa atque officiis. Recusandae ab error, atque natus.</p>
          <p>Quibusdam repellendus, repudiandae nulla commodi ut nemo eum, quia dolorum dicta voluptate reprehenderit. Omnis, temporibus iure quia ad sit incidunt similique et quaerat dicta delectus aspernatur, unde illo cum ipsam?</p>
          <p>Officia alias inventore soluta illo, omnis tempore obcaecati at, harum impedit nemo enim, iure fugit est explicabo commodi ipsam distinctio architecto voluptatum reprehenderit, aperiam dolorem praesentium repellendus repudiandae ducimus saepe.</p>
          <p>Autem ullam tempore suscipit consectetur, odit soluta. Neque quasi mollitia culpa autem, quis ab nostrum non distinctio illo magni perspiciatis et consequuntur possimus aliquam reprehenderit reiciendis praesentium consectetur, voluptas obcaecati?</p>
          <p>Quae repellendus aut iste provident consectetur inventore voluptatibus, saepe ad dolorem voluptatum recusandae praesentium animi harum officiis error nulla ullam nobis? Mollitia possimus voluptatum pariatur omnis quibusdam, quidem recusandae velit.</p>
        </f7-block>
        <f7-list>
          <f7-list-item>
            <f7-input type="text" :placeholder="text.placeholder" v-model="input3"></f7-input>
          </f7-list-item>
        </f7-list>
      </f7-tab>
    </f7-tabs>    
    
  </f7-page> 
</template>
<script>

  // Multi language pages need an object (we use "text") with sub-item per language and sub-sub-items per text pattern
  var text = {
    en: {
      backlink: 'Back',
      title: 'Runtime environment',
      text: 'Switch tab, scroll down, put some data in the input ... and then close the App. Come back and see how everything is restored properly: Page, tab, scroll position, form focus and form data',
      placeholder: 'Write something ...'
    },
    de: {
      backlink: 'Zurück',
      title: 'Laufzeitumgebung',
      text: 'Wechsle den Tab, scrolle herunter und schreibe etwas in das Eingabefeld ... und dann schließe die App. Öffne sie erneut und sieh, wie alles wiederhergestellt wird: Seite, Tab, Scrollposition, Formular-Fokus und Formulardaten',
      placeholder: 'Schreib etwas ...'
    }
  }

  // To keep the text pattern assigned updated with the current selected language, it has to be assigned as computed property
  module.exports = {
    data: function() {
      return {
        input1: '',
        input2: '',
        input3: ''
      }
    },
    computed: {
      text: function() {
        return text[this.$root.lang]
      }
    }
  }
  
</script>
<style scoped>
  .tab {
    overflow: auto
  }
</style>
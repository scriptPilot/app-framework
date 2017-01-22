<template>

  <f7-page>
  
    <!-- Navbar and backlink -->
    <f7-navbar title="Firebase Public ToDo" back-link="Back" sliding></f7-navbar>
    
    <!-- Description box -->
    <f7-block inner inset style="text-align: center">
      <p>Open this page from multiple devices. This public task list is synchronized in real time and shows newest {{maxEntries}} tasks.</p>
    </f7-block>
    
    <!-- Input field for new todo -->    
    <f7-list>    
      <f7-list-item>
        <div slot="inner-start"><f7-input type="text" placeholder="What is to do?" v-model="newTodo" @keydown.13="saveTodo"></f7-input></div>
        <span slot="after" v-show="newTodo"><f7-link @click="saveTodo">Save</f7-link></span>
      </f7-list-item>      
    </f7-list>
    
    <!-- Task list -->
    <f7-list v-if="todos">
      <f7-list-item swipeout
        v-for="(todo, key) in todos"
        :title="(todo.completed ? '<span style=\'text-decoration: line-through\' class=\'color-gray\'>' : '') + todo.text + (todo.completed ? '</span>' : '')"
        :media="'<i class=\'fa fa-' + (todo.completed ? 'check-circle color-green' : 'circle-thin color-gray') + '\'></i>'">
        <f7-swipeout-actions left>
          <f7-swipeout-button overswipe close
            :color="(todo.completed ? 'grey' : 'green')"
            @click="toggleTodo(key)">
            <f7-icon :fa="(todo.completed ? 'undo' : 'check')"></f7-icon>
          </f7-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>
    
    <!-- Instruction how to complete todos -->
    <f7-block v-if="todos && completedTodos == 0">
      <p style="text-align: center">Swipe todo to the right complete it</p>
    </f7-block>
    
    <!-- Link to delete all completed todos -->
    <f7-block inset v-if="completedTodos > 0" style="text-align: center">
      <f7-link @click="deleteCompleted">Delete all completed todos</f7-link>
    </f7-block>
    
    <!-- Message if there are no todos -->
    <f7-block inner inset v-if="!todos">
      <p style="text-align: center"><f7-icon fa="smile-o"></f7-icon> &nbsp;Nothing to do</p>
    </f7-block>
    
  </f7-page>
  
</template>
<script>

  module.exports = {
  
    // Define intial data as a function
    data: function() {
      return {
        newTodo: '',
        todos: null,
        maxEntries: 10
      }
    },
      
    // Firebase + localStorage test
    mounted: function() {
      let view = this.$$(this.$el).parents('.view').attr('id')
      let url = this.$route.url
      let pageNo = this.$$(this.$el).parents('.view').find('.page').length - 1
      let vueId = 'db/' + view + '/' + pageNo + '/' + url      
      this.$vueId = vueId
      if (localStorage[this.$vueId]) {
        let data = JSON.parse(localStorage[this.$vueId])
        for (let key in data) {
          this[key] = data[key]
        }
      }
      firebase.database().ref('publicData/todos').orderByChild('created').limitToLast(this.maxEntries).on('value', function (snapshot) {
        this.todos = snapshot.val()
      }.bind(this))
    },
    beforeUpdate: function () {
      localStorage[this.$vueId] = JSON.stringify(this.$data)
    },
    beforeDestroy: function() {
      localStorage.removeItem[this.$vueId]
    },
    
    // Compute number of completed todos
    computed: {
      completedTodos: function() {
        let completed = 0
        for (let key in this.todos) {
          if (this.todos[key].completed) {
            completed++
          }
        }
        return completed
      }
    },
    
    // Methods
    methods: {
    
      // Save new todo
      saveTodo: function(e) {
        firebase.database().ref('publicData/todos')
          .push({
            text: this.newTodo,
            completed: false,
            created: firebase.database.ServerValue.TIMESTAMP            
          })
          .then(function() {
            this.newTodo = ''
          }.bind(this))
          .catch(function() {
            this.$f7.alert('Cannot save new task :-(<br />Please try again later', 'Trouble with Firebase')
          }.bind(this))
      },
      
      // Mark todo as completed / not completed
      toggleTodo: function(key) {
        firebase.database().ref('publicData/todos/' + key + '/completed')
          .set(!this.todos[key].completed)
          .catch(function() {
            this.$f7.alert('Cannot update task :-(<br />Please try again later', 'Trouble with Firebase')
          }.bind(this))
      },
      
      // Delete todo
      deleteCompleted: function() {
        let deletes = {}
        for (let key in this.todos) {
          if (this.todos[key].completed) {
            deletes[key] = null
          }
        }
        firebase.database().ref('publicData/todos')
            .update(deletes)
            .catch(function() {
              this.$f7.alert('Cannot delete task' + (this.completedTodos > 1 ? 's' : '') + ' :-(<br />Please try again later', 'Trouble with Firebase')
            }.bind(this)) 
      }
      
    },
    
  }
  
</script>
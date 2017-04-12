<!-- Example, how a todo app could look like. Be aware, that data will be lost after local storage reset -->

<template>

  <f7-page>
  
    <!-- Navbar and backlink -->
    <f7-navbar title="Simple ToDo List" back-link="Back" sliding></f7-navbar>
    
    <!-- Description box -->
    <f7-block inner inset>
      <p>Everything you store in the data object will be kept automatically! You can close and reopen this application and all todos will still be there.</p>
    </f7-block>
    
    <!-- Input field for new todo -->    
    <f7-list>    
      <f7-list-item>
        <div slot="inner-start"><f7-input type="text" placeholder="What is to do?" v-model="newTodo" @keydown.13="saveTodo" name="newTodo"></f7-input></div>
        <span slot="after" v-show="newTodo"><f7-link @click="saveTodo">Save</f7-link></span>
      </f7-list-item>      
    </f7-list>
    
    <!-- Task list -->
    <f7-list v-if="todos.length > 0">
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
    <f7-block v-if="todos.length > 0 && completedTodos == 0">
      <p style="text-align: center">Swipe todo to the right complete it</p>
    </f7-block>
    
    <!-- Link to delete all completed todos -->
    <f7-block inset v-if="completedTodos > 0" style="text-align: center">
      <f7-link @click="deleteCompleted">Delete all completed todos</f7-link>
    </f7-block>
    
    <!-- Message if there are no todos -->
    <f7-block inner inset v-if="todos.length == 0">
      <p style="text-align: center"><f7-icon fa="smile-o"></f7-icon> &nbsp;Nothing to do</p>
    </f7-block>
    
  </f7-page>
  
</template>
<script>
  module.exports = {
  
    // Return data as a function
    data: function () {
      return {
        newTodo: '',
        todos: []
      }
    },
  
    // Compute number of completed todos
    computed: {
      completedTodos: function () {
        let completed = 0
        for (let n = 0; n < this.todos.length; n++) {
          if (this.todos[n].completed) {
            completed++
          }
        }
        return completed
      }
    },
  
    // Methods
    methods: {
  
      // Save new todo
      saveTodo: function (e) {
        if (this.newTodo !== '') {
          this.todos.push({text: this.newTodo, completed: false})
          this.newTodo = ''
        }
      },
  
      // Mark todo as completed / not completed
      toggleTodo: function (key) {
        this.todos[key].completed = !this.todos[key].completed
      },
  
      // Delete todo
      deleteCompleted: function () {
        let newTodos = []
        for (let n = 0; n < this.todos.length; n++) {
          if (!this.todos[n].completed) {
            newTodos.push(this.todos[n])
          }
        }
        this.todos = newTodos
      }
  
    }
  
  }
</script>

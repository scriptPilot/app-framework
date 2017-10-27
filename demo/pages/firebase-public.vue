
<template>
  <f7-page>

    <!-- Navbar -->
    <f7-navbar title="Realtime Database" back-link="Back" sliding />

    <!-- Description box -->
    <f7-block>Open this page from multiple devices. This public task list is synchronized in real time and shows newest {{maxEntries}} tasks.</f7-block>

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
        :key="key">
        <div slot="media-start">
          <f7-icon
            :material="todo.completed ? 'check_box' : 'check_box_outline_blank'"
            :color="todo.completed ? 'green' : 'gray'" />
        </div>
        <f7-swipeout-actions left>
          <f7-swipeout-button overswipe close
            :color="(todo.completed ? 'grey' : 'green')"
            @click="toggleTodo(key)">
            <f7-icon :material="(todo.completed ? 'undo' : 'check')"></f7-icon>
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
    data: function () {
      return {
        newTodo: '',
        todos: null,
        maxEntries: 10
      }
    },

    // Attach data change listener to firebase todo list
    mounted: function () {
      window.db('publicData/todos').orderByChild('created').limitToLast(this.maxEntries).on('value', snapshot => {
        this.todos = window.sortObject(snapshot.val(), 'created', 'desc')
      })
    },

    // Compute number of completed todos
    computed: {
      completedTodos: function () {
        let completed = 0
        for (let key in this.todos) {
          if (this.todos[key].completed) {
            completed++
          }
        }
        return completed
      }
    },

    // Methods - With error handling
    methods: {

      // Save new todo
      saveTodo: function (e) {
        if (!navigator.onLine) {
          window.f7.addNotification({
            title: 'Offline',
            message: 'This action is not possible in offline mode.',
            hold: 3000,
            closeIcon: false
          })
          return
        }
        if (this.newTodo !== '') {
        // Show loading indicator with delay
          let saved = false
          setTimeout(function () {
            if (!saved) {
              this.$f7.showIndicator()
            }
          }.bind(this), 1000)

          window.db('publicData/todos')
            .push({
              text: this.newTodo,
              completed: false,
              created: window.timestamp
            })
            .then(function () {
              this.newTodo = ''
              saved = true
              this.$f7.hideIndicator()
            }.bind(this))
            .catch(function () {
              this.$f7.alert('Cannot save new task :-(<br />Please try again later', 'Trouble with Firebase')
              saved = true
              this.$f7.hideIndicator()
            }.bind(this))
        }
      },

      // Mark todo as completed / not completed
      toggleTodo: function (key) {
        if (!navigator.onLine) {
          window.f7.addNotification({
            title: 'Offline',
            message: 'This action is not possible in offline mode.',
            hold: 3000,
            closeIcon: false
          })
          return
        }
        window.db('publicData/todos/' + key + '/completed')
          .set(!this.todos[key].completed)
          .catch(function () {
            this.$f7.alert('Cannot update task :-(<br />Please try again later', 'Trouble with Firebase')
          }.bind(this))
      },

      // Delete todo
      deleteCompleted: function () {
        if (!navigator.onLine) {
          window.f7.addNotification({
            title: 'Offline',
            message: 'This action is not possible in offline mode.',
            hold: 3000,
            closeIcon: false
          })
          return
        }
        let deletes = {}
        for (let key in this.todos) {
          if (this.todos[key].completed) {
            deletes[key] = null
          }
        }
        window.db('publicData/todos')
          .update(deletes)
          .catch(function () {
            this.$f7.alert('Cannot delete task' + (this.completedTodos > 1 ? 's' : '') + ' :-(<br />Please try again later', 'Trouble with Firebase')
          }.bind(this))
      }

    }

  }
</script>
<style scoped>
  .swipeout-actions-left .material-icons {
    color: #ffffff;
  }
  .item-media .material-icons {
    font-size: 22px;
    line-height: 32px;
  }
</style>

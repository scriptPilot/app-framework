<!-- WORK IN PROGRESS - THIS COMMENT WILL BE REMOVED AFTER FINISHING THIS PAGE -->

<!-- Example of a login-requiring page with Firebase realtime database and storage service -->

<template>
  <f7-page>
  
    <!-- Navbar and backlink -->
    <f7-navbar title="Private Firebase Storage" back-link="Back" sliding></f7-navbar>
    
    <!-- Description box -->
    <f7-block inner inset style="text-align: center">
      <p>Enter some private notes, login from multiple devices and see how they are synchronized in real time.</p>
    </f7-block>
    
    <!-- Private notes textfield -->
    <f7-list form inset>
      <f7-list-item>
        <f7-input v-model="notes" name="notes" type="textarea" placeholder="Your private Notes ..."></f7-input>
      </f7-list-item>
    </f7-list>
    
    <!-- Private photo selection -->
    <f7-list inset>
      <f7-list-item>
        <f7-label>Photo</f7-label>
        <f7-input type="file" class="custom-file-input" @change="uploadPhoto" accept="image/*;capture=camera"></f7-input>
      </f7-list-item>
    </f7-list>
    
  </f7-page>  
</template>
<script>

  module.exports = {
  
    // Define intial data as a function
    data: function () {
      return {
        notes: '',
        photo: ''
      }
    },
    
    // Methods
    methods: {
      uploadPhoto: function (el) {
        console.log('PHOTO', el)
      }
    },
  
    // Attach data change listener to firebase
    mounted: function () {
      window.db('privateData/notes/' + window.user.uid).on('value', function (snapshot) {
        this.notes = snapshot.val() ? snapshot.val() : ''
      }.bind(this))
    },
  
    // Save notes after change immediately
    watch: {
      notes: function () {
        window.db('privateData/notes/' + window.user.uid)
          .set(this.notes)
          .catch(function () {
            this.$f7.alert('Cannot update notes :-(<br />Please try again later', 'Trouble with Firebase')
          }.bind(this))
      }
    }
  
  }
  
</script>
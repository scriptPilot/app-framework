<!-- Example of a login-requiring page with Firebase realtime database and storage service -->
<!-- Login requiring pages could be defined easily in the package.json file -->

<template>
  <f7-page>
  
    <!-- Navbar and backlink -->
    <f7-navbar title="Private Firebase Storage" back-link="Back" sliding></f7-navbar>
    
    <!-- Description box -->
    <f7-block inset style="text-align: center">
      <p>Enter some notes, upload a photo, login from multiple devices and see how everything is synchronized in real time.</p>
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
        <f7-input type="file" accept="image/*;capture=camera"></f7-input>
      </f7-list-item>
      <f7-list-button @click="uploadPhoto">Upload photo</f7-list-button>
    </f7-list>
    
    <!-- Private photo display -->
    <f7-block inset v-if="photo">
      <img :src="photo" width="100%" />
    </f7-block>
    
  </f7-page>  
</template>
<script>

  module.exports = {
  
    // Define intial data as a function
    data: function () {
      return {
        notes: '',
        photo: null
      }
    },
  
    // Upload photo
    methods: {
      uploadPhoto: function (e) {
      // File selected
        let file = this.$$(e.target).parents('.page-content').find('input[type=file]')[0].files[0]
        if (file !== undefined) {
        // Upload file to Firebase
          this.$f7.showIndicator()
          window.store('privateData/' + window.user.uid).put(file)
            .then(function () {
            // Get download URL
              window.store('privateData/' + window.user.uid).getDownloadURL()
                .then(function (url) {
                // Save download URL to user data
                  window.db('privateData/' + window.user.uid + '/photo').set(url)
                    .then(function () {
                      this.$f7.hideIndicator()
                    }.bind(this))
                    // Saving the URL failed
                    .catch(function () {
                      this.$f7.hideIndicator()
                      this.$f7.alert('Cannot update the photo url :-(<br />Please try again later', 'Trouble with Firebase')
                    }.bind(this))
                }.bind(this))
                // URL download failed
                .catch(function () {
                  this.$f7.hideIndicator()
                  this.$f7.alert('Cannot load the photo url :-(<br />Please try again later', 'Trouble with Firebase')
                }.bind(this))
              // Reset the file selection
              this.$$(e.target).parents('.page-content').find('input[type=file]').val('')
            }.bind(this))
            // File upload failed
            .catch(function () {
              this.$f7.hideIndicator()
              this.$f7.alert('Cannot upload the photo :-(<br />Please try again later', 'Trouble with Firebase')
            }.bind(this))
        // No file selected
        } else {
          this.$f7.alert('Please select a photo first!')
        }
      }
    },
  
    // Attach data change listener to firebase
    mounted: function () {
      window.db('privateData/' + window.user.uid).on('value', function (snapshot) {
        let data = snapshot.val()
        if (data) {
          this.notes = data.notes
          this.photo = data.photo
        }
      }.bind(this))
    },
  
    // Save notes after change immediately
    watch: {
      notes: function () {
        window.db('privateData/' + window.user.uid + '/notes')
          .set(this.notes)
          .catch(function () {
            this.$f7.alert('Cannot update the notes :-(<br />Please try again later', 'Trouble with Firebase')
          }.bind(this))
      }
    }
  
  }
  
</script>

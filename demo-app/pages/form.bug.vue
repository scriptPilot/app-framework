<template>
  <f7-page>
    <f7-list>
      <f7-list-item>
        <f7-label>Name</f7-label>
        <f7-input v-model="name" name="name" type="text" placeholder="Name"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Birth date</f7-label>
        <f7-input v-model="birthday" name="birthday" type="date" placeholder="Birth date"></f7-input>
      </f7-list-item>      
      <f7-list-item>
        <f7-label>Date time</f7-label>
        <f7-input v-model="date" name="date" type="datetime-local"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Gender</f7-label>
        <f7-input v-model="gender" name="gender" type="select">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Switch</f7-label>
        <f7-input v-model="switchbox" name="switchbox" type="switch"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Range</f7-label>
        <f7-input v-model="range" name="range" type="range" min="0" max="100" step="1"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Textarea</f7-label>
        <f7-input v-model="text" name="text" type="textarea" placeholder="Textarea"></f7-input>
      </f7-list-item>
    </f7-list>
    <f7-block inner>
      {{json}}
    </f7-block>
  </f7-page>
</template>
<script>
  module.exports = {
    data: function () {
      return {
        name: '',
        birthday: '',
        date: '',
        gender: '',
        switchbox: '',
        range: '',
        text: ''
      }      
    },
    computed: {
      json: function () {
        return JSON.stringify([
          this.name,
          this.birthday,
          this.date,
          this.gender,
          this.switchbox,
          this.range,
          this.text
        ])
      }
    },
    mounted: function () {
      setTimeout(function () {
        this.name = 'Name'
        this.birthday = '1900-01-09'
        this.date = '1900-01-09T10:09'        
        this.gender = 'female'
        this.switchbox = 'yes'
      }.bind(this), 3000)
    }
  }
</script>
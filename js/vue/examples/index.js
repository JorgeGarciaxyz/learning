var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    messageHour: 'You loaded on this page on ' + new Date().toLocaleString(),
    showMessage: true,
    todos: [
      { text: 'First element' },
      { text: 'Second element' },
      { text: 'Third element' }
    ]
  },
  methods: {
    reverseMessage: function() {
      this.message = this.message.split('').reverse().join('');
    }
  }
})

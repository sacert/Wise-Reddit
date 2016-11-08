var app = {
  init: function() {
    console.log('Running...');
    if (document.readyState != 'loading') {
      this.startApp();
    } else {
      document.addEventListener('DOMContentLoaded', this.startApp);
    }
  },

  //fetch helpers
  status: function (response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  },
  json: function (response) {
    return response.json()
  },

  //Main
  startApp: function() {
   //Get Feed
    console.log('Fetching feed...');
     fetch('https://www.reddit.com/r/TrueReddit/comments/2yole7/america_dumbs_down_us_overrun_by_wave_of/.json')
      .then(app.status)
      .then(app.json)
      .then(app.getCommentsFromJSON)
    	.then(app.addCommentstoHTML)
      .catch(function(error) {
      console.log('request failed', error)
      });
  },

  //Drop the text into the HTML
  addCommentstoHTML: function(text) {
    console.log('Printing...');
    var comments = document.querySelector('.reddit-dump');
		comments.innerHTML = text;
  },

  getCommentsFromJSON: function(json) {
    console.log('Finding comments...');
    var text = app.getCommentsFromArray(json[1].data.children);

    return text;
  },

  //Recursively go through the object tree and compile all the comments
  getCommentsFromArray: function(arr) {
    var text = '';

    arr.forEach(function(item) {
      if (typeof item !== 'undefined') {
        text += item.data.body;

        if (typeof item.data.replies !== 'undefined' && item.data.replies !== '') {
          text += app.getCommentsFromArray(item.data.replies.data.children);
        }
      }
    });

    return text;
  }
};

app.init();

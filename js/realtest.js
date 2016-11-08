function app() {
    console.log('Running...');
    getComment();
    document.getElementById("next").addEventListener("click", getComment, false);
    setUpLoadingAnim();

}

function setUpLoadingAnim() {
  i = 0;
  setInterval(function() {
    i = ++i % 4;
    document.getElementById("loading").innerHTML = ("Loading "+Array(i+1).join(" ."));
  }, 800);
}

function getComment() {
  document.getElementById("loading").style.visibility = "visible";
  console.log('Fetching feed...');
   fetch('https://www.reddit.com/comments/.json')
    .then(status)
    .then(json)
    .then(getCommentsFromJSON)
    .then(addCommentstoHTML)
    .catch(function(error) {
      console.log('request failed', error)
    });
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

function getCommentsFromJSON(json) {
  console.log('Finding comments...');
  var text;
  var i = 0;
  do {
    text = json["data"]["children"][i]["data"]["body"];
    i++;
  } while (String(text).length > 80 || json["data"]["children"][0]["data"]["over_18"] == "true");

  return text;
}

//Drop the text into the HTML
//Scale text to fit div
function addCommentstoHTML(text) {
  console.log('Printing...');
  var quote = document.getElementById("quote");
  document.getElementById("loading").style.visibility = "hidden";
	quote.innerHTML = "\"" + text + "\"";
  while(checkOverflow(quote)) {
    var fontSize = parseFloat(window.getComputedStyle(quote, null).getPropertyValue('font-size'));
    quote.style.fontSize = (fontSize - 2) + "px";
  }
}

// determine if text is overflowing out of the div
function checkOverflow(el)
{
  var curOverflow = el.style.overflow;

  if ( !curOverflow || curOverflow === "visible" ) {
    el.style.overflow = "hidden";
  }

  var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  el.style.overflow = curOverflow;

  return isOverflowing;
}

app();

var _uniqueIdIndex = 0;

function uid () {
  return _uniqueIdIndex++;
}

// from Doug Crockford http://javascript.crockford.com/remedial.html
function typeOf(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (Object.prototype.toString.call(value) == '[object Array]') {
        return 'array';
      }
      return value.constructor.name;
    } else {
      return 'null';
    }
  }
  return s;
}

function checkTypes(argList, typeList) {
  for (var i = 0; i < typeList.length; i++) {
    if (typeOf(argList[i]) !== typeList[i]) {
      throw 'wrong type: expecting ' + typeList[i] + ", found " + typeOf(argList[i]);
    }
  }
}

function loadFile(url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data)
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);
}

function loadFiles(urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

    // Callback for a single file
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;

        // When all files have downloaded
        if (numComplete == numUrls) {
            callback(result);
        }
    }

    for (var i = 0; i < numUrls; i++) {
        loadFile(urls[i], i, partialCallback, errorCallback);
    }
}

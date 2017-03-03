function call () {
  jQuery.ajax({
    url: 'https://odyssey.lib.vt.edu/api/items?featured=true',
    jsonpCallback: 'success',
    dataType: 'jsonp',
    cache: true
  })
}

function success (response) {
  var data = response['data']
  data.forEach(list)
}

function list (object, index) {
  jQuery('#showcase').append("<a href='" + object['url'].replace('api/', '').replace('items', 'object') + "'>" + object['element_texts'][1]['text'] + '</a><br>')
}

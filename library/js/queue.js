var queueData = {}
var url = 'https://printtracker.lib.vt.edu/api/index.php/queue'

jQuery.fn.center = function () {
  this.css('position', 'fixed')
  this.css('top', Math.max(0, ((jQuery(window).height() - jQuery(this).outerHeight()) / 2) +
        jQuery(window).scrollTop()) + 'px')
  this.css('left', Math.max(0, ((jQuery(window).width() - jQuery(this).outerWidth()) / 2) +
        jQuery(window).scrollLeft()) + 'px')
  return this
}

function queue () {
  jQuery('#sidebar1').hide()
  jQuery('.wrap').css('width', '90%')
  jQuery('#main').css('width', '100%')
  getData()
}

function getData () {
  jQuery.ajax({
    url: url + '/?by=id&order=asc',
    cache: false,
    beforeSend: function () {
      jQuery('.mdl-spinner').center().show()
    }
  })
        .done(function (data) {
          jQuery('.mdl-spinner').center().hide()
          queueData = data
          createStructure()
        })
}

function createStructure () {
  getTable()
  setStates()
}

function setStates () {
  jQuery('#save-queue').click(function () {
    saveEntry()
  })

  jQuery('#close-warning').click(function () {
    jQuery('.overlay-warning').fadeOut()
    jQuery('.warning-card-wide').fadeOut()
  })

  jQuery('#close-receipt').click(function () {
    jQuery('.overlay-receipt').fadeOut()
    jQuery('.receipt-card-wide').fadeOut()
  })

  jQuery('#confirm-receipt').click(function () {
    sendReceipt()
    jQuery('.overlay-receipt').fadeOut()
    jQuery('.receipt-card-wide').fadeOut()
  })

  jQuery('#close-email').click(function () {
    jQuery('.overlay-email').fadeOut()
    jQuery('.email-card-wide').fadeOut()
  })

  jQuery('#confirm-email').click(function () {
    emailAjax()
    jQuery('.overlay-email').fadeOut()
    jQuery('.email-card-wide').fadeOut()
  })

  jQuery('.edit-card-wide').on('click', function (e) {
    e.stopPropagation()
  })

  jQuery('.warning-card-wide').on('click', function (e) {
    e.stopPropagation()
  })

  jQuery('.overlay').click(function () {
    jQuery('.overlay').hide()
    jQuery('.edit-card-wide').hide()
  })

  jQuery('.overlay-warning').click(function () {
    jQuery('.overlay-warning').hide()
    jQuery('.warning-card-wide').hide()
  })

  jQuery('#show-normal').click(function () {
    jQuery('#queue-table').slideDown()
    jQuery('#show-normal').hide()
    jQuery('#hide-normal').show()
  })

  jQuery('#hide-normal').click(function () {
    jQuery('#queue-table').slideUp()
    jQuery('#show-normal').show()
    jQuery('#hide-normal').hide()
  })

  jQuery('#show-special').click(function () {
    jQuery('#special-table').slideDown()
    jQuery('#show-special').hide()
    jQuery('#hide-special').show()
  })

  jQuery('#hide-special').click(function () {
    jQuery('#special-table').slideUp()
    jQuery('#show-special').show()
    jQuery('#hide-special').hide()
  })

  jQuery('#show-current').click(function () {
    jQuery('#current-table').slideDown()
    jQuery('#show-current').hide()
    jQuery('#hide-current').show()
  })

  jQuery('#hide-current').click(function () {
    jQuery('#current-table').slideUp()
    jQuery('#show-current').show()
    jQuery('#hide-current').hide()
  })

  jQuery('#show-finished').click(function () {
    jQuery('#archive-table').slideDown()
    jQuery('#show-finished').hide()
    jQuery('#hide-finished').show()
  })

  jQuery('#hide-finished').click(function () {
    jQuery('#archive-table').slideUp()
    jQuery('#show-finished').show()
    jQuery('#hide-finished').hide()
  })

  jQuery('#show-failed').click(function () {
    jQuery('#failed-table').slideDown()
    jQuery('#show-failed').hide()
    jQuery('#hide-failed').show()
  })

  jQuery('#hide-failed').click(function () {
    jQuery('#failed-table').slideUp()
    jQuery('#show-failed').show()
    jQuery('#hide-failed').hide()
  })

  jQuery('#show-normal').hide()
  jQuery('#show-special').hide()
  jQuery('#show-current').hide()
  jQuery('#show-finshed').hide()
  jQuery('#show-failed').hide()
}

function checkUser () {
  var test = false
  var user = jQuery('#entryEmail').val()
  for (var x = 0; x < queueData.length; x++) {
    if (queueData[x].email === user && queueData[x].completed !== 1 && queueData[x].delete !== 1) {
      jQuery('.overlay-warning').fadeIn()
      jQuery('.warning-card-wide').center().fadeIn()
      test = true
    }
  }
  if (test === false) {
    jQuery('.overlay-warning').fadeOut()
    jQuery('.warning-card-wide').fadeIn()
  }
}

function getFormattedDate (offset) {
  var temptime = new Date()
  var time = new Date(temptime.getTime() + offset * 3600000)
  var ftime = ''
  switch (time.getDay()) {
    case 0:
      ftime = 'Sun, '
      break
    case 1:
      ftime = 'Mon, '
      break
    case 2:
      ftime = 'Tue, '
      break
    case 3:
      ftime = 'Wed, '
      break
    case 4:
      ftime = 'Thu, '
      break
    case 5:
      ftime = 'Fri, '
      break
    case 6:
      ftime = 'Sat, '
      break
  }
  var collect = ''
  switch (time.getHours()) {
    case 12:
      ftime += '12'
      collect = 'pm'
      break
    case 13:
      ftime += '1'
      collect = 'pm'
      break
    case 14:
      ftime += '2'
      collect = 'pm'
      break
    case 15:
      ftime += '3'
      collect = 'pm'
      break
    case 16:
      ftime += '4'
      collect = 'pm'
      break
    case 17:
      ftime += '5'
      collect = 'pm'
      break
    case 18:
      ftime += '6'
      collect = 'pm'
      break
    case 19:
      ftime += '7'
      collect = 'pm'
      break
    case 20:
      ftime += '8'
      collect = 'pm'
      break
    case 21:
      ftime += '9'
      collect = 'pm'
      break
    case 22:
      ftime += '10'
      collect = 'pm'
      break
    case 23:
      ftime += '11'
      collect = 'pm'
      break
    case 0:
      ftime += '12'
      collect = 'am'
      break
    default:
      ftime += time.getHours()
      collect = 'am'
  }
  var mins = ('0' + time.getMinutes()).slice(-2)
  ftime += ':' + mins + ' ' + collect
  return ftime
}

function isNormalInteger (str) {
  var n = ~~Number(str)
  return String(n) === str && n >= 0
}

function printReceipt (name, email, file, printer) {
  jQuery('.overlay-receipt').fadeIn()
  jQuery('.receipt-card-wide').center().fadeIn()
  return {'name': name, 'email': email, 'file': file, 'printername': printer}
}

function sendReceipt (receiptInfo) {
  jQuery.post({
    url: 'http://192.168.1.198:5000',
    cache: false,
    data: receiptInfo
  })
}

function sendEmail (name, email) {
  jQuery('.overlay-email').fadeIn()
  jQuery('.email-card-wide').center().fadeIn()
  return {'name': name, 'email': email}
}

function emailAjax (emailInfo) {
  jQuery.post({
    url: 'https://printtracker.lib.vt.edu/sendEmail.php',
    cache: false,
    data: emailInfo
  })
}

function clearFields () {
  jQuery('#entrySpecial').val('No')
  jQuery('#entryMaterial').val('Any')
  jQuery('#entryEmail').val('')
  jQuery('#entryComments').val('')
  jQuery('#entryName').val('')
  jQuery('#entrySupports').val('None')
  jQuery('#entryRafts').val('No')
  jQuery('#entryEMaterial').val('')
  jQuery('#entryETime').val('')
  jQuery('#entryNature').val('')
  jQuery('#entryFile').val('')
  jQuery('#entryNature').parent().hide()
  jQuery('#entryOther').val('')
  jQuery('#warning-email').hide()
  jQuery('#warning-filename').hide()
  jQuery('#warning-name').hide()
  jQuery('#warning-ematerial').hide()
  jQuery('#warning-ematerial-number').hide()
  jQuery('#warning-etime').hide()
  jQuery('#warning-etime-number').hide()
  jQuery('#warning-duplicate').hide()
}

function validateEntry () {
  var fileValid = false
  var nameValid = false
  var etimeValid = false
  var ematerialValid = false
  var emailValid = false

  if (jQuery('#entryFile').val() !== '') {
    fileValid = true
    jQuery('#warning-filename').hide()
  } else {
    jQuery('#warning-filename').show()
  }
  if (jQuery('#entryName').val() !== '') {
    nameValid = true
    jQuery('#warning-name').hide()
  } else {
    jQuery('#warning-name').show()
  }
  if (jQuery('#entryEmail').val() !== '') {
    emailValid = true
    jQuery('#warning-email').hide()
  } else {
    jQuery('#warning-email').show()
  }

  if (jQuery('#entryEMaterial').val() !== '') {
    if (isNormalInteger(jQuery('#entryEMaterial').val()) === true) {
      ematerialValid = true
      jQuery('#warning-material').hide()
      jQuery('#warning-material-number').hide()
    } else {
      jQuery('#warning-material-number').show()
      jQuery('#warning-material').hide()
    }
  } else {
    jQuery('#warning-material-number').hide()
    jQuery('#warning-material').show()
  }

  if (jQuery('#entryETime').val() !== '') {
    if (isNormalInteger(jQuery('#entryETime').val()) === true) {
      etimeValid = true
      jQuery('#warning-time').hide()
      jQuery('#warning-time-number').hide()
    } else {
      jQuery('#warning-time-number').show()
      jQuery('#warning-time').hide()
    }
  } else {
    jQuery('#warning-time-number').hide()
    jQuery('#warning-time').show()
  }

  if (fileValid && nameValid && emailValid && ematerialValid && etimeValid) {
    return true
  } else {
    return false
  }
}

jQuery(document).ready(function () {
  var ID = ''

  getTable()

  jQuery(window).click(function () {
    var testSpecial = jQuery('#entrySpecial').val()
    var testOther = jQuery('#entryMaterial').val()
    if (testSpecial === '1') {
      jQuery('#entryNature').parent().fadeIn()
    } else {
      jQuery('#entryNature').parent().hide()
    }

    if (testOther === 'Other') {
      jQuery('#entryOther').parent().fadeIn()
    } else {
      jQuery('#entryOther').parent().hide()
    }
  })
  jQuery('#entryEmail').focusout(function () {
    checkUser()
  })
})

function getTable () {
  jQuery.ajax({
    url: url + '/?by=id&order=asc',
    cache: false,
    beforeSend: function () {
      jQuery('.mdl-spinner').center().show()
    }
  })
        .done(function (data) {
          jQuery('.mdl-spinner').hide()

          var normal = ''
          var special = ''
          var current = ''
          var archive = ''
          var failed = ''

          for (var x = 0; x < data.length; x++) {
            if (data[x].failed_count === 3 && data[x].delete === 0) {
              failed += "<tr style='cursor: pointer;'><td style='text-align: left;'>" + data[x].id + "</td><td style='text-align: left;'>" + data[x].name + "</td><td style='text-align: left;'>" + data[x].filename + '</td></tr>'
            } else if (data[x].currently_printing === 1 && data[x].completed === 0 && data[x].delete === 0) {
              current += "<tr style='cursor: pointer;'><td style='text-align: left;'>" + data[x].id + "</td><td style='text-align: left;'>" + data[x].name + "</td><td style='text-align: left;'>" + data[x].filename + "</td><td style='text-align: left;'>" + data[x].printer + '</td></tr>'
            } else if (data[x].special_request === 1 && data[x].completed === 0 && data[x].delete === 0) {
              var time = getFormattedDate(data[x].estimated_time)
              special += "<tr style='cursor: pointer;'><td style='text-align: left;'>" + data[x].id + "</td><td style='text-align: left;'>" + data[x].name + "</td><td style='text-align: left;'>" + data[x].filename + "</td><td style='text-align: left;'>" + time + '</td></tr>'
            } else if (data[x].completed === 0 && data[x].delete === 0) {
              var time = getFormattedDate(data[x].estimated_time)
              normal += "<tr style='cursor: pointer;'><td style='text-align: left;'>" + data[x].id + "</td><td style='text-align: left;'>" + data[x].name + "</td><td style='text-align: left;'>" + data[x].filename + "</td><td style='text-align: left;'>" + time + '</td></tr>'
            } else if (data[x].completed === 1 && data[x].delete === 0) {
              archive = "<tr style='cursor: pointer;'><td style='text-align: left;'>" + data[x].id + "</td><td style='text-align: left;'>" + data[x].name + "</td><td style='text-align: left;'>" + data[x].filename + "</td><td style='text-align: left;'>" + data[x].time_completed + '</td></tr>' + archive
            }
          }

          jQuery('#queue-table tbody').html(normal)
          jQuery('#special-table tbody').html(special)
          jQuery('#current-table tbody').html(current)
          jQuery('#archive-table tbody').html(archive)
          jQuery('#failed-table tbody').html(failed)

          updateEntry()
        })

  jQuery(window).click(function () {
    updateEntry()
  })

  jQuery('#cancel-edit').click(function () {
    jQuery('.edit-card-wide').fadeOut()
    jQuery('.overlay').fadeOut()
  })
}

function saveEntry () {
  if (validateEntry()) {
    var save = {
      'completed': 0,
      'special_request': jQuery('#entrySpecial').val(),
      'email': jQuery('#entryEmail').val(),
      'material': jQuery('#entryMaterial').val(),
      'filename': jQuery('#entryFile').val(),
      'comments': jQuery('#entryComments').val(),
      'name': jQuery('#entryName').val(),
      'raft': jQuery('#entryRafts').val(),
      'supports': jQuery('#entrySupports').val(),
      'estimated_grams': jQuery('#entryEMaterial').val(),
      'estimated_time': jQuery('#entryETime').val(),
      'nature_special': jQuery('#entryNature').val(),
      'other': jQuery('#entryOther').val()
    }
    jQuery.post({
      url: url,
      data: save,
      beforeSend: function () {
        jQuery('.mdl-spinner').center().show()
      }
    }).done(function (data) {
      jQuery('.mdl-spinner').hide()
      clearFields()

      getTable()
    })
  }
}

function updateEntry () {
  jQuery('#queue-table tr').not('tr:first').css('cursor', 'pointer')
  jQuery('#queue-table tr').not('tr:first').off('click')
  jQuery('tr').not('#queue-table tr:first').not('#current-table tr:first').not('#special-table tr:first').not('#archive-table tr:first').click(function () {
    ID = jQuery(this).children(':first').text()
    var entryurl = url + '/' + ID
    jQuery.ajax({
      url: entryurl,
      cache: false,
      beforeSend: function () {
        jQuery('.mdl-spinner').center().show()
      }
    })
            .done(function (entry) {
              jQuery('.mdl-spinner').hide()

              jQuery('.overlay').fadeIn()
              jQuery('.edit-card-wide').center().fadeIn()

              jQuery('#entryEmailEdit').val(entry.email)
              jQuery('#entryNameEdit').val(entry.name)
              jQuery('#entryCommentsEdit').val(entry.comments)
              jQuery('#entryFileEdit').val(entry.filename)
              jQuery('#entryETimeEdit').val(entry.estimated_time)
              jQuery('#entryEMaterialEdit').val(entry.estimated_grams)
              jQuery('#entryMaterialEdit').val(entry.material)
              jQuery('#entryRaftsEdit').val(entry.raft)
              jQuery('#entrySupportsEdit').val(entry.supports)
              jQuery('#entrySpecialEdit').val(entry.special_request)
              jQuery('#entryNatureEdit').val(entry.nature_special)
              jQuery('#entryFailedEdit').val(entry.failed_count)
              jQuery('#entryCurrentEdit').val(entry.currently_printing)
              jQuery('#entryPrinterEdit').val(entry.printer)
              jQuery('#entryCompleteEdit').val(entry.completed)
              jQuery('#entryOtherEdit').val(entry.other)

              jQuery('#update-queue').off('click')
              jQuery('#update-queue').click(function () {
                entry.email = jQuery('#entryEmailEdit').val()
                entry.name = jQuery('#entryNameEdit').val()
                entry.comments = jQuery('#entryCommentsEdit').val()
                entry.filename = jQuery('#entryFileEdit').val()
                entry.estimated_time = jQuery('#entryETimeEdit').val()
                entry.estimated_grams = jQuery('#entryEMaterialEdit').val()
                entry.material = jQuery('#entryMaterialEdit').val()
                entry.raft = jQuery('#entryRaftsEdit').val()
                entry.supports = jQuery('#entrySupportsEdit').val()
                entry.special_request = jQuery('#entrySpecialEdit').val()
                entry.nature_special = jQuery('#entryNatureEdit').val()
                entry.currently_printing = jQuery('#entryCurrentEdit').val()
                entry.failed_count = jQuery('#entryFailedEdit').val()
                entry.other = jQuery('#entryOtherEdit').val()
                entry.printer = jQuery('#entryPrinterEdit').val()
                entry.completed = jQuery('#entryCompleteEdit').val()
                entry.delete = jQuery('#entryDeleteEdit').val()
                if (entry.completed === 1) {
                  entry.time_completed = new Date().toISOString().slice(0, 19).replace('T', ' ')
                  sendEmail(entry.name, entry.email)
                }

                if (entry.delete === 1) {
                  entry.delete_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
                }

                if (entry.currently_printing === 1 && entry.completed !== 1) {
                  printReceipt(entry.name, entry.email, entry.filename, entry.printer)
                }

                delete entry.__table
                delete entry.id

                jQuery.ajax({
                  url: url + '/' + ID,
                  type: 'PUT',
                  data: entry,
                  beforeSend: function () {
                    jQuery('.mdl-spinner').center().show()
                  }
                })
                        .success(function () {
                          jQuery('.mdl-spinner').hide()
                          jQuery('.edit-card-wide').fadeOut()
                          jQuery('.overlay').fadeOut()
                        })
                        .done(function () {
                          ID = ''
                          getTable()
                          jQuery('#entryDeleteEdit').val('No')
                        })
              })
            })
  })
}


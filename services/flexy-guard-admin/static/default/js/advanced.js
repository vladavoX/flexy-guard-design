function init() {
  // create the editor
  let container = document.getElementById('jsoneditor')
  let options = {
    mode: 'tree',
    modes: ['code', 'form', 'text', 'tree', 'view']
  }
  let editor = new JSONEditor(container, options)
  let json = JSON.parse($('#rule_json').val())
  let form = $('#form')

  editor.set(json)
  console.log(window.location)

  $('#add-rule').on('click', function () {
    send('/add', {
      comment: form.find('#comment').val(),
      rule_json: JSON.stringify(editor.get())
    })
  })

  $('#update-rule').on('click', function () {
    send('/update', {
      hash: form.find('#hash').val(),
      action: 'update',
      comment: form.find('#comment').val(),
      rule_json: JSON.stringify(editor.get())
    })
  })
}

function send(url, data) {
  console.log(data)
  //   $.ajax({
  //     type: 'POST',
  //     url: url,
  //     data: data
  //   }).done(function (response) {
  //     let parsed = JSON.parse(response)

  //     if (parsed.result === false) {
  //       alert(parsed.message)
  //     } else {
  //       window.location = '/rules/edit/' + '/' + parsed.data
  //     }
  //   })
}

$(document).ready(init)

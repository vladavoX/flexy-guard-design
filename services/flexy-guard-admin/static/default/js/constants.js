function init() {
  setTitle()
  bindRemove()

  $('.js-open-modal').on('click', function () {
    $('#parent-constants-modal').css('display', 'flex')
    $('#constants-modal').css('display', 'flex')

    id = $(this).data('id')
    type = $(this).data('type')
    value = $(this).data('value')

    $('#constant-hash').val(id)
    $('#constant-value').val(value)

    $('.edit-constant').on('click', function () {
      let data = {
        type: type,
        value: $('#constant-value').val()
      }
      $.ajax({
        type: 'PATCH',
        url: '/constants/' + type + '/' + id,
        data: data
      }).done(function (response) {
        window.location.reload()
      })
    })
  })

  $('.js-close-modal').on('click', function () {
    $('#constants-modal').css('display', 'none')
    $('#parent-constants-modal').css('display', 'none')
  })
}

function setTitle() {
  const path = window.location.pathname.split('/')
  if (path[2] === 'currency') return $('#dict-type-name').text('Currency')
  if (path[2] === 'mid') return $('#dict-type-name').text('Merchant ID')
  if (path[2] === 'gw_alias') return $('#dict-type-name').text('Gateway Alias')
  if (path[2] === 'gw_type') return $('#dict-type-name').text('Gateway Type')
}

function bindRemove() {
  $('.js-item-delete').on('click', function () {
    let _this = $(this)
    let type = $('.js-type').val()

    if (confirm('Are you sure you want to delete this item?') === true) {
      $.ajax({
        type: 'DELETE',
        url: '/constants/' + type + '/' + _this.data('id')
      }).done(function () {
        _this.parents('tr').remove()
      })
    }
  })
}

$(document).ready(init)

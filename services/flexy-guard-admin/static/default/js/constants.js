function init() {
  bindRemove()
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

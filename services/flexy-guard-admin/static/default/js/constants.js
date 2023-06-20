function init() {

  $('.js-open-modal-delete').on('click', function () {
    item = $(this)
    id = item.data('id')
    dictTypeName = $('#dict-type-name').text();
    value = item.data('value');

    $('#parent-delete-modal').css('display', 'flex');
    $('#delete-modal').css('display', 'flex')
    $('#delete-modal__name').text(`${dictTypeName}:`) 
    $('#delete-modal__value').text(`'${value}'`)

    $('.js-item-delete').on('click', function () {
      let type = $('.js-type').val();
   
      $.ajax({
        type: 'DELETE',
        url: '/constants/' + type + '/' + id,
      }).done(function () {
        item.parents('tr').remove()
      })
  
      $('#parent-delete-modal').css('display', 'none');
      $('#delete-modal').css('display', 'none')
    })
  })


  setTitle();

  $('.js-open-modal').on('click', function () {
    $('#parent-constants-modal').css('display', 'flex');
    $('#constants-modal').css('display', 'flex');

    id = $(this).data('id');
    type = $(this).data('type');
    value = $(this).data('value');

    $('#constant-hash').val(id);
    $('#constant-value').val(value);

    $('.edit-constant').on('click', function () {
      let data = {
        type: type,
        value: $('#constant-value').val(),
      };
      $.ajax({
        type: 'PATCH',
        url: '/constants/' + type + '/' + id,
        data: data,
      }).done(function (response) {
        window.location.reload();
      });
    });
  });

  $('.js-close-modal').on('click', function () {
    $('#constants-modal').css('display', 'none');
    $('#parent-constants-modal').css('display', 'none');
    $('#delete-modal').css('display', 'none');
    $('#parent-delete-modal').css('display', 'none');
  });

  $('.js-open-modal-new').on('click', function () {
    $('#parent-constants-modal-new').css('display', 'flex');
    $('#add-new-modal').css('display', 'flex');

    let newType = $(this).data('type');
    let newValue = $(this).data('value');
    console.log(newType, newValue);

    $('#constant-value-new').val(newValue);
  });

  $('.add-constant').on('click', function () {
    let newType = $('#constant-type-new').val();
    let data = {
      type: newType,
      value: $('#constant-value-new').val(),
    };
    $.ajax({
      type: 'POST',
      url: '/constants/' + newType,
      data: data,
    }).done(function (response) {
      console.log(newType);
      window.location.reload();
    });
  });

  $('.js-close-modal-new').on('click', function () {
    $('#add-new-modal').css('display', 'none');
    $('#parent-constants-modal-new').css('display', 'none');
  });
}

function setTitle() {
  const path = window.location.pathname.split('/');
  if (path[2] === 'currency') return $('#dict-type-name').text('Currency');
  if (path[2] === 'mid') return $('#dict-type-name').text('Merchant ID');
  if (path[2] === 'gw_alias') return $('#dict-type-name').text('Gateway Alias');
  if (path[2] === 'gw_type') return $('#dict-type-name').text('Gateway Type');
}

$(document).ready(init);

function init() {
  const rules = {
    1: {
      id: '1',
      comment: 'Filtering by counting transaction statuses',
      ruleJson:
        '{"header":{"gateway_currency":"USD","card_brand":"MasterCard"},"body":{"card":{"status":{"count":{"1#approved":[0,4]}}}},"routing":null}'
    },
    2: {
      id: '2',
      comment: 'Incoming amount and alias limit',
      ruleJson:
        '{"header":{"acq_alias":"alias"},"body":{"amount":{"value":[100,70000]}},"routing":null}'
    },
    3: {
      id: '3',
      comment: 'Limit on the number of unique cards per day',
      ruleJson:
        '{"header":{"acq_alias":"alias","gateway_currency":"USD"},"body":{"card":{"count":{"1":[0,5]}}},"routing":null}'
    },
    4: {
      id: '4',
      comment: 'Filter by specific alias and currency',
      ruleJson:
        '{"header":{"acq_alias":"alias","gateway_currency":"USD"},"body":{"card":{"status":{"count":{"1#approved":[0,2]}},"amount":{"value":[1000,20000]}},"bin":{"not_in_country":["US"]}},"routing":null}'
    },
    5: {
      id: '5',
      comment: 'Filter by gateway currency: no more than 1000 cards per day',
      ruleJson:
        '{"header":{"gateway_currency":"USD"},"body":{"card":{"count":{"1":[0,1000]}},"bin":{"not_in_country":["US","IL"]},"ip":{"not_in_ip_country":["US","IL"]}},"routing":null}'
    },
    6: {
      id: '6',
      comment: 'Filter by specific merchant',
      ruleJson:
        '{"header":{"mid":"123"},"body":{"card":{"amount":{"sum":{"30":[0,500000]},"value":[10,10000]}}}}'
    },
    7: {
      id: '7',
      comment: 'Countries blacklist. Card bin block',
      ruleJson:
        '{"header":{"mid":"123"},"body":{"bin":{"not_in_country":["US","CA"]}}}'
    },
    8: {
      id: '8',
      comment: 'Countries whitelist',
      ruleJson:
        '{"header":{"mid":"123"},"body":{"bin":{"in_country":["US","CA"]}}}'
    },
    9: {
      id: '9',
      comment: 'Filter by currency',
      ruleJson:
        '{"header":{"gateway_currency":"USD"},"body":{"ip":{"in_ip_country":["US","IL"]}},"routing":null}'
    },
    10: {
      id: '10',
      comment: 'Limit for a specific merchant and currency',
      ruleJson:
        '{"header":{"mid":"123","currency":"USD"},"body":{"card":{"amount":{"sum":{"1":[0,100000],"30":[0,1500000]}}}}}'
    }
  }

  let id
  let name
  let item

  $('.js-open-modal').on('click', function () {
    item = $(this)
    id = item.data('id')
    name = item.data('name')
    $('#delete-modal').css('display', 'flex')
    $('#delete-modal__name').text(`'${name}'`)
  })

  $('.js-item-delete').on('click', function () {
    let data = {
      hash: id,
      action: 'remove'
    }

    $.ajax({
      type: 'POST',
      url: '/update',
      data: data
    }).done(function () {
      item.parents('tr').remove()
    })

    $('#delete-modal').css('display', 'none')
  })

  $('.js-close-modal').on('click', function () {
    $('#delete-modal').css('display', 'none')
  })

  $('#add-rule').on('click', function () {
    let selectedRule = $('#rules').val()

    let request = $.ajax({
      type: 'GET',
      url: '/rules/' + selectedRule
    })

    request.done(function (response) {
      let parsed = JSON.parse(response)

      let data = {
        comment: parsed.Comment,
        rule_json: parsed.Rule
      }

      $.ajax({
        type: 'POST',
        url: '/add',
        data: data
      }).done(function (response) {
        let parsed = JSON.parse(response)
        window.location = '/rules/edit/' + parsed.data
      })
    })

    request.fail(function (response) {
      let parsed = JSON.parse(response)
      alert(parsed.message)
    })
  })
}

$(document).ready(init)

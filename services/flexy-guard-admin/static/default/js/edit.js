function init() {
  $('.js-open-modal').on('click', function () {
    $('#parent-header-modal').css('display', 'flex')
    $('#header-modal').css('display', 'flex')
  })

  $('.js-close-modal').on('click', function () {
    $('#header-modal').css('display', 'none')
    $('#parent-header-modal').css('display', 'none')
  })

  $('.js-add-header').on('click', function () {
    let selectedHeader = $('#header-field').find(':selected').val()
    let fieldName = $('#header-name').val()
    $('.right')
      .children()
      .first()
      .after(
        `
          <div class="row form-group">
            <div>
              <label for=${selectedHeader}>
              ${
                selectedHeader === 'acq_alias'
                  ? 'Acquirer Alias'
                  : selectedHeader === 'acq_id'
                  ? 'Acquirer ID'
                  : selectedHeader === 'mid'
                  ? 'MID'
                  : selectedHeader === 'gateway_currency'
                  ? 'Gateway Currency'
                  : selectedHeader === 'currency'
                  ? 'Currency'
                  : 'Card Brand'
              }
              </label>
              <div class="header-input-row">
                <input
                  name="acq_alias"
                  class="form-control form-control-sm"
                  id=${selectedHeader}
                  placeholder=""
                  value="${fieldName}"
                />
                <div class="js-header-delete">
                  Delete
                </div>
              </div>
            </div>
          </div>
        `
      )

    $('#header-modal').css('display', 'none')
    $('#parent-header-modal').css('display', 'none')

    $(document).ready(init)
  })

  $('.js-header-delete').on('click', function () {
    $(this).closest('.row').remove()
  })

  $('.js-item-delete').on('click', function () {
    $(this).closest('.js-route-row').remove()
  })

  $('.js-item-save').on('click', function (e) {
    e.preventDefault()

    let form = $(this).parents('form')
    let header = {}
    let body = {}
    let routing = {}

    // TODO: compare min and max
    if (
      valuesIsNotEmpty(
        form.find('#card_approved-min').val(),
        form.find('#card-approved-max').val()
      )
    ) {
      body.card = {}

      body.card.status = {
        count: {
          '1#approved': [
            parseInt(form.find('#card-approved-min').val()),
            parseInt(form.find('#card-approved-max').val())
          ]
        }
      }
    }

    // TODO: compare min and max
    if (
      valuesIsNotEmpty(
        form.find('#card-count-min').val(),
        form.find('#card-count-max').val()
      )
    ) {
      if (body.card === undefined) {
        body.card = {}
      }

      body.card.count = {
        1: [
          parseInt(form.find('#card-count-min').val()),
          parseInt(form.find('#card-count-max').val())
        ]
      }
    }

    if (
      valuesIsNotEmpty(
        form.find('#card-amount-daily-min').val(),
        form.find('#card-amount-daily-max').val()
      )
    ) {
      if (body.card === undefined) {
        body.card = {}
      }

      if (body.card.amount === undefined) {
        body.card.amount = {}
      }

      if (body.card.amount.sum === undefined) {
        body.card.amount.sum = {}
      }

      body.card.amount.sum['1'] = [
        parseInt(form.find('#card-amount-daily-min').val()),
        parseInt(form.find('#card-amount-daily-max').val())
      ]
    }

    if (
      valuesIsNotEmpty(
        form.find('#card-amount-weekly-min').val(),
        form.find('#card-amount-weekly-max').val()
      )
    ) {
      if (body.card === undefined) {
        body.card = {}
      }

      if (body.card.amount === undefined) {
        body.card.amount = {}
      }

      if (body.card.amount.sum === undefined) {
        body.card.amount.sum = {}
      }

      body.card.amount.sum['7'] = [
        parseInt(form.find('#card-amount-weekly-min').val()),
        parseInt(form.find('#card-amount-weekly-max').val())
      ]
    }

    if (
      valuesIsNotEmpty(
        form.find('#card-amount-monthly-min').val(),
        form.find('#card-amount-monthly-max').val()
      )
    ) {
      if (body.card === undefined) {
        body.card = {}
      }

      if (body.card.amount === undefined) {
        body.card.amount = {}
      }

      if (body.card.amount.sum === undefined) {
        body.card.amount.sum = {}
      }

      body.card.amount.sum['30'] = [
        parseInt(form.find('#card-amount-monthly-min').val()),
        parseInt(form.find('#card-amount-monthly-max').val())
      ]
    }

    if (
      valuesIsNotEmpty(
        form.find('#card-amount-yearly-min').val(),
        form.find('#card-amount-yearly-max').val()
      )
    ) {
      if (body.card === undefined) {
        body.card = {}
      }

      if (body.card.amount === undefined) {
        body.card.amount = {}
      }

      if (body.card.amount.sum === undefined) {
        body.card.amount.sum = {}
      }

      body.card.amount.sum['365'] = [
        parseInt(form.find('#card-amount-yearly-min').val()),
        parseInt(form.find('#card-amount-yearly-max').val())
      ]
    }

    if (
      valuesIsNotEmpty(
        form.find('#card-amount-min').val(),
        form.find('#card-amount-max').val()
      )
    ) {
      if (body.card === undefined) {
        body.card = {}
      }

      if (body.card.amount === undefined) {
        body.card.amount = {}
      }

      body.card.amount.value = [
        parseInt(form.find('#card-amount-min').val()),
        parseInt(form.find('#card-amount-max').val())
      ]
    }

    if (
      valuesIsNotEmpty(
        form.find('#trx-amount-min').val(),
        form.find('#trx-amount-max').val()
      )
    ) {
      body.amount = {}
      body.amount.value = {}

      body.amount.value = [
        parseInt(form.find('#trx-amount-min').val()),
        parseInt(form.find('#trx-amount-max').val())
      ]
    }

    if (form.find('#bin-not-in-country').val() !== undefined) {
      if (body.bin === undefined) {
        body.bin = {}
      }

      body.bin.not_in_country = form
        .find('#bin-not-in-country')
        .val()
        .split('\n')
    }

    if (form.find('#bin-in-country').val() !== undefined) {
      if (body.bin === undefined) {
        body.bin = {}
      }

      body.bin.in_country = form.find('#bin-in-country').val().split('\n')
    }

    if (form.find('#ip-not-in-country').val() !== undefined) {
      if (body.ip === undefined) {
        body.ip = {}
      }

      body.ip.not_in_ip_country = form
        .find('#ip-not-in-country')
        .val()
        .split('\n')
    }

    if (form.find('#ip-in-country').val() !== undefined) {
      if (body.ip === undefined) {
        body.ip = {}
      }

      body.ip.in_ip_country = form.find('#ip-in-country').val().split('\n')
    }

    // HEADER
    let mid = form.find('#mid').val()
    if (mid !== undefined && mid !== '') {
      let midArr = mid.split('-')
      header.mid = midArr[0].trim()
    }

    let aalias = form.find('#acq-alias').val()
    if (aalias !== undefined && aalias !== '') {
      header.acq_alias = aalias
    }

    let aid = form.find('#acq-id').val()
    if (aid !== undefined && aid !== '') {
      header.acq_id = aid
    }

    let gwcurrency = form.find('#gateway-currency').val()
    if (gwcurrency !== undefined && gwcurrency !== '') {
      header.gateway_currency = gwcurrency
    }

    let currency = form.find('#currency').val()
    if (currency !== undefined && currency !== '') {
      header.currency = currency
    }

    let cbrand = form.find('#card-brand').val()
    if (cbrand !== undefined && cbrand !== '') {
      header.card_brand = cbrand
    }

    let descr = form.find('#description').val()
    if (descr !== undefined && descr !== '') {
      header.card_brand = descr
    }

    // ROUTING
    $('.js-route-row').each(function () {
      let routeItem = $(this).find('.js-route-item').val()
      let gwItem = $(this).find('.js-gw-item').val()

      if (gwItem !== '') {
        routing[routeItem] = { acq_alias: gwItem }
      }
    })

    let data = {
      hash: form.find('#hash').val(),
      action: 'update',
      comment: form.find('#comment').val(),
      rule_json: JSON.stringify({
        header: header,
        body: body,
        routing: routing
      })
    }

    console.log(data)
    console.log({
      header: header,
      body: body,
      routing: routing
    })

    $.ajax({
      type: 'POST',
      url: '/update',
      data: data
    }).done(function (response) {
      let parsed = JSON.parse(response)

      if (parsed.result === false) {
        alert(parsed.message)
      } else {
        window.location = '/rules/edit/' + parsed.data
      }
    })
  })
}

function valuesIsNotEmpty(min, max) {
  min = parseInt(min)
  max = parseInt(max)

  return (!isNaN(min) && min !== 0) || (!isNaN(max) && max !== 0)
}

$(document).ready(init)

function init() {

  let body = rule.body
  let card_array = Object.entries(body.card)

  // CARD-SETTINGS
  $('.card-subgroups').append(`
  ${card_array
      .filter((card) => card[0] === 'count' || card[0] === 'amount')
      .sort((a, b) => {
          if (a[0] === 'count') {
              return -1;
          } else if (b[0] === 'count') {
              return 1;
          } else {
              return 0;
          }
      })
      .map((card) => {
          if (card[0] === 'count') {
              return `
                  <div class="btn-with-heading">
                      <h6 class="body-large custom-heading">Card Count Limit</h6>
                      <img id="pen" src="../../assets/icons/pen.svg" />
                  </div>
                  ${Object.keys(card[1]).map((key) => `
                      <div class="row">
                          <div>
                              <label for="card-count-min-${key}">Min</label>
                              <input
                                  type="text"
                                  id="card-count-min-${key}"
                                  class="form-control"
                                  value="${card[1][key][0]}"
                              />
                          </div>
                          <div>
                              <label for="card-count-max-${key}">Max</label>
                              <input
                                  type="text"
                                  id="card-count-max-${key}"
                                  class="form-control"
                                  value="${card[1][key][1]}"
                              />
                          </div>
                      </div>
                  `).join('')}
              `;
          } else {
            let sumObj = card[1].sum
            let valueObj = card[1].value
            
            return `
                <div class="btn-with-heading">
                    <h6 class="body-large custom-heading">Card Amount Limit</h6>
                    <img id="pen" src="../../assets/icons/pen.svg" />
                </div>
                ${Object.keys(sumObj).map((key) => `
                    <h6 class="heading-smallest">
                      ${key === '1' ? 'Daily Limit'
                      : key === '7' ? 'Weekly Limit'
                      : key === '30'? 'Monthly Limit'
                      : key === '365' ? 'Yearly Limit' : ''
                    }
                    </h6>
                    <div class="row">
                        <div>
                            <label for="card-amount-min-${key}">Min</label>
                            <input
                                type="text"
                                id="card-amount-min-${key}"
                                class="form-control"
                                value="${sumObj[key][0]}"
                            />
                        </div>
                        <div>
                            <label for="card-amount-max-${key}">Max</label>
                            <input
                                type="text"
                                id="card-amount-max-${key}"
                                class="form-control"
                                value="${sumObj[key][1]}"
                            />
                        </div>
                    </div>
                `).join('')}
                <h6 class="heading-smallest">Value Limits</h6>
                <div class="row">
                <div>
                  <label for="card-value-min">Min</label>
                  <input
                    type="text"
                    id="card-value-min"
                    class="form-control"
                    value="${valueObj[0]}"
                  />
                </div>
                <div>
                  <label for="card-value-max">Max</label>
                  <input
                    type="text"
                    id="card-value-max"
                    class="form-control"
                    value="${valueObj[1]}"
                  />
                </div>
              </div>
            `;
          }
      })
      .join('')}
`);

  // BIN
  let bin_array = Object.entries(body.bin)
  $('.bin-subgroups').append(
    `
      ${bin_array
        .map((bin) => {
          if (
            bin[0] === 'in_country' ||
            bin[0] === 'not_in_country' ||
            bin[0] === 'not_in_ip_country' ||
            bin[0] === 'in_ip_country'
          ) {
            return `
      <div class="row">
        <div>
          <div class="btn-with-heading">
            <h6 class="body-large custom-heading">
              ${
                bin[0] === 'in_country'
                  ? 'In Country'
                  : bin[0] === 'not_in_country'
                  ? 'Not In Country'
                  : bin[0] === 'not_in_ip_country'
                  ? 'Not In IP Country'
                  : 'In IP Country'
              }
            </h6>
            <img
              id="pen"
              src="../../assets/icons/pen.svg"
            />
          </div>
          <textarea
            id="bin-not-in-country"
            class="form-control custom-textarea"
          >
            ${bin[1]
              .map((country) => country)
              .filter((c) => c)
              .join('\n')}
          </textarea>
        </div>
      </div>
    `
          }
        })
        .filter((block) => block)
        .join('')}

    `
  )

  // HEADER
  let header = rule.header
  let header_array = Object.entries(header)
  $('.header-group').append(`
        ${header_array.map(([key, value]) => {
          let inputElement = `
      <input
        class="form-control form-control-sm"
        placeholder=""
        id=${key}
        name="${key}" value="${value}"
      />
    `;

    if (key === 'mid') {
      inputElement = `
        <input
          class="form-control form-control-sm"
          placeholder=""
          id="${key}"
          name="${key}"
          placeholder=""
          value="{{ mid_list[mid] }}"
          list="mid_list"
        />
        <datalist id="mid_list">
          {% for item in const_list['mid'] %}
          <option value="{{ item }}">{{ item }}</option>
          {% endfor %}
        </datalist>
      `;
    } else if (key === 'gw_currencies') {
      inputElement = `
        <input
          name="gw_currencies"
          list="gw_currencies_list"
          class="form-control form-control-sm"
          id="gw_currencies"
          placeholder=""
          value="{{ gw_currencies_list[gw_currencies] }}"
        />
        <datalist id="gw_currencies_list">
          {% for item in const_list['gw_currencies'] %}
          <option value="{{ item }}">{{ item }}</option>
          {% endfor %}
        </datalist>
      `;
    } else if (key === 'currencies') {
      inputElement = `
        <input
          name="gateway_currency"
          list="currencies"
          class="form-control form-control-sm"
          id="currency"
          placeholder=""
          value="{{ currencies[currency] }}"
        />
        <datalist id="currencies">
          {% for item in const_list['currency'] %}
          <option value="{{ item }}">{{ item }}</option>
          {% endfor %}
        </datalist>
      `;
    } else if (key === 'card_brand') {
      inputElement = `
        <input
          name="card_brand"
          list="card_brands"
          class="form-control form-control-sm"
          id="card_brand"
          placeholder=""
          value="{{ card_brand }}"
        />
        <datalist id="card_brands">
          <option>MasterCard</option>
          <option>VISA</option>
        </datalist>
      `;
    }
          return `
            <div>
              <label for=${key}>${
                key === 'acq_alias'
                  ? 'Acquirer Alias'
                  : key === 'acq_id'
                  ? 'Acquirer ID'
                  : key === 'mid'
                  ? 'MID'
                  : key === 'gateway_currency'
                  ? 'Gateway Currency'
                  : key === 'currency'
                  ? 'Currency'
                  : 'Card Brand'
              }</label>
              <div class="header-input-row">
          ${inputElement}
          <div class="js-header-delete">
            <img src="../../assets/icons/delete_purple.svg" />
          </div>
        </div>
          `
        }).filter((block) => block)
        .join('')}
  `)


  $('.js-open-modal-router').on('click', function () {
    $('#parent-router-modal').css('display', 'flex')
    $('#router-modal').css('display', 'flex')
  })

  $('.js-open-modal').on('click', function () {
    $('#parent-header-modal').css('display', 'flex')
    $('#header-modal').css('display', 'flex')
  })

  $('.js-close-modal').on('click', function () {
    $('#header-modal').css('display', 'none')
    $('#parent-header-modal').css('display', 'none')
  })

  $('.js-close-router-modal').on('click', function () {
    $('#router-modal').css('display', 'none')
    $('#parent-router-modal').css('display', 'none')
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
                src="../../assets/icons/delete_purple.svg"
                </div>
              </div>
            </div>
          </div>
        `
      )

    $('#header-modal').css('display', 'none')
    $('#parent-header-modal').css('display', 'none')

    $('#header-field').val('')
    $('#header-name').val('')
  })

  $('.js-add-router').on('click', function () {
    let fieldName = $('#router-name').val()
  })

  $('.js-open-edit-modal').on('click', function () {
    $('#parent-edit-modal').css('display', 'flex')
    $('#edit-modal').css('display', 'flex')
  })

  $('.js-close-edit-modal').on('click', function () {
    $('#edit-modal').css('display', 'none')
    $('#parent-edit-modal').css('display', 'none')
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
;('{"header":{"acq_id":"1234","currency":"USD"},"body":{"card":{"count":{"1":[10,710]},"amount":{"sum":{"1":[0,300000],"30":[0,500000]},"value":[10,10000]}},"bin":{"not_in_country":["                  US","CA"]}},"routing":{}}')

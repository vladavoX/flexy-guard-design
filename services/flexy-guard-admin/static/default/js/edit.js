function init() {
  createPage(rule)

  function createPage(rule) {
    let body = rule.body
    let card_array = Object.entries(body.card)
    // CARD-SETTINGS
    $('.card-subgroups').html(`
    ${card_array
      .filter((card) => card[0] === 'count' || card[0] === 'amount')
      .sort((a, b) => {
        if (a[0] === 'count') {
          return -1
        } else if (b[0] === 'count') {
          return 1
        } else {
          return 0
        }
      })
      .map((card) => {
        if (card[0] === 'status') {
          return `
            <h6 class="body-large custom-heading">
              Card status count approved
            </h6>
            <div class="row">
              <div>
                <label for="card-approved-min">Min</label>
                <input
                  type="text"
                  id="card-approved-min"
                  class="form-control js-card-status-count-min"
                  value="${Object.entries(card[1])[0][1][0]}
                />
              </div>
              <div>
                <label for="card-approved-max">Max</label>
                <input
                  type="text"
                  id="card-approved-max"
                  class="form-control js-card-status-count-max"
                  value="${Object.entries(card[1])[0][1][1]}
                />
              </div>
            </div>
          `
        }
        if (card[0] === 'count') {
          return `
            <div class="btn-with-heading">
              <h6 class="body-large custom-heading">Card Count Limit</h6>
            </div>
            <div class="row">
              <div>
                <label for="card-count-min">Min</label>
                <input
                  type="text"
                  id="card-count-min"
                  class="form-control"
                  value="${Object.entries(card[1])[0][1][0]}"
                />
              </div>
              <div>
                <label for="card-count-max">Max</label>
                <input
                  type="text"
                  id="card-count-max"
                  class="form-control"
                  value="${Object.entries(card[1])[0][1][1]}"
                />
              </div>
            </div>
            <div class="btn-with-heading">
              <h6 class="body-large custom-heading">
              Card Amount Limit
              <button
                id="add-field-btn"
                type="button"
                class="btn btn-primary js-open-amount-bin"
                >Add Field</button
              >
              </h6>

            </div>
          `
        }
        if (card[0] === 'amount') {
          return `
            ${Object.entries(Object.entries(card[1].sum))
              .map(
                (sum) => `
              <h6 class="heading-smallest">${
                sum[1][0] === '1'
                  ? 'Daily Limit'
                  : sum[1][0] === '7'
                  ? 'Weekly Limit'
                  : sum[1][0] === '30'
                  ? 'Monthly Limit'
                  : 'Yearly Limit'
              }</h6>
              <div class="row amount-row">
                <div>
                  <label for="card-amount-${
                    sum[1][0] === '1'
                      ? 'daily'
                      : sum[1][0] === '7'
                      ? 'weekly'
                      : sum[1][0] === '30'
                      ? 'monthly'
                      : 'yearly'
                  }-min">Min</label>
                  <input
                    type="text"
                    id="card-amount-${
                      sum[1][0] === '1'
                        ? 'daily'
                        : sum[1][0] === '7'
                        ? 'weekly'
                        : sum[1][0] === '30'
                        ? 'monthly'
                        : 'yearly'
                    }-min"
                    class="form-control"
                    value="${sum[1][1][0]}"
                  />
                </div>
                <div>
                  <label for="card-amount-${
                    sum[1][0] === '1'
                      ? 'daily'
                      : sum[1][0] === '7'
                      ? 'weekly'
                      : sum[1][0] === '30'
                      ? 'monthly'
                      : 'yearly'
                  }-max">Max</label>
                  <div class='flex-row'>
                    <input
                      type="text"
                      id="card-amount-${
                        sum[1][0] === '1'
                          ? 'daily'
                          : sum[1][0] === '7'
                          ? 'weekly'
                          : sum[1][0] === '30'
                          ? 'monthly'
                          : 'yearly'
                      }-max"
                      class="form-control"
                      value="${sum[1][1][1]}"
                    />
                    <div class="js-amount-delete">
                      <img src="../../assets/icons/delete_purple.svg" />
                    </div>
                  </div>
                </div>

              </div>
            `
              )
              .join('')}
              ${
                card[1].value
                  ? `
                    <h6 class="heading-smallest">Value limits</h6>
                    <div class="row">
                      <div>
                        <label for="card-amount-min">Min</label>
                        <input
                          type="text"
                          id="card-amount-min"
                          class="form-control"
                          value="${card[1].value[0]}"
                        />
                      </div>
                      <div>
                        <label for="card-amount-max">Max</label>
                        <input
                          type="text"
                          id="card-amount-max"
                          class="form-control"
                          value="${card[1].value[1]}"
                        />
                      </div>
                    </div>
              `
                  : ''
              }
            
          `
        }
      })
      .join('')}
  `)

    // BIN
    let bin_array = []
    if (body.bin) bin_array = Object.entries(body.bin)
    $('.bin-group').html(
      `
        ${bin_array
          .map((bin) => {
            if (bin[0] === 'in_country' || bin[0] === 'not_in_country') {
              return `
        <div class="row">
          <div>
            <div class="btn-with-heading">
              <h6 class="body-large custom-heading">
                ${bin[0] === 'in_country' ? 'In Country' : 'Not In Country'}
              </h6>
            </div>
            <div class="bin-row">
            <textarea
              ${
                bin[0] === 'in_country'
                  ? 'id="bin-in-country"'
                  : 'id="bin-not-in-country"'
              }
              class="form-control custom-textarea"
            >
              ${bin[1].map((country) => country.replace(/\s/g, '')).join('\n')}
            </textarea>
                <div class="js-bin-delete" style="margin-left: 20px;">
                    <img src="../../assets/icons/delete_purple.svg" />
                </div>
            </div>
          </div>
        </div>
      `
            }
          })
          .join('')}
  
      `
    )

    // IP
    let ip_array = []
    if (body.ip) ip_array = Object.entries(body.ip)
    $('.ip-group').html(
      `
        ${ip_array
          .map((ip) => {
            if (ip[0] === 'in_ip_country' || ip[0] === 'not_in_ip_country') {
              return `
        <div class="row">
          <div>
            <div class="btn-with-heading">
              <h6 class="body-large custom-heading">
                ${
                  ip[0] === 'in_ip_country'
                    ? 'In IP Country'
                    : 'Not In IP Country'
                }
              </h6>
            </div>
            <div class="bin-row">
            <textarea
              ${
                ip[0] === 'in_ip_country'
                  ? 'id="in-ip-country"'
                  : 'id="not-in-ip-country"'
              }
              class="form-control custom-textarea"
            >
              ${ip[1].map((ip) => ip.replace(/\s/g, '')).join('\n')}
            </textarea>
                <div class="js-bin-delete" style="margin-left: 20px;">
                    <img src="../../assets/icons/delete_purple.svg" />
                </div>
            </div>
          </div>
        </div>
      `
            }
          })
          .join('')}
  
      `
    )

    // HEADER
    let header = rule.header
    let header_array = Object.entries(header)
    let const_list_array = Object.entries(const_list)
    let mid_list_array = Object.entries(mid_list)
    $('.header-group').html(`
      ${header_array
        .map(([key, value]) => {
          let inputElement = `
            <input
              class="form-control form-control-sm"
              placeholder=""
              id=${key}
              name="${key}" value="${value}"
            />
          `
          if (key === 'mid') {
            inputElement = `
              <input
                name="mid"
                list="mid_list"
                class="form-control form-control-sm"
                id="mid"
                placeholder=""
                value="${value}"
              />
              <datalist id="mid_list">
                ${mid_list_array
                  .map((mid) => {
                    return `
                    <div>
                      <option value="${mid[1]}">${mid[1]}</option>
                    </div>
                  `
                  })
                  .join('')}
              </datalist>
            `
          }
          if (key === 'acq_alias') {
            inputElement = `
              <input
                name="acq_alias"
                id="acq-alias"
                class="form-control form-control-sm"
                placeholder=""
                value="${value}"
              />
            `
          }
          if (key === 'acq_id') {
            inputElement = `
              <input
                name="acq_id"
                id="acq-id"
                class="form-control form-control-sm"
                placeholder=""
                value="${value}"
              />
            `
          }
          if (key === 'gateway_currency') {
            inputElement = `
              <input
                name="gateway_currency"
                list="gw_currencies"
                class="form-control form-control-sm"
                id="gateway-currency"
                placeholder=""
                value="${value}"
              />
              <datalist id="gw_currencies">
                ${const_list_array
                  .filter((const_list) => const_list[0] === 'currency')
                  .map((const_list) => {
                    return `
                    <div>
                      <option value="${const_list[1]}">${const_list[1]}</option>
                    </div>
                  `
                  })
                  .join('')}
              </datalist>
            `
          }
          if (key === 'currency') {
            inputElement = `
              <input
                name="gateway_currency"
                list="currencies"
                class="form-control form-control-sm"
                id="currency"
                placeholder=""
                value="${value}"
              />
              <datalist id="currencies">
                ${const_list_array
                  .filter((const_list) => const_list[0] === 'currency')
                  .map((const_list) => {
                    return `
                    <div>
                      <option value="${const_list[1]}">${const_list[1]}</option>
                    </div>
                  `
                  })
                  .join('')}
              </datalist>
            `
          }
          if (key === 'card_brand') {
            inputElement = `
              <input
                name="card_brand"
                list="card_brands"
                class="form-control form-control-sm"
                id="card-brand"
                placeholder=""
                value="${value}"
              />
              <datalist id="card_brands">
                <option>MasterCard</option>
                <option>VISA</option>
              </datalist>
            `
          }
          return `
            <div>
                <label for=${key}>
                ${
                  key === 'acq_alias'
                    ? 'Acquirer Alias'
                    : key === 'acq_id'
                    ? 'Acquirer ID'
                    : key === 'mid'
                    ? 'Mearchant ID'
                    : key === 'gateway_currency'
                    ? 'Gateway Currency'
                    : key === 'currency'
                    ? 'Currency'
                    : 'Card Brand'
                }
                </label>
                <div class="header-input-row">
                  ${inputElement}
                  <div class="js-header-delete">
                    <img src="../../assets/icons/delete_purple.svg" />
                  </div>
               </div> 
            </div>
            `
        })
        .filter((block) => block)
        .join('')}
    `)

    // ROUTER
    let available_routing_array = Object.entries(available_routing)
    let gw_list_array = Object.entries(gateways_list)
    $('.router-group').html(`
  ${available_routing_array
    .map((av_r) => {
      return `
      <div class="row js-route-row row-item">
        <div>
          <input
            type="text"
            value="${av_r[1]}"
            class="form-control js-route-item"
            readonly
          />
        </div>
        <div>
          <select class="form-control js-gw-item">
            <option value="">Select Gateway Alias</option>
            ${gw_list_array
              .map((gw) => {
                if (gw[1] === routing[av_r[1]]) {
                  return `
                  <option value="${gw[1]}" selected>${gw[1]}</option>
                `
                } else {
                  return `
                  <option value="${gw[1]}">${gw[1]}</option>
                `
                }
              })
              .join('')}
          </select>
        </div>
      </div>
    \n`
    })
    .join('')}
  `)
  }

  $('.js-open-modal-bin').on('click', function () {
    $('#parent-bin-modal').css('display', 'flex')
    $('#bin-modal').css('display', 'flex')
  })

  $('.js-open-amount-bin').on('click', function () {
    $('#parent-amount-modal').css('display', 'flex')
    $('#amount-modal').css('display', 'flex')
  })

  $('.js-open-modal').on('click', function () {
    $('#parent-header-modal').css('display', 'flex')
    $('#header-modal').css('display', 'flex')
  })

  $('.js-close-modal').on('click', function () {
    $('#header-modal').css('display', 'none')
    $('#parent-header-modal').css('display', 'none')
    $('#bin-modal').css('display', 'none')
    $('#parent-bin-modal').css('display', 'none')
    $('#amount-modal').css('display', 'none')
    $('#parent-amount-modal').css('display', 'none')
  })

  $('.js-add-header').on('click', function () {
    let fieldName = $('#header-name').val()
    let selectedHeader = $('.header-select').find(':selected').val()

    let newRule = rule
    if (!newRule.header) {
      newRule.header = {}
    }
    newRule.header[selectedHeader] = fieldName
    $('#header-modal').css('display', 'none')
    $('#parent-header-modal').css('display', 'none')
    createPage(newRule)
  })

  $('.js-add-bin').on('click', function () {
    let selectedBin = $('.bin-select').find(':selected').val()
    let newRule = rule
    if (!newRule.body.bin) {
      newRule.body.bin = {}
    }
    newRule.body.bin[selectedBin] = []
    $('#bin-modal').css('display', 'none')
    $('#parent-bin-modal').css('display', 'none')
    createPage(newRule)
  })

  $('.js-add-amount').on('click', function () {
    let selectedAmount = $('.amount-select').find(':selected').val()
    let newRule = rule
    if (!newRule.body.card.amount.sum) {
      newRule.body.card.amount.sum = {}
    }
    newRule.body.card.amount.sum[selectedAmount] = [0, 0]
    $('#amount-modal').css('display', 'none')
    $('#parent-amount-modal').css('display', 'none')
    createPage(newRule)
  })

  $('.js-header-delete').on('click', function () {
    let newRule = rule
    let headerName = $(this).parent().parent().find('label').attr('for')
    delete newRule.header[headerName]
    createPage(newRule)
  })

  $('.js-bin-delete').on('click', function () {
    let newRule = rule
    let binName = $(this).parent().find('textarea').attr('id')
    binName.includes('bin-in-country') ? delete newRule.body.bin.in_country : ''
    binName.includes('bin-not-in-country')
      ? delete newRule.body.bin.not_in_country
      : ''
    binName.includes('ip-in-country')
      ? delete newRule.body.bin.in_ip_country
      : ''
    binName.includes('ip-not-in-country')
      ? delete newRule.body.bin.not_in_ip_country
      : ''

    createPage(newRule)
  })

  $('.js-amount-delete').on('click', function () {
    let newRule = rule
    let amountName = $(this).parent().find('input').attr('id')
    amountName.includes('daily') ? delete newRule.body.card.amount.sum['1'] : ''
    amountName.includes('weekly')
      ? delete newRule.body.card.amount.sum['7']
      : ''
    amountName.includes('monthly')
      ? delete newRule.body.card.amount.sum['30']
      : ''
    amountName.includes('yearly')
      ? delete newRule.body.card.amount.sum['365']
      : ''

    createPage(newRule)
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
      console.log(body)
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

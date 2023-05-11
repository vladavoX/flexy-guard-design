function createChart() {
  const data = [3244, 3781, 2698, 3179]
  const percentages = data.map((value) => (value / Math.max(...data)) * 100)
  const bars = document.querySelectorAll('.bars-bar')
  const labels = document.querySelectorAll('.bars-label')
  labels.forEach((label, index) => {
    label.innerHTML = `${data[index]} visits`
  })
  bars.forEach((bar, index) => {
    bar.style.height = `${percentages[index]}%`
  })
}

createChart()

function createGraph() {
  var CurvedChart = function (target, data, options) {
    this.jq = $(target)
    this.options = options || {}

    this.data = data || []
    this.val = { min: this.options.min, max: this.options.max, count: 0 }

    var canvas = this.jq.get(0)
    var ctx = canvas.getContext('2d')

    this.prepareData = function () {
      for (var i in this.data) {
        if (!this.data[i]) continue

        if (this.data[i].values.length > this.val.count)
          this.val.count = this.data[i].values.length

        for (var j = 0; j < this.data[i].values.length; j++) {
          if (typeof this.data[i].values[j] !== 'number')
            this.data[i].values[j] = 0

          if (typeof this.val.max !== 'number')
            this.val.max = this.data[i].values[j]
          else if (this.data[i].values[j] > this.val.max)
            this.val.max = this.data[i].values[j]

          if (typeof this.val.min !== 'number')
            this.val.min = this.data[i].values[j]
          else if (this.data[i].values[j] < this.val.min)
            this.val.min = this.data[i].values[j]
        }
      }
    }

    this.render = function () {
      var xStep = canvas.width / this.val.count
      var range = this.val.max - this.val.min
      var chartHeight =
        canvas.height *
        (typeof this.options.scale === 'number' ? this.options.scale : 0.8)

      for (var i in this.data) {
        if (!this.data) continue
        ctx.fillStyle = this.data[i].color
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        var left = xStep / 2
        var points = []
        for (var j = 0; j < this.val.count; j++) {
          var value = this.data[i].values[j] - this.val.min
          var h = canvas.height - (value * chartHeight) / range

          if (j === 0) ctx.lineTo(0, h)
          // ctx.lineTo(left, h);

          // ctx.bezierCurveTo(150, 100, 150, 200, 200, 200);
          var point = { x: 0, y: h }
          if (points.length > 0) {
            point = points[points.length - 1]
          }
          var d = 2.2
          ctx.bezierCurveTo(
            point.x + xStep / d,
            point.y,
            left - xStep / d,
            h,
            left,
            h
          )

          if (j === this.val.count - 1) ctx.lineTo(canvas.width, h)

          points.push({ x: left, y: h })

          left += xStep
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = this.options.textColor ? this.options.textColor : '#fff'
        ctx.font = this.options.font ? this.options.font : '100 7pt sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        for (var k = 0; k < this.val.count; k++) {
          var text = this.options.labelFormatter(k)
          ctx.fillText(text, points[k].x, canvas.height - 10)
        }
      }
    }

    this.prepareData()
    this.render()
  }

  // create Chart
  var data = [
    {
      color: 'rgba(0,0,0,0.3)',
      label: 'Data 1',
      values: [160, 260, 153, 112, 148]
    }
  ]

  var chart = new CurvedChart('#chart', data, {
    labelFormatter: function (index) {
      // get month name starting from January this year until current month
      var months = []
      var date = new Date()
      for (var i = 0; i <= date.getMonth(); i++) {
        months.push(
          new Date(date.getFullYear(), i, 1).toLocaleString('en-us', {
            month: 'short'
          })
        )
      }

      return months[index]
    },
    font: '100 7pt sans-serif',
    textColor: '#fff',
    legend: {
      font: '100 8pt sans-serif',
      textColor: '#fff',
      top: 17,
      right: 15,
      row: 17,
      point: 12
    },
    scale: 0.8,
    min: 3
  })
}

createGraph()

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
  const values = [160, 260, 153, 112, 148]
  const canvasHeight = 281 // Desired height of the canvas

  var c = document.getElementById('myCanvas')
  var ctx = c.getContext('2d')

  // Calculate the scaling factor based on the maximum value and the canvas height
  var maxValue = Math.max(...values)
  var scalingFactor = canvasHeight / maxValue

  // Set the canvas size based on the scaling factor
  c.width = c.parentElement.clientWidth
  c.height = canvasHeight

  ctx.beginPath()
  ctx.moveTo(0, values[0] * scalingFactor) // Start point

  // Creating the scaled bezier curves based on the values
  for (var i = 1; i < values.length - 1; i++) {
    var controlX = i * (c.width / (values.length - 1)) // X-coordinate of the control point
    var controlY = values[i] * scalingFactor // Scaled Y-coordinate of the control point
    var endX = (i + 1) * (c.width / (values.length - 1)) // X-coordinate of the end point
    var endY = values[i + 1] * scalingFactor // Scaled Y-coordinate of the end point

    ctx.bezierCurveTo(controlX, controlY, controlX, controlY, endX, endY)
  }

  ctx.stroke() // Draw the scaled path
}

createGraph()

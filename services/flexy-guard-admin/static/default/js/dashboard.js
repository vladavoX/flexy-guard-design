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

function createPie() {
  const data = [11372, 2564]
  const total = data.reduce((a, b) => a + b, 0)

  const style = `
    width: 125px;
    height: 125px;
    border-radius: 50%;
    background: 
      radial-gradient(closest-side, #FEFEFE 60%, transparent 60% 100%),
      conic-gradient(#6145C0 ${(data[0] / total) * 100}%, #9881E6 0)
  `
  document.querySelector('.progress-bar').style = style
  document.querySelectorAll('.value-number').forEach((el, index) => {
    el.innerHTML = `${data[index]} &nbsp;`
  })
}

createPie()

function createResourceLines() {
  const data = [74.2, 28.8, 54.7]
  document.querySelectorAll('.res-data').forEach((el, index) => {
    el.innerHTML = `${data[index]}%`
  })
  document.querySelectorAll('.progress-line').forEach((line, index) => {
    line.style = `
      height: 12px;
      width: 100%;
      border-radius: 6px;
      background: 
        linear-gradient(to right, #6145C0 ${
          (data[index] / 100) * 100
        }%, #9881E6 0),
        conic-gradient(#6145C0 ${(data[index] / 100) * 100}%, #9881E6 0);
    `
  })
}

createResourceLines()

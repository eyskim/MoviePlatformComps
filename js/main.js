const utils = functions;

d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {
    const data = utils.collapseCategories(_data);
    return utils.groupByPlatform(data);
  })
  .then((data) => {
    renderAll(data);
    return data;
  });

function renderCharts(data) {
  const gridChart = new GridChart({
    parentElement: '#grid-chart',
    margin: {
      top: 90,
      bottom: 90,
      left: 90,
      right: 90,
    },
    width: 900,
    height: 900,
    colors: config.colors,
    functions,
  }, data);
  // gridChart.updateVis();

  const pieChart = new PieChart({
    parentElement: '#pie-chart',
    colors: config.colors,
    functions,
  }, data);
  // pieChart.updateVis();

  const barChart = new BarChart({
    parentElement: '#bar-chart',
    colors: config.colors,
    functions,
  }, data);
  // barChart.updateVis();
}
function renderAll(data) {
  generateMpaRatingWidgets(data);
  renderCharts(data);

  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((elt) => {
    elt.addEventListener('click', (e) => {
      // eslint-disable-next-line no-console
      console.log(e.target.innerHTML);

      const gridChartElt = document.getElementById('grid-chart');
      const pieChartElt = document.getElementById('pie-chart');
      const barChartElt = document.getElementById('bar-chart');
      const mpaRatingsWidgets = document.getElementById('mpa-rating-button-container');

      while (mpaRatingsWidgets.firstChild) {
        mpaRatingsWidgets.removeChild(mpaRatingsWidgets.firstChild);
      }

      while (gridChartElt.firstChild) {
        gridChartElt.removeChild(gridChartElt.firstChild);
      }
      while (pieChartElt.firstChild) {
        pieChartElt.removeChild(pieChartElt.firstChild);
      }
      while (barChartElt.firstChild) {
        barChartElt.removeChild(barChartElt.firstChild);
      }

      renderAll(data);
    });
  });
}

function generateMpaRatingWidgets(_data) {
  const data = _data;
  let widgets = new Set();

  data.forEach((d) => widgets.add(d.rating));
  widgets = Array.from(widgets);
  widgets.sort();

  widgets.forEach((w) => {
    const button = createFrag(`<button class="mpa-rating-button widget">${w}</button>`);
    document.getElementById('mpa-rating-button-container').appendChild(button);
  });
}

// https://stackoverflow.com/questions/11805251/add-html-elements-dynamically-with-javascript-inside-div-with-specific-id
function createFrag(htmlStr) {
  const frag = document.createDocumentFragment();
  const temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

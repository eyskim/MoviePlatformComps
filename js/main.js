d3.csv('data/preprocessedMovies2.csv')
  .then((data) => {
    // initialize data, filter, and configs
    const movieData = new MovieData(data);
    const filterHandler = new FilterHandler(movieData, 'none');
    const config = new Config({
      platformColors: {
        Netflix: '#485908',
        Hulu: '#ae35bb',
        Prime: '#e4c44c',
        Disney: '#007ae6',
      },
      barColors: [
        '#5c252b',
        '#aacf22',
        '#ff92dd',
        '#3b44c7',
        '#02a1f2',
        '#bf0073',
        '#fab888',
        '#93cdf7',
        '#ff9a3d',
      ],
      mpaRatingsColor: '#67d0a5',
      mpaRatingsOrdered: [
        'G',
        'PG',
        'PG-13',
        'R',
        'NC-17',
        'Not Rated',
      ],
      financialPerfBands: [
        ['poor (< 1)', 1],
        ['great (1 - 10)', 10],
        ['exceptional (> 10)', Infinity],
      ],
    });

    // create each widget based on data and configs
    new PlatformLegend('pie-chart-legend', movieData.getAllPlatforms(), config.getPlatformColors())
      .generate();

    new MpaButtons('mpa-rating-button-container', config.getMpaRatingsOrdered(), config.getMpaRatingsColor())
      .generate();

    new YearRangeSlider('range-input', movieData.getYearRange())
      .generate();

    new GenreLegend('bar-chart-legend', movieData.getAllGenres().sort(), config.getBarColors())
      .generate();

    new ResetButton('reset-button')
      .generate();

    // render the application's charts based on data, filter, and configs
    renderCharts(movieData, filterHandler, config);
  });

function renderCharts(movieData, filterHandler, config) {
  const data = movieData.getProcessedData();

  const charts = [
    new GridChart({
      parentElement: '#grid-chart',
      margin: {
        top: 50,
        bottom: 90,
        left: 90,
        right: 20,
      },
      width: 900,
      height: 900,
      platformColors: config.getPlatformColors(),
      platforms: movieData.getAllPlatforms(),
      financialPerfBands: config.getFinancialPerfBands(),
    }, data),

    new PieChart({
      parentElement: '#pie-chart',
      platformColors: config.getPlatformColors(),
      platforms: movieData.getAllPlatforms(),
    }, data),

    new BarChart({
      parentElement: '#bar-chart',
      barColors: config.getBarColors(),
      genres: movieData.getAllGenres(),
      platforms: movieData.getAllPlatforms(),
    }, data),
  ];

  // add listeners for interactions
  addListeners(movieData, filterHandler, charts);
}

function updateChartsByFilteredData(filteredData, charts) {
  charts.forEach((c) => {
    c.data = filteredData.getFilteredData();
    c.updateVis();
  });
}

function addListeners(movieData, filterHandler, charts) {
  const filteredData = new FilteredData(movieData.getRawData());

  // select and add a click handler to each widget
  const widgets = document.querySelectorAll('.widget');
  widgets.forEach((elt) => {
    elt.addEventListener('click', (e) => {
      elt.classList.toggle('active');

      const filterVal = e.target.innerHTML;
      swapColor(filterVal);

      filterHandler.setMovieData(filteredData);
      filterHandler.setFilterVal(filterVal);
      const filtered = filterHandler.filterBySelected();
      filteredData.setFilteredData(filtered);

      updateChartsByFilteredData(filteredData, charts);
    });
  });

  // handle filtering of year range slider
  const slider = document.querySelector('.range-slider');
  slider.addEventListener('change', () => {
    const rangeValueElts = document.getElementsByClassName('rangeValues');
    const rangeValueStr = rangeValueElts[0].innerHTML;
    const minYear = rangeValueStr.substring(15, 20);
    const maxYear = rangeValueStr.substring(22);
    const filterVal = [minYear, maxYear];

    filterHandler.setMovieData(filteredData);
    filterHandler.setFilterVal(filterVal);
    const filtered = filterHandler.filterBySelected();
    filteredData.setFilteredData(filtered);

    updateChartsByFilteredData(filteredData, charts);
  });
}

function swapColor(filterVal) {
  const currButton = document.querySelector(`[data-value="${filterVal}"]`);
  const currButtonColor = currButton.style.cssText;

  // Must use rgb as currButton.style.cssText will always output rgb
  currButton.style.cssText = currButtonColor === 'background-color: rgb(234, 221, 208);'
    ? `background-color: ${currButton.getAttribute('data-color')}`
    : 'background-color: rgb(234, 221, 208);';
}

// adapted from https://codepen.io/rendykstan/pen/VLqZGO
// eslint-disable-next-line func-names
window.getVals = function () {
  // Get slider values
  const parent = this.parentNode;
  const slides = parent.getElementsByTagName('input');
  let slide1 = parseFloat(slides[0].value);
  let slide2 = parseFloat(slides[1].value);
  // Neither slider will clip the other, so make sure we determine which is larger
  if (slide1 > slide2) { const tmp = slide2; slide2 = slide1; slide1 = tmp; }

  const displayElement = parent.getElementsByClassName('rangeValues')[0];
  displayElement.innerHTML = `Year Released: ${slide1} - ${slide2} `;
};

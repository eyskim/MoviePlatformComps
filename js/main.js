d3.csv('data/preprocessedMovies2.csv')
  .then((_data) => {

    let data = collapseCategories(_data);
    data = groupByPlatform(data);

    return { data };
  })
  .then(({ data }) => {
    generateMpaRatingWidgets(data);

    const innovationChart = new InnovationChart({
      parentElement: '#innovation-chart',
      margin: {
        top: 90,
        bottom: 90,
        left: 90,
        right: 90,
      },
      width: 900,
      height: 900,
    }, data);
    innovationChart.updateVis();

    const pieChart = new PieChart({
      parentElement: '#pie-chart',
    }, data);
    pieChart.updateVis();

    const barChart = new BarChart({
      parentElement: '#bar-chart',
    }, data);
    // barChart.updateVis();
    
  });
  

function collapseCategories(_data) {
  const data = _data;

  data.forEach((d) => {
    Object.keys(d).forEach((attr) => {
      if (attr === 'genre') {
        switch (d[attr]) {
          case 'Fantasy':
          case 'Mystery':
          case 'Family':
          case 'Thriller':
          case 'Sport':
          case 'Sci-Fi':
            d[attr] = 'Other';
            break;
          default:
        }
      }
    });
  });

  return data;
}

function generateMpaRatingWidgets(_data) {
  const data = _data;
  let widgets = new Set();

  data.forEach((d) => widgets.add(d.rating));
  widgets = Array.from(widgets);
  widgets.sort();

  widgets.forEach((w) => {
    const button = createFrag(`<button class="mpa-rating-button">${w}</button>`);
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

function groupByPlatform(_data) {
  const data = _data;
  let groupByPlatformData = []
  data.forEach(d => {
    if (d['Netflix'] == '1') {
      dClone = Object.assign({}, d);
      dClone['platform'] = 'Netflix';
      groupByPlatformData.push(dClone)
    }
    if (d['Hulu'] == '1') {
      dClone = Object.assign({}, d);
      dClone['platform'] = 'Hulu';
      groupByPlatformData.push(dClone)
    }
    if (d['Prime Video'] == '1') {
      dClone = Object.assign({}, d);
      dClone['platform'] = 'Prime Video';
      groupByPlatformData.push(dClone)
    }
    if (d['Disney+'] == '1') {
      dClone = Object.assign({}, d);
      dClone['platform'] = 'Disney+';
      groupByPlatformData.push(dClone)
    }
  })
  return groupByPlatformData;
}

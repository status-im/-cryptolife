var bel = require('bel')
var csjs = require('csjs-inject')
//var cytoscape = require('cytoscape')

var jsons

function html () {
  var css = csjs`
    .cy {
      width: 80%;
      height: 80%;
      position: absolute;
      left: 15%;
      top: 15%;
      z-index: 999;
      background-color: grey;
      border-radius: 4;
    }
    .title {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `

  document.body.innerHTML = `<div class=${css.cy}></div>`
  var cyDiv = document.body.children[0]
  function createCy (cyNodes, cyEdges) {
    var cy = window.cy = cytoscape({
      container: cyDiv,
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: { name: 'circle'},
      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(label)',
            'text-opacity': 0.8,
            'text-valign': 'center',
            'text-halign': 'right',
            'background-color': 'violet',
            'font-size': 30
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 10,
            'target-arrow-shape': 'triangle',
            'line-color': 'black',
            'target-arrow-color': 'violet',
            'curve-style': 'bezier'
          }
        }
      ],


      elements: {
        nodes: cyNodes,
        edges: cyEdges
      },


    })
    cy.on('tap', 'node', selectedNodeHandler)
    function selectedNodeHandler(node) {
      console.log(node)
      window.open('https://ninabreznik.github.io/workshop_app/','_blank')
    }
  }



  var arr = [
    "http://172.31.253.118:9966/json_s/1.json",
    "http://172.31.253.118:9966/json_s/2.json",
    "http://172.31.253.118:9966/json_s/3.json",
    "http://172.31.253.118:9966/json_s/4.json",
    "http://172.31.253.118:9966/json_s/5.json",
    "http://172.31.253.118:9966/json_s/6.json",
    "http://172.31.253.118:9966/json_s/7.json",
    "http://172.31.253.118:9966/json_s/8.json",
    "http://172.31.253.118:9966/json_s/9.json",
    "http://172.31.253.118:9966/json_s/10.json"
  ]

  var el = bel`
  <div>
    <div class=${css.title}>
      <h1>Skilltree</h1>
      <h3>inspired by <a href="http://www.dungeonsanddevelopers.com/#_a_4_Your%20Name" target="_blank">Dungeons and developers</a></h3>
    </div>
    <div>${displayDependencies()}</div>
    ${cyDiv}
  </div>
  `

  function getNodesAndEdges (arr) {
    var all = {}
    var cyNodes = []
    var cyEdges = []
    var lenghts = []
    arr.forEach((workshop,id)=>{
      cyNodes.push({ data: { id: 'n'+id, label: workshop.title } })
      all[workshop.url] = `n${id}`
    })
    arr.forEach((workshop,id)=> {
      generateEdges(workshop, id, cyEdges, all)
    })
    createCy(cyNodes, cyEdges)
  }

  function generateEdges(workshop, id, edges, all) {
    var requirements = workshop.needs
    requirements.forEach((url,i) => {
      edges.push({ data: { source: all[url], target: 'n'+id } })
    })
  }

  function displayDependencies () {
    getData((err,data) => {
      if (err) { console.log(err) }
      else {
        getNodesAndEdges(data)
      }
    })
  }

  function getData (next) {
    var promises = arr.map(fetchJson)
    Promise.all(promises).then(result => {
      next(null, result)
    })
  }

  async function fetchJson (url) {
    var response = await fetch(url)
    var result = await response.json()
    result.url = url
    return result
  }

  document.body.appendChild(el)
}

html()

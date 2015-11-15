/* globals
  laneApp,
  d3
*/
'use strict';
angular.module('laneApp')
  .directive('mapD', function($rootScope) {
    return {
      restrict : 'E',
      link : function () {
        var jsonData = $rootScope.mostRecentMatch.sortedData;
                        console.log(jsonData); /////////////////////////////////////////////REMOVE ME YO
        var imageWidth = 25;
        var imageHeight = 25;

//=====================Summoners Rift============================
        var towerCordsSummoners = [
          [12400, 13000, 'TowerNexusTopMidB'], [12900, 12500, 'TowerNexusBotMidB'], [10500, 13800, 'TowerBaseTopB'], [11100, 11100, 'TowerBaseMidB'],
          [13800, 10500, 'TowerBaseBotB'], [7700, 13600, 'TowerInnerTopB'], [4500, 14000, 'TowerOuterTopB'], [9800, 9900, 'TowerInnerMidB'],
          [8900, 8400, 'TowerOuterMidB'], [13600, 8200, 'TowerInnerBotB'], [13900, 4000, 'TowerOuterBotB'], [2000, 2200, 'TowerNexusTopMidA'],
          [2400, 1700, 'TowerNexusBotMidA'], [1400, 4300, 'TowerBaseTopA'], [3800, 3500, 'TowerBaseMidA'], [4200, 900, 'TowerBaseBotA'],
          [7200, 1100, 'TowerInnerBotA'], [10700, 800, 'TowerOuterBotA'], [5300, 4800, 'TowerInnerMidA'], [6200, 6300, 'TowerOuterMidA'],
          [1500, 6600, 'TowerInnerTopA'], [1200, 11000, 'TowerOuterTopA']
        ];

        var nexiCordsSummoners = [[1600, 1300], [13100, 13100]];

        var inhibCordsSummoners = [[1450, 3050], [3400, 2650], [3650, 640], [11500, 13460], [11770, 11420], [13750, 11090]];

        var summonersRift = "http://ddragon.leagueoflegends.com/cdn/5.22.3/img/map/map" + (($rootScope.mostRecentMatch.mapId !== 11) ? $rootScope.mostRecentMatch.mapId : 1)  + ".png"  ;

//=============================
        //app page map display size
        var mapWidth = 630;
        var mapHeight = 630;

//MAP OPTIONS/VARIABLES
        if($rootScope.mostRecentMatch.mapId == 1) {
          var domain = {
              //Summoners Rift
              min: {x: -570, y: -420},
              max: {x: 15220, y: 14980}
            },
            width = mapWidth,
            height = mapHeight,
            bg = summonersRift,
            xScale, yScale, svg;
        } else if ($rootScope.mostRecentMatch.mapId == 8) {
          var domain = {
              //Crystal Scar
              min: {x: 0, y: 0}
              max: {x: 13987, y: 13987}
            },
            width = mapWidth,
            height = mapHeight,
            bg = summonersRift,
            xScale, yScale, svg;
        } else if ($rootScope.mostRecentMatch.mapId == 10) {
          var domain = {
              //Twisted Treeline
              min: {x: 0, y: 0}
              max: {x: 15398, y: 15398}
            },
            width = mapWidth,
            height = mapHeight,
            bg = summonersRift,
            xScale, yScale, svg;
        } else if ($rootScope.mostRecentMatch.mapId == 12) {
          var domain = {
              //Howling Abyss
              min: {x: -28, y: -19}
              max: {x: 12849, y: 12858}
            },
            width = mapWidth,
            height = mapHeight,
            bg = summonersRift,
            xScale, yScale, svg;
        }

        var filteredData = {};

//BRUSH DATA
        var gameLength = $rootScope.mostRecentMatch.sortedData.gameLength;
        var gameLengthByMin = gameLength/60000;
        var brushX = 5;
        var brushY = 18;
        var brushHeight = 30;
        var brushPositionX = 3;

        svg = d3.select("#brush-d").append("svg:svg")
          .attr("width", width)
          .attr("height", brushY+100);

        var scale = d3.scale.linear()
          //length of data
          .domain([0, gameLengthByMin])
          //size of bar
          .range([brushPositionX + 0, brushPositionX + 500]);

        var brush = d3.svg.brush();
        brush.x(scale);
        brush.extent([0, gameLengthByMin/10]);

        brush.on('brushend', function() {
          for(var player in jsonData) {
            if(player!== 'gameLength' && player !== 'deadBuildings') {
              filteredData[player] = jsonData[player].filter(function (d) {
                return (d[0] >= (brush.extent()[0] * 60000) && d[0] <= (brush.extent()[1] * 60050));
              });
            }
          }
          update(filteredData);
        });

        var g = svg.append("g");
        brush(g);
        g.attr("transform", "translate(" + brushX + "," + brushY +")");
        g.selectAll("rect").attr("height", brushHeight);
        g.selectAll(".background")
          .style({fill: "#4B9E9E", visibility: "visible"});
        g.selectAll(".extent")
          .style({fill: "#78C5C5", visibility: "visible"});
        g.selectAll(".resize rect")
          .style({fill: "#276C86", visibility: "visible"})
          .attr("class", "brush");


        var scale = d3.scale.linear()
          .domain([0, gameLengthByMin])
          .range([ brushPositionX + 7, brushPositionX + 503]);

        var axis = d3.svg.axis()
          .scale(scale)
          .orient("bottom"); //left, right, top

        var g = svg.append("g");
        axis(g);
        g.attr("transform", "translate(" + (brushX - 6) + "," + (brushY + 35) +")");
        g.selectAll("path")
          .style({ fill: "none", stroke: "#000"});
        g.selectAll("line")
          .style({ stroke: "#000"})
          .attr("class", "brush");


//MAP DATA

        var color = d3.scale.linear()
          .domain([0, 3])
          .range([ 'white', 'steelblue' ])
          .interpolate(d3.interpolateLab);

        xScale = d3.scale.linear()
          .domain([domain.min.x, domain.max.x])
          .range([0, width]);

        yScale = d3.scale.linear()
          .domain([domain.min.y, domain.max.y])
          .range([height, 0]);

        svg = d3.select('#map-d').append('svg:svg')
          .attr('width', width)
          .attr('height', height);

        svg.append('image')
          .attr('xlink:href', bg)
          .attr('x', '0')
          .attr('y', '0')
          .attr('width', width)
          .attr('height', height);


//UPDATE FUNCTION
        function update(data){
          var images = svg.selectAll('.stuff1').data(data);
          images.exit().remove();
          images.enter();

          var towers = 'http://www.team-dignitas.net/uploads/tinymce/images/turret_transparent.png';
          svg.append('svg:g').selectAll('image2')

            //towerCords + Summoners/Twisted/Howling
            .data(towerCordsSummoners)
            .enter().append('svg:image')
            .attr('xlink:href', towers)

            //Summoners
            .attr('x', function(d) { return xScale(d[0]) - mapWidth/40; })
            .attr('y', function(d) { return yScale(d[1]) - mapHeight/20; })
            .attr('class', 'stuff1')
            .attr('width', mapWidth/16)
            .attr('height', mapHeight/16);

          var nexi = 'http://i42.tinypic.com/15nll07.png';
          svg.append('svg:g').selectAll('image3')
            .data(nexiCordsSummoners)
            .enter().append('svg:image')
            .attr('xlink:href', nexi)

            //Summoners
            .attr('x', function(d) { return xScale(d[0]) - mapWidth/40; })
            .attr('y', function(d) { return yScale(d[1]) - mapHeight/20; })
            .attr('class', 'stuff1')
            .attr('width', mapWidth/16)
            .attr('height', mapHeight/16);

          var inhibs = 'http://assets.razerzone.com/eeimages/razer_events/11691/inhibitor-b.png';
          svg.append('svg:g').selectAll('image4')
            .data(inhibCordsSummoners)
            .enter().append('svg:image')
            .attr('xlink:href', inhibs)

            //Summoners
            .attr('x', function(d) { return xScale(d[0]) - mapWidth/40; })
            .attr('y', function(d) { return yScale(d[1]) - mapWidth/20; })
            .attr('class', 'stuff1')
            .attr('width', mapWidth/25)
            .attr('height', mapHeight/25);

          var imgurl1 = $rootScope.mostRecentMatch.participants[0].championImage;
          var player1img = svg.selectAll("image1")

            //bypass sortPlayer functions by referring to jsonData.player#
            .data(data.player1)
            .enter().append('svg:image')
            .attr('class', 'stuff1')
            //pass variable containing url
            .attr('xlink:href', imgurl1)
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player1)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ffbc44')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player1)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#330000')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl2 = $rootScope.mostRecentMatch.participants[1].championImage;
          var player2img = svg.selectAll('image1')
            .data(data.player2)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player2)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ff3300')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player2)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#330000')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          var imgurl3 = $rootScope.mostRecentMatch.participants[2].championImage;
          var player3img = svg.selectAll('image1')
            .data(data.player3)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl3)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player3)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#800000')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player3)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#330000')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl4 = $rootScope.mostRecentMatch.participants[3].championImage;
          var player4img = svg.selectAll('image1')
            .data(data.player4)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl4)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player4)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ffb5b4')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player4)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#330000')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl5 = $rootScope.mostRecentMatch.participants[4].championImage;
          var player5img = svg.selectAll('image1')
            .data(data.player5)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl5)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player5)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ff45a2')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player5)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#330000')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl6 = $rootScope.mostRecentMatch.participants[5].championImage;
          var player6img = svg.selectAll('image1')
            .data(data.player6)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player6)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#000066')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player6)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ffffff')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl7 = $rootScope.mostRecentMatch.participants[6].championImage;
          var player7img = svg.selectAll('image1')
            .data(data.player7)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl7)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player7)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#00cc99')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player7)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ffffff')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl8 = $rootScope.mostRecentMatch.participants[7].championImage;
          var player8img = svg.selectAll('image1')
            .data(data.player8)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl8)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player8)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#006666')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player8)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ffffff')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl9 = $rootScope.mostRecentMatch.participants[8].championImage;
          var player9img = svg.selectAll('image1')
            .data(data.player9)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl9)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player9)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#66ccff')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player9)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ffffff')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });


          var imgurl10 = $rootScope.mostRecentMatch.participants[9].championImage;
          var player10img = svg.selectAll('image1')
            .data(data.player10)
            .enter().append('svg:image')
            .attr('xlink:href', imgurl10)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - imageWidth/2; })
            .attr('y', function(d) { return yScale(d[3]) - imageHeight/2; })
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return ((d[0]/(brush.extent()[1] * 60000) *0.7) + 0.1);
              }
            });

          svg.selectAll('image1')
            .data(data.player10)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#6666ff')
            .style('stroke-width', 6)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });

          svg.selectAll('image1')
            .data(data.player10)
            .enter().append('rect')
            .attr('width', imageWidth + 2)
            .attr('height', imageHeight + 2)
            .style('fill', 'none')
            .style('stroke', '#ffffff')
            .style('stroke-width', 2)
            .attr('class', 'stuff1')
            .attr('x', function(d) { return xScale(d[2]) - (imageWidth/2 + 1); })
            .attr('y', function(d) { return yScale(d[3]) - (imageHeight/2 + 1); })
            .attr('opacity', function(d) {
              if((brush.extent()[1]-1)*60050 <= d[0] ) {
                return 1;
              } else {
                return (0);
              }
            });



        }


        update(jsonData);

      }
    }
  }
);
// set the dimensions and margins of the graph
let margin = { top: 60, right: 230, bottom: 50, left: 50 },
    width = d3version4.select("#my_dataviz").node().getBoundingClientRect().width - margin.left - margin.right,
    height = d3version4.select("#my_dataviz").node().getBoundingClientRect().height - margin.top - margin.bottom;
let lastFruit = "";
function stackchart(fruit = "", country = "", year1 = "", year2 = "") {

    //get fruit input
    let fileName;
    // if (fruit !== lastFruit) {
    d3version4.selectAll("#my_dataviz svg").remove();
    d3version4.selectAll("#birth_rate_tooltip").remove();
    // lastFruit = fruit;
    // }
    switch (fruit) {
        case '香蕉':
            fileName = "final_data/banana.csv";
            lastFruit = "banana";
            break;
        case '葡萄':
            fileName = "final_data/grape.csv";
            lastFruit1 = "grape";
            break;
        case '柚子':
            fileName = "final_data/pomelo.csv";
            lastFruit = "pomelo";
            break;
        case '荔枝':
            fileName = "final_data/litchi.csv";
            lastFruit = "litchi";
            break;
        case '芒果':
            fileName = "final_data/mango.csv";
            lastFruit = "mango";
            break;
        case '鳳梨':
            fileName = "final_data/pineapple.csv";
            lastFruit = "pineapple";
            break;
        case '釋迦':
            fileName = "final_data/sakyamuni.csv";
            lastFruit = "sakyamuni";
            break;
        case '蓮霧':
            fileName = "final_data/waxapple.csv";
            lastFruit = "waxapple";
            break;
        case '葡萄柚':
            fileName = "final_data/grapefruit.csv";
            lastFruit = "grapefruit";
            break;
        default:
            fileName = `final_data/${lastFruit}.csv`;
    }
    //console.log(fileName)
    // append the svg object to the body of the pages
    let svg = d3version4.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3version4.csv(fileName, function (data) {

        //////////
        // GENERAL //
        //////////

        // List of groups = header of the csv files
        let keys = data.columns.slice(1)

        // color palette
        let color = d3version4.scaleOrdinal()
            .domain(keys)
            .range(d3version4.schemeTableau10);

        //stack the data?
        let stackedData = d3version4.stack()
            .keys(keys)
            (data)
        // console.log(stackedData)
        svg.append("text")
            .text("台灣出口累積圖")
            .attr("x", width + 75)
            .attr("y", -35)
            .attr("font-size", "20px")

        //////////
        // AXIS //
        //////////

        // Add X axis
        let x = d3version4.scaleLinear()
            .domain(d3version4.extent(data, function (d) { return d.year; }))
            .range([0, width]);
        let xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3version4.axisBottom(x).ticks(5))

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 35)
            .text("時間(年)");

        // Add Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", -40)
            .attr("y", -20)
            .text("公噸")
            .attr("text-anchor", "start")

        // Add Y axis
        let y = d3version4.scaleLinear()
            .domain([0, d3version4.max(stackedData,
                function (d) {
                    //Find maximum value of data
                    let max = 0;
                    d.forEach(function (e, i) {
                        // console.log(e);
                        if (d3version4.max(e) > max) max = d3version4.max(e)
                    })
                    return max
                })
            ])
            .range([height, 0]);
        svg.append("g")
            .call(d3version4.axisLeft(y).ticks(5))



        //////////
        // BRUSHING AND CHART //
        //////////

        // Add a clipPath: everything out of this area won't be drawn.
        let clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // // Add brushing
        // var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
        //     .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        //     .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the scatter variable: where both the circles and the brush take place
        let areaChart = svg.append('g')
            .attr("clip-path", "url(#clip)")

        // Area generator
        let area = d3version4.area()
            .x(function (d) { return x(d.data.year); })
            .y0(function (d) { return y(d[0]); })
            .y1(function (d) { return y(d[1]); })

        // Show the areas
        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", function (d) { return "myArea " + d.key })
            .style("fill", function (d) { return color(d.key); })
            .attr("d", area)

        // // Add the brushing
        // areaChart
        //     .append("g")
        //     .attr("class", "brush")
        //     .call(brush);

        // var idleTimeout
        // function idled() { idleTimeout = null; }

        // // A function that update the chart for given boundaries
        // function updateChart() {

        //     extent = d3.event.selection

        //     // If no selection, back to initial coordinate. Otherwise, update X axis domain
        //     if (!extent) {
        //         if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        //         x.domain(d3.extent(data, function (d) { return d.year; }))
        //     } else {
        //         console.log(extent);
        //         x.domain([x.invert(extent[0]), x.invert(extent[1])])
        //         areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        //     }

        //     // Update axis and area position
        //     xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
        //     areaChart
        //         .selectAll("path")
        //         .transition().duration(1000)
        //         .attr("d", area)
        // }



        //////////
        // HIGHLIGHT GROUP //
        //////////

        // What to do when one group is hovered
        let highlight = function (d) {
            // console.log(d)
            // reduce opacity of all groups
            d3version4.selectAll(".myArea").style("opacity", .1)
            // expect the one that is hovered
            d3version4.select("." + d).style("opacity", 1)
        }

        // And when it is not hovered anymore
        let noHighlight = function (d) {
            d3version4.selectAll(".myArea").style("opacity", 1)
        }



        //////////
        // LEGEND //
        //////////

        let keysReverse = keys.reverse();
        // Add one dot in the legend for each name.
        let size = 16
        svg.selectAll("myrect")
            .data(keysReverse)
            .enter()
            .append("rect")
            .attr("x", function(d,i){ 
                if(i<8){
                    return width + 60;
                }else{
                    return width + 140;
                }
            })
            .attr("y", function (d, i) { 
                if(i<8){
                    return -20 + i * (size + 10);
                }else{
                    i = i-8;
                    return -20 + i * (size + 10);// 100 is where the first dot appears. 25 is the distance between dots
                } 
            })
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) { return color(d) })
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(keysReverse)
            .enter()
            .append("text")
            .attr("x", function(d,i){ 
                if(i<8){
                    return width + 60 + size * 1.2;
                }else{
                    return width + 140 + size * 1.2;
                }
            })
            .attr("y", function (d, i) { 
                if(i<8){
                    return -18 + i * (size + 10) + (size / 2);
                }else{
                    i = i-8;
                    return -18 + i * (size + 10) + (size / 2);// 100 is where the first dot appears. 25 is the distance between dots
                } 
            })
            .style("fill", function (d) { return color(d) })
            .text(function (d) {
                if (d == 0) {
                    return ""
                } else {
                    return d
                }
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // svg.append("text")
        //     .text("台灣出口累積圖")
        //     .attr("x", width + 75)
        //     .attr("y", -35)
        //     .attr("font-size","20px")
        svg.append("text")
            .attr("font-size", "14px")
            .attr("x", width + 137)
            .attr("y", height + 37)
            .text("請滑到國家上")

        // interact
        let mouseG
        let tooltip
        let reverseStackedData = stackedData.reverse();

        // create hover tooltip with vertical line 
        tooltip = d3version4.select("body")
            .append("div")
            .attr('id', 'birth_rate_tooltip')
            .style('position', 'absolute')
            .style("background-color", "#F0F3F4")
            .style('padding', 6)
            .style('display', 'none')

        mouseG = svg.append("g")
            .attr("class", "mouse-over-effects");

        mouseG.append("path") // create vertical line that follows mouse
            .attr("class", "mouse-line")
            .style("stroke", "#FFFFFF")
            .style("stroke-width", 2)
            .style("opacity", "0");

        let lines = document.getElementsByClassName('line');

        let mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

        mousePerLine.append("circle")
            .attr("r", 4)
            .style("stroke", function (d) {
                return color(d.key)
            })
            .style("fill", "none")
            .style("stroke-width", 2)
            .style("opacity", "0");

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function () { // on mouse out hide line, circles and text
                d3version4.select(".mouse-line")
                    .style("opacity", "0");
                d3version4.selectAll(".mouse-per-line circle")
                    .style("opacity", "0");
                d3version4.selectAll(".mouse-per-line text")
                    .style("opacity", "0");
                d3version4.selectAll("#birth_rate_tooltip")
                    .style('display', 'none')

            }).on('mouseover', function () { // on mouse in show line, circles and text
                d3version4.select(".mouse-line")
                    .style("opacity", "1");
                d3version4.selectAll(".mouse-per-line circle")
                    .style("opacity", "1");
                d3version4.selectAll("#birth_rate_tooltip")
                    .style('display', 'block')
            })
            .on('mousemove', function () { // update tooltip content, line, circles and text when mouse moves

                let mouse = d3version4.mouse(this)
                //console.log(mouse)//ok
                let x_year
                d3version4.selectAll(".mouse-per-line")
                    .attr("transform", function (d, i) {
                        //console.log(d)
                        x_year = x.invert(mouse[0]) //get year corresponding to distance from mouse position relative to svg by invert()
                        // console.log(x_year)
                        // retrieve row index of year on parsed data
                        let bisect = d3version4.bisector(function (d) { return d.data.year; }).left;
                        let idx = bisect(d, x_year);
                        //console.log(idx);

                        d3version4.select(".mouse-line")
                            .attr("d", function () {
                                //console.log(d);
                                //console.log(idx)
                                let pos = "M" + x(d[idx].data.year) + "," + (height);
                                pos += " " + x(d[idx].data.year) + "," + 0;
                                //console.log(pos)
                                return pos;
                            });

                        return "translate(" + x(d[idx].data.year) + "," + y(d[idx][1]) + ")";
                    });
                updateTooltipContent(x_year, stackedData);
            });

        function updateTooltipContent(x_year, stackedData) {
            sortedObj = []
            stackedData.map(d => {
                let year = x_year
                let bisect = d3version4.bisector(function (d) { return d.data.year; }).left
                let idx = bisect(d, year);
                sortedObj.push({
                    "key": d.key,
                    "value": d[idx].data[d.key],
                    "year": d[idx].data.year,

                })
            })


            sortedObj.sort(function (x1, x2) {
                return d3version4.descending(x1.value, x2.value);
            })

            // var sortedArr = sortedObj.map(d => d.key)

            // var sorted_data = stackedData.slice().sort(function (a1, a2) {
            //     // rank data based on birth rate value
            //     return sortedArr.indexOf(a1.key) - sortedArr.indexOf(a2.key)
            // });



            tooltip.style('display', 'block')
                .style('left', (d3version4.event.pageX + 30) + "px")
                .style('top', (d3version4.event.pageY - (height + 100)) + "px")
                .style('opacity', 0.9)
                .html("<p style='padding:2px;'>民國" + sortedObj[0].year + " 年" + "</p>")
                .style('font-size', 11.5)
                .selectAll()
                .data(reverseStackedData)
                .enter()
                .append('div')
                .style('color', d => {
                    return color(d.key)
                })
                .style('font-size', 10)
                .html(d => {
                    let year = x_year
                    let bisect = d3version4.bisector(function (d) { return d.data.year; }).left
                    let idx = bisect(d, year)
                    let msg = d.key + "：" + d[idx].data[d.key].toString();
                    return "<p>" + msg + "</p>";
                })
        }

        //////////
        //parameters
        ///////////

        // get country input
        if (country !== "") {
            highlight(country);
        }
        // get year boundaries input
        if (year1 !== "" && year2 !== "") {
            x.domain(d3version4.extent(data, function (d) {
                if (parseInt(d.year) <= parseInt(year2) && parseInt(d.year) >= parseInt(year1)) {
                    return d.year;
                }
            }))
            // Update axis and area position
            xAxis.transition().duration(1000).call(d3version4.axisBottom(x).ticks(5))
            areaChart
                .selectAll("path")
                .transition().duration(1000)
                .attr("d", area)
        }
        // else if (year1 !== "" && year2 === "") { // update tooltip content, line, circles and text when mouse moves

        //     d3.selectAll(".mouse-per-line")
        //         .attr("transform", function (d, i) {
        //             //console.log(d)
        //             var x_year = year1 //get year corresponding to distance from mouse position relative to svg by invert()
        //             //console.log(x_year)
        //             // retrieve row index of year on parsed data
        //             var bisect = d3.bisector(function (d) { return d.data.year; }).left;
        //             var idx = bisect(d, x_year);
        //             //console.log(idx);

        //             d3.select(".mouse-line")
        //                 .attr("d", function () {
        //                     //console.log(d);
        //                     var pos = "M" + x(d[idx].data.year) + "," + (height);
        //                     pos += " " + x(d[idx].data.year) + "," + 0;
        //                     //console.log(pos)
        //                     return pos;
        //                 });

        //             return "translate(" + x(d[idx].data.year) + "," + y(d[idx][1]) + ")";
        //         });
        //     updateTooltipContent(year1, stackedData);
        // }

    })
}
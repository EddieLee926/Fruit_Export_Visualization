var width2 = d3version4.select("#pic2").node().getBoundingClientRect().width,
    height2 = d3version4.select("#pic2").node().getBoundingClientRect().height,
    scale2 = 3;

var zoom = d3version4.zoom()
    .scaleExtent([1, scale2])
    .on("zoom", zoomed)

function zoomed() {
    container.attr("transform", d3version4.event.transform);
}
function reset() {
    svg2.transition().duration(750).call(
        zoom.transform,
        d3version4.zoomIdentity,
        d3version4.zoomTransform(svg2.node()).invert([width2 / 2, height2 / 2])
    );
}

var svg2 = d3version4.select("#pic2")
    .append("svg")
    .attr("width", width2)
    .attr("height", height2)
    .call(zoom)
    .on("dblclick.zoom", null)
    .on("wheel.zoom", null)
    .on("click", reset);

var container = svg2.append("g").attr("class", "bubble_g")

var tooltip = d3version4.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var color_scale = d3version4.scaleOrdinal()
    .domain(["109", "108", "107", "106", "105", "104", "103", "102", "101", "100"])
    .range(d3version4.schemeSet2);

var fruit_text = ""
var lastFruit1 = "";
function bubblechart(fruit, year1, year2) {
    d3version4.selectAll(".bubble_g > *").remove();
    d3version4.selectAll("#pic2 > svg > text").remove()
    let fileName;
    switch (fruit) {
        case '香蕉':
            fileName = "bubble_data/banana.json";
            lastFruit1 = "banana";
            fruit_text = "香蕉"
            break;
        case '葡萄':
            fileName = "bubble_data/grape.json";
            lastFruit1 = "grape";
            fruit_text = "葡萄"
            break;
        case '柚子':
            fileName = "bubble_data/pomelo.json";
            lastFruit1 = "pomelo";
            fruit_text = "柚子"
            break;
        case '荔枝':
            fileName = "bubble_data/litchi.json";
            lastFruit1 = "litchi";
            fruit_text = "荔枝"
            break;
        case '芒果':
            fileName = "bubble_data/mango.json";
            lastFruit1 = "mango";
            fruit_text = "芒果"
            break;
        case '鳳梨':
            fileName = "bubble_data/pineapple.json";
            lastFruit1 = "pineapple";
            fruit_text = "鳳梨"
            break;
        case '釋迦':
            fileName = "bubble_data/sakyamuni.json";
            lastFruit1 = "sakyamuni";
            fruit_text = "釋迦"
            break;
        case '蓮霧':
            fileName = "bubble_data/waxApple.json";
            lastFruit1 = "waxApple";
            fruit_text = "蓮霧"
            break;
        case '葡萄柚':
            fileName = "bubble_data/grapefruit.json";
            lastFruit1 = "grapefruit";
            fruit_text = "葡萄柚"
            break;
        default:
            fileName = `bubble_data/${lastFruit1}.json`;
    }

    d3version4.json(fileName, function (error, nodes) {
        var year_data = []
        nodes.forEach((e) => {
            if (year1 <= Number(e.category) && Number(e.category) <= year2) {
                year_data.push(e)
            }
        })

        //sum: 大小 sort:排序
        const root = d3version4.hierarchy({ name: 'root', children: year_data })
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        //console.log(year_data)
        const value_max = d3version4.max(year_data, d => d3version4.max(d.children, m => m.value));
        const value_min = d3version4.min(year_data, d => d3version4.min(d.children, m => m.value));

        const radius_scale = d3version4.scaleLinear().domain([0, value_max]).range([10, 25]);
        var linear_scale = d3version4.scaleLinear().domain([value_min, value_max]).range(["#FFFFFF", "#3086e3"])

        svg2.append("text")
            .text("單位：公噸")
            .attr("x", width2 - 96)
            .attr("y", height2 - 20)

        svg2.append("text")
            //.text(`台灣各地${fruit_text}產量圖`)
            .text(`台灣縣市產量圖`)
            .attr("x", width2 - 155)
            .attr("y", 25)
            .attr("font-size", "20px")
        if (fruit_text === "釋迦") {
            svg2.append("text")
                .text(`註：釋迦僅有四年資料`)
                .attr("x", width2 - 190)
                .attr("y", 45)
        }
        let pack_data = d3version4.pack()
            .size([600, 400])
            .radius(d => d.data.value > 500 ? radius_scale(d.data.value) : 8)
            .padding(2)
            (d3version4.hierarchy({ name: 'root', children: year_data })
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value)
            );

        pack_data.children.forEach(function (d) {
            const my_x = d.x;
            const my_y = d.y;
            d.x = Math.random() * 900;
            d.y = Math.random() * 800;
            d.pack_x = d.r;
            d.pack_y = d.r;
            d.category = d.data.category;
            for (let c in d.children) {
                d.children[c].pack_x = d.children[c].x - my_x + d.r;
                d.children[c].pack_y = d.children[c].y - my_y + d.r;
                d.children[c].category = d.data.category;
            }
        })
        //console.log(pack_data.children)
        const value_max_1 = d3version4.max(pack_data.children, d => d.value);
        const value_min_1 = d3version4.min(pack_data, d => d3version4.min(d.children, m => m.value));
        //console.log(value_max_1)
        var linear_scale_1 = d3version4.scaleLinear().domain([0, value_max_1]).range(["#FFFFFF", "#32a852"])

        pack_data = pack_data.descendants().slice(1);
        //now nodes

        var my_group = container.selectAll("g")
            .data(pack_data)
            .enter()
            .append("g")
            .attr("class", "node_group")
            .on("mouseover", function (d) {
                d3version4.selectAll(`.sub_circle${d.data.category}`)
                    .style("fill-opacity", 1)
                    .on("mouseover", function () {
                        d3version4.selectAll(`.sub_circle${d.data.category}`).style("fill-opacity", 1)
                        d3version4.selectAll(`.sub_label${d.data.category}`).style("fill-opacity", 1)
                        d3version4.selectAll(`.label${d.data.category}`).style("fill-opacity", 0)
                    })
                d3version4.selectAll(`.sub_label${d.data.category}`).style("fill-opacity", 1)
                    .on("mouseover", function () {
                        d3version4.selectAll(`.sub_label${d.data.category}`).style("fill-opacity", 1)
                        d3version4.selectAll(`.sub_circle${d.data.category}`).style("fill-opacity", 1)
                        d3version4.selectAll(`.label${d.data.category}`).style("fill-opacity", 0)
                    })
                d3version4.selectAll(`.label${d.data.category}`).style("fill-opacity", 0)
                //hover tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                var text = d.depth === 1 ? d.data.category + "總產量" + "<br>" + Math.round(d.value, 2) : d.data.name + "<br>" + Math.round(d.value, 2);

                tooltip.html(text)
                    .style("left", (d3version4.event.pageX) + "px")
                    .style("top", (d3version4.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                d3version4.selectAll(`.sub_circle${d.data.category}`)
                    .style("fill-opacity", 0)
                    .on("mouseout", function () {
                        d3version4.selectAll(`.sub_circle${d.data.category}`).style("fill-opacity", 0)
                        d3version4.selectAll(`.sub_label${d.data.category}`).style("fill-opacity", 0)
                        d3version4.selectAll(`.label${d.data.category}`).style("fill-opacity", 1)
                    })
                d3version4.selectAll(`.sub_label${d.data.category}`).style("fill-opacity", 0)
                d3version4.selectAll(`.label${d.data.category}`).style("fill-opacity", 1)
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })

        var sub = my_group
            .append("circle")
            .attr("class", d => d.depth === 1 ? `pack_circle circle${d.data.category}` : `pack_circle sub_circle${d.parent.category} sub`)

        var text = my_group
            .append("text").attr("class", d => d.depth === 1 ? `label label${d.data.category}` :
                `label sub_label${d.parent.category}`)
            .attr("text-anchor", "middle")
            .attr("font-size", d => d.depth === 1 ? 14 : 8)
            .style("fill-opacity", d => d.depth === 1 ? 1 : 0)
            .text(d => d.depth === 1 ? d.data.category : d.data.name)
            .attr("x", d => d.pack_x)
            .attr("y", d => d.pack_y)


        //circles
        my_group.select(".pack_circle")
            .attr("cx", d => d.pack_x)
            .attr("cy", d => d.pack_y)
            .attr("r", d => d.r)
            .attr("fill", d => d.depth === 1 ? linear_scale_1(d.value) : linear_scale(d.value))
            .style("fill-opacity", d => d.depth === 1 ? 1 : 0)
            .call(d3version4.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on('click', function (d) {
                if (d.depth !== 1) { d = d.parent }
                d3version4.event.stopPropagation();
                svg2.transition().duration(750).call(
                    zoom.transform,
                    d3version4.zoomIdentity.translate((width2 / 2 - d.x * (width2 / (d.r * 4))), (height2 / 2 - d.y * (width2 / (d.r * 4)))).scale(width2 / (d.r * 4))
                )
            });

        //and the simulation - really simple, box force, links with no strength, radius collide
        const simulation = d3version4.forceSimulation(pack_data)
            .force('charge', d3version4.forceManyBody().strength(10))
            .force('center', d3version4.forceCenter(width2 / 2 - 50, height2 / 2))
            .force('x', d3version4.forceX().strength(0.03).x(1))
            .force('y', d3version4.forceY().strength(0.08).y(200))
            .force("collision", d3version4.forceCollide().strength(0.5).radius(d => d.depth === 1 ? d.r + 1 : 0).iterations(2))

        simulation.on("tick", tick)

        function tick() {
            //node items
            d3version4.selectAll(".pack_circle")
                .attr("cx", d => d.depth === 1 ? d.x : d.parent.x + d.pack_x - d.parent.r)
                .attr("cy", d => d.depth === 1 ? d.y : d.parent.y + d.pack_y - d.parent.r)
            d3version4.selectAll(".label")
                .attr("x", d => d.depth === 1 ? d.x : d.parent.x + d.pack_x - d.parent.r)
                .attr("y", d => d.depth === 1 ? d.y * 1.005 : d.parent.y + d.pack_y - d.parent.r * 0.96)
        }
        function dragstarted(d) {
            if (!d3version4.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3version4.event.x;
            d.fy = d3version4.event.y;
        }
        function dragended(d) {
            if (!d3version4.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    })
}

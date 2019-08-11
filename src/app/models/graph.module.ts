import * as d3 from 'd3';
import 'd3-selection-multi';
import * as moment from 'moment';
export class GraphModule {
    public constructor() {

    }
    public createGraph(input, graphSelector) {
        console.log('Inside Graph module');
        var configData = input;
        var fontFamily = "Arial";

        var xAxisFontSize = 12,
            yAxisFontSize = 12,
            legendFontSize = 12,
            fontSize = 12;

        if ((fontSize <= 8) || (fontSize >= 13)) {
            fontSize = 12;
        }
        if (((xAxisFontSize <= 8) || (xAxisFontSize >= 15))) {

            xAxisFontSize = 14;
        }
        if (((yAxisFontSize <= 8) || (yAxisFontSize >= 15))) {

            yAxisFontSize = 14;

        }
        if (((legendFontSize <= 8) || (legendFontSize >= 15))) {

            legendFontSize = 14;
        }

        const svg = d3.select(graphSelector),
            margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = +svg.property('width').baseVal.value - margin.left - margin.right,
            height = +svg.property('height').baseVal.value - margin.top - margin.bottom;
        svg.attr('viewBox', '0 0 ' + (svg.property('width').baseVal.value) + ' ' + (svg.property('height').baseVal.value));
        svg.attr('preserveAspectRatio', 'none');

        var duration = 250;
        var circleOpacity = '0.85';
        var circleRadius = 3;
        var circleRadiusHover = 6;
        var barWidth = 20;
        var ymaxValues = [];
        var xdomainMax = [];
        var xdomainMin = [];
        var dataElement;
        var dataValuesBarCount = 0;
        var dataValuesDot = false;
        var dataValuesLine = false;
        var data = configData.data;

        console.log("data", data);

        for (let i = 0; i < input.length; ++i) {
            console.log(input[i]);
            if (i === 0) {
                data = input[i];
            }
        }

        console.log("Inside d3 data", configData);
        // Y2 axis
        var ymaxValues2 = [];
        // UUIDv4 for clips
        var barClip = uniqueIds("clip-bar");
        var pathClip = uniqueIds("clip-path");
        var circleClip = uniqueIds("clip-circle");
        var language = 'en';
        var country = '';
        var locale = language || country;
        const formatTime = function (d) {
            moment.locale(locale);
            return moment(d).format(configData.config.typeProperties.timeFormat);
        };


        var yAxisGrp = [];
        for (let i = 0; i < data.length; ++i) {
            if (data[i].dataConfig.type == 'dot') {
                for (let j = 0; j < data[i].values.length; ++j) {
                    data[i].values[j].r = Number(data[i].dataConfig.css.r) > 1 && Number(data[i].dataConfig.css.r) < 6 ? data[i].dataConfig.css.r : circleRadius;
                }
            }
        }
        data.forEach(function (d, i) {

            if (!yAxisGrp.find((item) => {
                return d.dataConfig.yIndicator === item
            })) {
                yAxisGrp.push(d.dataConfig.yIndicator);
            }
            if (d.dataConfig.yIndicator == 'y0') {

                ymaxValues.push(Number(d3.max(d.values, function (d) {
                    return Number(d.yAxis);
                })));
            } else {
                ymaxValues2.push(Number(d3.max(d.values, function (d) {
                    return Number(d.yAxis);
                })));
            }
            xdomainMax.push(d3.max(d.values, function (d) {
                return d.xAxis;
            }));
            xdomainMin.push(d3.min(d.values, function (d) {
                return d.xAxis;
            }));
            if (d.dataConfig.type == 'line' && !dataValuesLine) {
                dataValuesLine = true;
            }
            if (d.dataConfig.type == 'bar') {
                dataValuesBarCount++;
            }
            if (d.dataConfig.type == 'dot' && !dataValuesDot) {
                d.values, function (d, i) {
                    d.values[i].r = 4;
                }
                dataValuesDot = true;
            }
        });

        /* Scale */
        var xScale = d3.scaleTime()
            .domain([d3.min(xdomainMin), d3.max(xdomainMax)])
            .rangeRound([0, width]);

        var origScale = d3.scaleTime()
            .domain([d3.min(xdomainMin), d3.max(xdomainMax)])
            .rangeRound([0, width]);

        const focus = svg.append("g").attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        /* Add Axis into SVG */
        var xAxis = d3.axisBottom(xScale).ticks(3).tickFormat(formatTime);


        const xtext = focus.append("g")
            .attr("class", "axis axis--x")
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        const xaxistext = focus.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .attr("class", "axisText")
            .attr("font-size", xAxisFontSize)
            .text(configData.config.typeProperties.xAxisText);

        xaxistext.attr("x", -(xtext._groups[0][0].getBBox().height + xaxistext._groups[0][0].getBBox().width) / 2);


        // Y Axis Settings
        var yScaleMap = new Object();

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(ymaxValues) * 1.2])
            .rangeRound([height, 0]);

        var yAxis = d3.axisLeft(yScale).ticks(configData.config.typeProperties.yAxisTicks[0]);
        const ytext = focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        let yaxistext = focus.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -35)
            .attr('dx', '0.75em')
            .attr("class", "axisText")
            .attr("font-size", yAxisFontSize)
            .text(configData.config.typeProperties.yAxisText[0]);

        yaxistext.attr("x", -(ytext._groups[0][0].getBBox().height + yaxistext._groups[0][0].getBBox().width) / 2);
     //   d3.select(graphSelector).find(".axis--y text").css("font-size", yAxisFontSize);
        yScaleMap['y0'] = yScale;
        if (yAxisGrp.length > 1) {
            var yScale2 = d3.scaleLinear()
                .domain([0, d3.max(ymaxValues2) * 1.2])
                .rangeRound([height, 0]);
            var yAxis2 = d3.axisRight(yScale2).ticks(configData.config.typeProperties.yAxisTicks[1]);
            const ytext2 = focus.append("g")
                .attr("class", "axis axis--y")
                .attr("transform", "translate( " + width + ", 0 )")
                .call(yAxis2);

            let yaxistext2 = focus.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', width + 30)
                .attr('dx', '0.75em')
                .attr("class", "axisText")
                .attr("font-size", yAxisFontSize)
                .text(configData.config.typeProperties.yAxisText[1]);

            yaxistext2.attr("x", -(ytext2._groups[0][0].getBBox().height + yaxistext._groups[0][0].getBBox().width) / 2);
            //  d3.select(graphSelector).find(".axis--y text").css("font-size", yAxisFontSize);
            yScaleMap['y1'] = yScale2;
        }
        // Y dynamic settings

        // d3.select(graphSelector).find(".axis line, .axis path").css("stroke", `${configData.config.typeProperties.axisColor}`);
        // d3.select(graphSelector).find(".axis--x text, .axis--y text").css("fill", configData.config.typeProperties.axisColor);
        // d3.select(graphSelector).find(".axisText").css("fill", configData.config.typeProperties.axisTextColor);
        // d3.select(graphSelector).find(".axis--x text, .axis--y text").css(configData.config.typeProperties.axisCss);
        // d3.select(graphSelector).find(".axis--x text, .axis--y text").css("font-family", fontFamily);
        // d3.select(graphSelector).find(".axis--x text").css("font-size", xAxisFontSize);

        dataElement = focus.selectAll('.dataElement')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'dataElement');

        var newMinValue = xScale.invert(xScale(d3.min(xdomainMin)) - (dataValuesBarCount * barWidth / 2) * 1.2);
        var newMaxValue = xScale.invert(xScale(d3.max(xdomainMax)) + (dataValuesBarCount * barWidth / 2) * 1.2);

        xScale.domain([newMinValue, newMaxValue]);
        origScale.domain([newMinValue, newMaxValue]);

        if (dataValuesLine) {
            // Add line into SVG
            var lineY0 = d3.line()
                .curve(d3.curveMonotoneX)
                .x(d => xScale(d.xAxis))
                .y(d => yScale(d.yAxis));

            var lineY1 = d3.line()
                .curve(d3.curveMonotoneX)
                .x(d => xScale(d.xAxis))
                .y(d => yScale2(d.yAxis));

            dataElement.append('path')
                .attr('fill', 'none')
                .attr("class", "line")
                .attr("shape-rendering", "auto")
                .style("stroke", function (d) {
                    return d.dataConfig.color;
                })
                .style("clip-path", `url(#${pathClip})`)
                .attr('d', function (d) {
                    if (d.dataConfig.type == 'line') {
                        if (d.dataConfig.yIndicator == 'y0')
                            return lineY0(d.values);
                        else
                            return lineY1(d.values);
                    } else {
                        d3.select(this).remove('path');
                        return;
                    }
                })
                .attrs(function (d) {
                    return d.dataConfig.css;
                });
            // Adding a tooltip
            if (configData.config.advanced.tooltips && dataElement) {
                yAxisGrp.forEach(function (d, i) {
                    createTooltip(dataElement, yAxisGrp[i], i);
                });
            }

        }
        if (dataValuesDot) {
            yAxisGrp.forEach(function (d, i) {
                drawScatterPlot(yAxisGrp[i], i);
            });
            // Add a tooltip
            if (configData.config.advanced.tooltips && dataElement) {
                yAxisGrp.forEach(function (d, i) {
                    createTooltip(dataElement, yAxisGrp[i], i);
                });

            }
        }
        var count = 0;
        if (dataValuesBarCount != 0) {
            focus.select(".axis--x").call(d3.axisBottom(xScale).ticks(configData.config.typeProperties.xAxisTicks).tickFormat(formatTime));

            yAxisGrp.forEach(function (d, i) {
                drawBar(yAxisGrp[i], i);
            });

            //  Adding a tooltip
            if (configData.config.advanced.tooltips && dataElement) {
                yAxisGrp.forEach(function (d, i) {
                    createTooltip(dataElement, yAxisGrp[i], i);
                });

            }


        }

        // zoom function
        if (configData.config.advanced.zoom && dataElement) {
            enableZoom(svg);
        }

        function drawScatterPlot(yAxisInd, index) {
            var yScale = yScaleMap[yAxisInd];
            dataElement.append("g")
                .style("fill", d => d.dataConfig.color)
                .attrs(function (d) {
                    return d.dataConfig.css;
                })
                .attr("class", "circle-group")
                .selectAll("circle")
                .data(function (d) {
                    if (d.dataConfig.type == 'dot') {
                        if (d.dataConfig.yIndicator == yAxisInd)
                            return d.values;
                        else
                            return [];
                    } else {
                        d3.select(this.__element).remove('g');
                        return [];
                    }
                }).enter()
                .append("g")
                .append("circle")
                .attr("class", "circle-element")
                .attr("id", "circle" + yAxisInd)
                .attr("cx", d => xScale(d.xAxis))
                .attr("cy", d => yScale(d.yAxis))
                .attr("r", d => d.r)
                .style("clip-path", `url(#${circleClip})`)
        }

        function drawBar(yAxisInd, index) {
            var yScale = yScaleMap[yAxisInd];
            dataElement.append("g")
                .style("fill", function (d) {
                    return d.dataConfig.color;
                })
                .attrs(function (d) {
                    return d.dataConfig.css;
                })
                .attr("class", "bar-group")
                .selectAll(".bar")
                .data(function (d) {
                    if (d.dataConfig.type == 'bar' && d.dataConfig.yIndicator == yAxisInd) {
                        d3.select(this).attr("transform", "translate(" + -(dataValuesBarCount - count++ * 2) * (barWidth / 2) + ",0)");
                        return d.values;
                    } else {
                        d3.select(this).remove('g');
                        return [];
                    }
                })
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("id", "bary" + index)
                .style("clip-path", `url(#${barClip})`)
                .attr("x", function (d) {
                    return xScale(d.xAxis);
                })
                .attr("y", function (d) {
                    return yScale(d.yAxis);
                })
                .attr("width", barWidth)
                .attr("height", function (d) {
                    return yScale(0) - yScale(d.yAxis);
                });

        }

        /**
         * method to enable zoom
         */
        function enableZoom(svg) {
            var zoomed = function () {
                var t = d3.event.transform;
                xScale.domain(t.rescaleX(origScale).domain());
                dataElement.selectAll(".line").attr("d", function (d) {
                    if (d.dataConfig.yIndicator == 'y0')
                        return lineY0(d.values);
                    else
                        return lineY1(d.values);

                });
                focus.select(".axis--x").call(xAxis);
                if (configData.config.advanced.tooltips) {
                    yAxisGrp.forEach(function (d, i) {
                        var yScale = yScaleMap[yAxisGrp[i]];
                        focus.selectAll('[id="circle' + yAxisGrp[i] + '"]')
                            .attr("cx", d => xScale(d.xAxis))
                            .attr("cy", function (d) {
                                return yScale(d.yAxis);
                            });
                    });
                }

                dataElement.selectAll(".bar")
                    .attr("x", function (d) {
                        return xScale(d.xAxis);
                    });
                focus.select(".axis--x").call(xAxis);

                d3.select(graphSelector).find(".axis line").css("stroke", `${configData.config.typeProperties.axisColor}`);
                d3.select(graphSelector).find(".axis--x text").css("fill", configData.config.typeProperties.axisColor);
                d3.select(graphSelector).find(".axis--x text").css(configData.config.typeProperties.axisCss);
            }
            var zoom = d3.zoom()
                .scaleExtent([configData.config.advanced.zoomMinScaleExtent, configData.config.advanced.zoomMaxScaleExtent])
                .translateExtent([
                    [0, 0],
                    [width, height]
                ])
                .extent([
                    [0, 0],
                    [width, height]
                ])
                .on("zoom", zoomed);

            svg.select('.focus')
                .insert("rect", ":first-child")
                .attr("class", "zoom")
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .attr("width", width)
                .attr("height", height)
                .call(zoom);

            svg.selectAll('clipPath').remove();

            svg.append("defs")
                .append("clipPath")
                .attr("id", pathClip)
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            svg.append("defs")
                .append("clipPath")
                .attr("id", barClip)
                .append("rect")
                .attr("width", width - ((dataValuesBarCount) * barWidth / 2) - ((dataValuesBarCount - 2) * barWidth / 2))
                .attr("transform", "translate(" + (dataValuesBarCount * barWidth / 2) + ",0)")
                .attr("height", height);

            svg.append("defs")
                .append("clipPath")
                .attr("id", circleClip)
                .append("rect")
                .attr("width", width + 2 * circleRadiusHover)
                .attr("transform", "translate(-" + circleRadiusHover + ",0)")
                .attr("height", height);
        }

        /*Adding legends */
        if (configData.config.advanced.legends && dataElement) {
            addLegends();

        }

        /**
         * method to add legends
         */
        function addLegends() {
            let dataLength = 0;
            const offset = 30;

            dataElement.append("g")
                .attr("class", "legend")
                .each(function (d, i) {
                    const g = d3.select(this);
                    const parameter = 10;
                    g.append('rect')
                        .attr('class', 'legendRect')
                        .attr('x', dataLength)
                        .attr('width', parameter)
                        .attr('height', parameter)
                        .attr('y', 5)
                        .style('fill', function (d) {
                            return d.dataConfig.color;
                        });
                    let text = g.append('text')
                        .attr('class', 'legendText')
                        .attr('x', dataLength + 15)
                        .attr('y', 15)
                        .attr("font-family", fontFamily)
                        .attr("font-size", legendFontSize)
                        .text(function (d) {
                            return d.dataConfig.legends;
                        });
                    dataLength += text._groups[0][0].getBBox().width + offset;
                });

            dataElement.select(".legend").attr('transform', 'translate(' + (width + margin.right - dataLength - 5) + ', -25)');
        }

        /**
         * method to create tooltip
         * @param {} dataElement
         */
        function createTooltip(dataElement, yAxisInd, index) {
            var yScale = yScaleMap[yAxisInd];

            function getMouseOverValues(d) {
                var tooltip = d3.select(this)
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${+d.yAxis.toFixed(configData.config.typeProperties.decimalDigits)}` + ' ' + configData.config.typeProperties.yUnit[yAxisInd.includes('0') ? 0 : 1])
                    .attr("x", d => xScale(d.xAxis) + 5)
                    .attr("y", d => yScale(d.yAxis) - 10);

                var position = d3.mouse(this);
                if (position[0] < (width / 2)) {
                    tooltip.style("text-anchor", "start");
                } else {
                    tooltip.style("text-anchor", "end");
                }
            }

            function getMouseOutValues() {
                d3.select(this)
                    .style("cursor", "none")
                    .transition()
                    .duration(duration)
                    .selectAll(".text").remove();
            }

            dataElement.append("g")
                .style("fill", d => d.dataConfig.color)
                .attr("class", "circle-group")
                .selectAll("circle")
                .data(function (d) {
                    if (d.dataConfig.type == 'line') {
                        if (d.dataConfig.yIndicator == yAxisInd)
                            return d.values;
                        else
                            return [];
                    } else {
                        d3.select(this.__element)
                            .remove('g');
                        return [];
                    }
                }).enter()
                .append("g")
                .attr("class", "circle")
                .on("mouseover", function (d) {
                    getMouseOverValues.call(this, d);
                })
                .on("mouseout", function (d) {
                    getMouseOutValues.call(this);
                })
                .append("circle")
                .attr("class", "circle-element")
                .attr("id", "circle" + yAxisInd)
                .attr("cx", d => xScale(d.xAxis))
                .attr("cy", d => yScale(d.yAxis))
                .attr("r", circleRadius)
                .style("clip-path", `url(#${circleClip})`)
                .style('opacity', circleOpacity)
                .on("mouseover", function (d) {
                    d3.select(this)
                        .transition()
                        .duration(duration)
                        .attr("r", circleRadiusHover);
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .transition()
                        .duration(duration)
                        .attr("r", circleRadius);
                });

            dataElement.selectAll("circle")
                .data(function (d) {
                    if (d.dataConfig.type == 'dot') {
                        if (d.dataConfig.yIndicator == yAxisInd)
                            return d.values;
                        else
                            return [];
                    }
                    else {
                        d3.select(this.__element)
                            .remove('g');
                        return [];
                    }

                })
                .on("mouseover", function (d) {
                    getMouseOverValues.call(this.parentNode, d);
                })
                .on("mouseout", function (d) {
                    getMouseOutValues.call(this.parentNode);
                });

            dataElement.selectAll('[id="bary' + index + '"]')
                .on("mouseover", function (d) {

                    var tooltip = d3
                        .select(this.parentNode)
                        .insert("text", ":first-child")
                        .style("cursor", "pointer")
                        .attr("class", "text")
                        .text(`${d.yAxis.toFixed(configData.config.typeProperties.decimalDigits)}` + ' ' + configData.config.typeProperties.yUnit[yAxisInd.includes('0') ? 0 : 1])
                        .style("text-anchor", "start");
                    tooltip.attr('transform', `translate(${xScale(d.xAxis) + barWidth / 2}, ${yScale(d.yAxis) - 5}) rotate(270)`);
                })
                .on("mouseout", function (d) {
                    getMouseOutValues.call(this.parentNode);
                });


        }

        function uniqueIds(id) {
            return id + "-" + Math.floor((Math.random() * 10000) + 1);;
        }



    }

}


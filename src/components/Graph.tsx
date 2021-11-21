import React, { useEffect } from "react";
import * as d3 from "d3";
import Network from "../models/Network";
import { d3Link, d3Node, GraphType, point } from "../models/types/types";
import { SimulationNodeDatum } from "d3";

type DataType = {
  data: Network | undefined;
};

function Graph({ data }: DataType) {
  const d3Chart = React.useRef<SVGSVGElement>();

  const initDataToUse = () => {
    //with data create a graph js object
    if (data) {
      //init graph
      const graphObj: GraphType = {
        nodes: [], // arr is an array off router
        links: [],
      };

      //create every links and push them into our graph object
      data.getRouters().forEach((r) => {
        graphObj.nodes.push({ id: r.getName(), value: r.getPonderation() });
        r.getConnections().forEach((connexion) => {
          //check if the link already exist in a direction or in an other.
          //If not , create the link and add it
          if (
            graphObj.links.includes({
              source: r.getName(),
              target: connexion.getName(),
            }) ||
            graphObj.links.includes({
              source: connexion.getName(),
              target: r.getName(),
            })
          )
            return;
          //if one of the router is down break the link
          if (
            r.getStatus() === "SERVER_DOWN" ||
            connexion.getStatus() === "SERVER_DOWN"
          )
            return;
          const link: d3Link = {
            source: r.getName(),
            target: connexion.getName(),
          };
          graphObj.links.push(link);
        });
      });
      return graphObj;
    }
  };

  useEffect(() => {
    const dataToUse = initDataToUse();
    if (dataToUse) console.log("ok", dataToUse);
    //select the global svg
    const context: any = d3.select(d3Chart.current);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3
      .forceSimulation()
      .nodes(dataToUse.nodes as SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink()
          .id((d: any) => {
            return d.id;
          })
          .strength(0.2)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(1000 / 2, 500 / 2));

    const node = context //create the container of the router <g> and all the routers as circle based on data.nodes
      .append("g")
      .attr("className", "nodes")
      .selectAll("circle")
      .data(dataToUse.nodes)
      .enter()
      .append("circle")
      .attr("r", 25)
      .attr("fill", "rgb(128,90,213)")
      .attr("stroke", "white")
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded),
      );

    const link = context // create the container of all ligne <g> and all the line of the graph based of data.links
      .append("g")
      .attr("className", "links")
      .selectAll("line")
      .data(dataToUse.links)
      .enter()
      .append("line")
      .attr("strokeWidth", 0.5)
      .attr("stroke", "white");

    node.append("title").text(function (d: d3Node) {
      return d.id;
    });

    const label = context
      .append("g")
      .attr("className", "labels")
      .selectAll("label")
      .data(dataToUse.nodes)
      .enter()
      .append("text")
      .text((d: d3Node) => {
        return d.id;
      })
      .attr("className", "label");

    label.style("text-anchor", "middle").style("font-size", "10px");

    simulation
      .nodes(dataToUse.nodes as SimulationNodeDatum[])
      .on("tick", ticked); // draw the graph

    //@ts-ignore
    simulation.force("link").links(dataToUse.links);
    //simulation.force("link", d3.forceLink().links(dataToUse.links));

    function dragStarted(d: any) {
      if (!d.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d: any) {
      d.fx = d3.forceX;
      d.fy = d3.forceY;
    }

    function dragEnded(d: any) {
      if (!d3.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }

    function ticked() {
      link
        .attr("x1", function (d) {
          return (d as { source: point }).source.x;
        })
        .attr("y1", function (d) {
          return (d as { source: point }).source.y;
        })
        .attr("x2", function (d) {
          return (d as { target: point }).target.x;
        })
        .attr("y2", function (d) {
          return (d as { target: point }).target.y;
        });

      node
        .attr("cx", function (d: point) {
          return d.x;
        })
        .attr("cy", function (d: point) {
          return d.y;
        });

      label
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y;
        });
    }
  }, []);

  return (
    <svg
      className="flex flex-1 w-full bg-green-400"
      ref={d3Chart}
      id="d3"
    ></svg>
  );
}

export default Graph;

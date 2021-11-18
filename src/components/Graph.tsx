import React, { useEffect } from "react";
import * as d3 from "d3";
import Router from "../models/Router";
import Network from "../models/Network";

type GraphType = {
  data: Network | undefined;
};

type GraphObjectType = {
  nodes: { name: string }[]; //list of router
  links: { source: string; target: string }[]; //links between the routers
};

function Graph({ data }: GraphType) {
  const d3Chart: any = React.useRef();

  useEffect(() => {
    //with data create a graph js object
    if (data) {
      //init graph
      const graphObj: GraphObjectType = {
        nodes: [], // arr is an array off router
        links: [],
      };

      //create every links and push them into our graph object
      data.getRouters().forEach((r) => {
        graphObj.nodes.push({ name: r.getName() });
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
          const link = { source: r.getName(), target: connexion.getName() };
          graphObj.links.push(link);
        });
      });

      //select the global svg

      /*
        d3.select("#d3")
          .selectAll("div")
          .data(graphObj.nodes)
          .enter()
          .append("div")
          .text((r) => r.getName());
          */

      var svg = d3.select("#d3"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

      var simulation = d3
        .forceSimulation()
        .force(
          "link",
          d3.forceLink().id(function (d: any) {
            return d.id;
          }),
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      var link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graphObj.links)
        .enter()
        .append("line");

      var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graphObj.nodes)
        .enter()
        .append("circle")
        .attr("r", 2.5)
        .call(d3.drag());
      /*
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
        */

      node.append("title").text(function (r: any) {
        return r.id;
      });

      //simulation.nodes(graphObj.nodes).on("tick", ticked);

      //simulation.force("link").links(graphObj.links);

      function ticked() {
        link
          .attr("x1", function (d: any) {
            return d.source.x;
          })
          .attr("y1", function (d: any) {
            return d.source.y;
          })
          .attr("x2", function (d: any) {
            return d.target.x;
          })
          .attr("y2", function (d: any) {
            return d.target.y;
          });

        node
          .attr("cx", function (d: any) {
            return d.x;
          })
          .attr("cy", function (d: any) {
            return d.y;
          });
      }
    }
  });

  return (
    <div className="flex flex-1 w-full bg-green-400" id="d3">
      {/*
         <svg id="d3" className="w-full h-full" ref=""></svg>
        */}
    </div>
  );
}

export default Graph;

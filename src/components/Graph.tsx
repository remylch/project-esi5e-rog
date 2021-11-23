import React, { useEffect } from "react";
import * as d3 from "d3";
import Network from "../models/Network";
import { d3Link, d3Node, datum, GraphType, point } from "../models/types/types";
import { D3DragEvent, SimulationNodeDatum } from "d3";
import { useRecoilState } from "recoil";
import { counterTest } from "../store/store";
import { Topology } from "../models/enum";
import Router from "../models/Router";

type DataType = {
  data: Network | undefined;
};

function Graph({ data }: DataType) {
  const d3Chart = React.useRef<SVGSVGElement>(); // ref element of the html svg

  const [counter] = useRecoilState(counterTest);

  /**
   * @description init the data to create the graph
   */
  const initDataToUse = () => {
    //with data create a graph js object
    if (data) {
      //init graph
      const graphObj: GraphType = {
        nodes: [], // arr is an array off router
        links: [],
      };

      //INIT ROUTERS FOR PROVIDED TOPOLOGY
      switch (data.getTopology()) {
        case Topology.BUS_A_DIFFUSION:
          break;
        case Topology.ETOILE_A_DIFFUSION:
          break;
        case Topology.RING:
          data.getRouters().forEach((r) => {
            graphObj.nodes.push({ id: r.getName(), value: r.getPonderation() });
            //find next router in all the routers
            const routerToFind: Router | undefined = data
              .getRouters()
              .find((rf) => rf.getName() === `Router-${r.getId() + 1}`);
            //if exist create link with him else no router left so connect to the first one
            if (!routerToFind) {
              //link r with firt router of the graph
              const link: d3Link = {
                source: r.getName(),
                target: "Router-0",
              };
              graphObj.links.push(link);
            } else {
              const link: d3Link = {
                source: r.getName(),
                target: routerToFind.getName(),
              };
              graphObj.links.push(link);
            }
          });
          return graphObj;
        case Topology.TREE:
          break;
        case Topology.RANDOM:
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
    }
  };

  useEffect(() => {
    //cleanup svg before re rendering
    if (counter !== 0) {
      const nodes = document.getElementById("nodes");
      const links = document.getElementById("links");
      const labels = document.getElementById("labels");
      d3Chart.current.removeChild(nodes);
      d3Chart.current.removeChild(links);
      d3Chart.current.removeChild(labels);
    }
    //console.log("data", data);
    const dataToUse = initDataToUse(); //data that we prepare before create the graph
    //console.log("data updated", dataToUse);

    //select the global svg
    const context: any = d3.select(d3Chart.current); // select the element in the html as context for the graph
    //const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3 // create the simulation
      .forceSimulation()
      .nodes(dataToUse.nodes as SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink()
          .id((d: any) => {
            return d.id;
          })
          .strength(1)
          .distance(200),
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(1000 / 2, 500 / 2));

    const node = context //create the container of the router <g> and all the routers as circle based on data.nodes
      .append("g")
      .attr("className", "nodes")
      .attr("id", "nodes")
      .selectAll("circle")
      .data(dataToUse.nodes)
      .enter()
      .append("circle")
      .style("cursor", "pointer")
      .attr("r", 25)
      .attr("fill", "rgb(128,90,213)")
      .attr("stroke", "white")
      .call(
        d3
          .drag<SVGCircleElement, datum>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded),
      );

    const link = context // create the container of all ligne <g> and all the line of the graph based of data.links
      .append("g")
      .attr("className", "links")
      .attr("id", "links")
      .selectAll("line")
      .data(dataToUse.links)
      .enter()
      .append("line")
      .attr("strokeWidth", 0.5)
      .attr("stroke", "white");

    //give to each node his name (router.id) permit to rely routers with link later
    node.append("title").text(function (d: d3Node) {
      return d.id;
    });

    const label = context // create the container of all text <g> and all the label of the graph based of data.nodes
      .append("g")
      .attr("className", "labels")
      .attr("id", "labels")
      .selectAll("label")
      .data(dataToUse.nodes)
      .enter()
      .append("text")
      .text((d: d3Node) => {
        return d.id;
      })
      .attr("className", "label");

    //place the name of the router of center of it
    label.style("text-anchor", "middle").style("font-size", "10px");

    //create the routers of the graph
    simulation
      .nodes(dataToUse.nodes as SimulationNodeDatum[])
      .on("tick", ticked); // draw the graph

    //create the links of the graph between the routers
    //@ts-ignore
    simulation.force("link").links(dataToUse.links);

    /* functions to move the element of graph (router) */
    // @ts-ignore
    function dragStarted(event: D3DragEvent<SVGCircleElement>, d: datum) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(
      event: D3DragEvent<SVGCircleElement, never, never>,
      d: datum,
    ) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(
      event: D3DragEvent<SVGCircleElement, never, never>,
      d: datum,
    ) {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = event.x; //null to re-center
      d.fy = event.y; // null to re-center
    }
    /*
    function zoom() {
      const container = d3.select("#d3");
      const zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent([
          [100, 100],
          [300, 300],
        ])
        .extent([
          [100, 100],
          [200, 200],
        ])
        .on("zoom", (event) => {
          let { x, y, k } = event.transform;
          x = 0;
          y = 0;
          k *= 1;
          container
            .attr("transform", `translate(${x}, ${y})scale(${k})`)
            .attr("width");
        });
    }
    */

    //place the differents element in graph
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
  }, [counter]); // [data] permit to run the useEffect every time data in props are changed (like update router etc...)

  return (
    <svg
      className="flex flex-1 w-full bg-green-400 overflow-y-scroll overflow-x-scroll"
      ref={d3Chart}
      id="d3"
    ></svg>
  );
}

export default Graph;

import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import Network from "../models/Network";
import {
  d3Link,
  d3Node,
  datum,
  GraphType,
  point,
  TypeDataForDjikstra,
} from "../models/types/types";
import { D3DragEvent, SimulationNodeDatum } from "d3";
import { useRecoilState, useSetRecoilState } from "recoil";
import { algorithmState, counterTest, routersState } from "../store/store";
import { Topology } from "../models/enum";
import Router from "../models/Router";
import djisktra, { setupDataForDjikstra } from "../utils/algorithms/Djisktra";

type DataType = {
  data: Network | undefined;
};

function Graph({ data }: DataType) {
  const d3Chart = React.useRef<SVGSVGElement>(); // ref element of the html svg
  const setRoutersForSelect = useSetRecoilState(routersState);
  const [counter] = useRecoilState(counterTest);
  const [algorithm] = useRecoilState(algorithmState);

  const [tempStateData, setTempStateData] = useState<GraphType>(null);
  const [dataForDjikstra, setDataForDjikstra] =
    useState<TypeDataForDjikstra>(null);

  /**
   * @description init the data to create the graph
   */
  const initDataToUse = () => {
    //with data create a graph js object
    if (data) {
      const tempListLink: { source: string; target: string }[] = [];
      //init graph
      const graphObj: GraphType = {
        nodes: [], // arr is an array of router
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
            graphObj.nodes.push({ id: r.getName() });
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
              //setup random ponderation
              let randomPonderation = Math.floor(Math.random() * (100 - 0) + 0);

              const link: d3Link = {
                source: r.getName(),
                target: routerToFind.getName(),
                weight: randomPonderation,
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
            graphObj.nodes.push({ id: r.getName() });
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

              //setup random ponderation between 1 and 9 included
              let randomPonderation = Math.floor(Math.random() * (9 - 0) + 1);

              const link: d3Link = {
                source: r.getName(),
                target: connexion.getName(),
                weight: randomPonderation,
              };

              const reverseLink: d3Link = {
                source: connexion.getName(),
                target: r.getName(),
                weight: randomPonderation,
              };

              let tempLink = {
                source: r.getName(),
                target: connexion.getName(),
              };

              let tempReverseLink = {
                source: connexion.getName(),
                target: r.getName(),
              };

              const a = tempListLink.find(
                (link) =>
                  link.source === tempLink.source &&
                  link.target === tempLink.target,
              );
              //check if the link already exists between the two points since we create the bi-directionnal link / router in the foreach loop
              if (!a) {
                graphObj.links.push(link);
                graphObj.links.push(reverseLink);
                //push them to check if links are already in our graph obj
                tempListLink.push(tempLink);
                tempListLink.push(tempReverseLink);
              }
            });
          });
      }
      return graphObj;
    }
  };

  useEffect(() => {
    let dataToUse: GraphType = null;
    if (tempStateData === null) {
      dataToUse = initDataToUse(); //data that we prepare before create the first graph without algo
      setTempStateData(dataToUse);
    } else {
      dataToUse = tempStateData; // data already prepared before, lets apply algorithm
    }

    //set the routersState Store to update the select input on sidebar component
    dataToUse.nodes.forEach((node: d3Node) =>
      setRoutersForSelect((oldrouterList) => [
        ...oldrouterList,
        { name: node.id },
      ]),
    );

    //transform data for djikstra
    if (!dataForDjikstra) {
      console.log("initialize data for djikstra");
      const tempDataForDjikstra = setupDataForDjikstra(
        dataToUse.nodes,
        dataToUse.links,
      );
      setDataForDjikstra(tempDataForDjikstra);
    }

    //if algo, start and end are defined perform djikstra
    if (
      dataForDjikstra &&
      algorithm.algo === "Djikstra" &&
      algorithm.r1 !== "" &&
      algorithm.r2 !== ""
    ) {
      const resultDjikstra = djisktra(
        dataForDjikstra,
        algorithm.r1.toString(),
        algorithm.r2.toString(),
        dataToUse,
      );
      dataToUse = resultDjikstra.updatedGraph;
      alert(`Shortest path : ${resultDjikstra.path}`);
    }

    //select the global svg
    const context: any = d3.select(d3Chart.current); // select the element in the html as context for the graph

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
      .attr("stroke", (d: d3Link) => {
        return d.color ? d.color : "white";
      });

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

    const weight = context
      .append("g")
      .attr("className", "weights")
      .attr("id", "weights")
      .selectAll("weight")
      .data(dataToUse.links)
      .enter()
      .append("text")
      .text((d: d3Link) => {
        return d.weight ? d.weight.toString() : "0";
      });

    //place the name of the router of center of it
    label.style("text-anchor", "middle").style("font-size", "10px");

    weight.style("font-size", "15px").style("color", "black");

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

      weight
        .attr("x", function (d: { source: point; target: point }) {
          return (d.source.x + d.target.x) / 2;
        })
        .attr("y", function (d: { source: point; target: point }) {
          return (d.source.y + d.target.y) / 2 + 10;
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

    return () => {
      //cleanupFunction before re-render
      console.log("Cleanup");
      //remove everything of the graph
      simulation.stop();
      cleanup();
    };
  }, [counter, algorithm]); // [data] permit to run the useEffect every time data in props are changed (like update router etc...)
  //Counter is updated every time a router is disabled or enabled

  function cleanup() {
    //cleanup Graph
    const nodes = document.getElementById("nodes");
    if (nodes) nodes.remove();
    const links = document.getElementById("links");
    if (links) links.remove();
    const labels = document.getElementById("labels");
    if (labels) labels.remove();
    const weights = document.getElementById("weights");
    if (weights) weights.remove();
    //cleanup routersAvailable in store
    setRoutersForSelect([]);
  }

  return (
    <svg
      className="flex flex-1 w-full bg-green-400 overflow-y-scroll overflow-x-scroll"
      ref={d3Chart}
      id="d3"
    ></svg>
  );
}

export default Graph;

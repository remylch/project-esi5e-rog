import React from "react";
import { GlobeAltIcon } from "@heroicons/react/outline";
import Router from "../models/Router";
import { Status } from "../models/enum";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useRecoilState, useSetRecoilState } from "recoil";
import { clientProperGraph, isOpenModalClientGraph } from "../store/store";
import { GraphType } from "../models/types/types";

const animatedComponents = makeAnimated();

function ModalNetwork({ setNetworkInitialized }) {
  const [clientGraph, setClientGraph] = useRecoilState(clientProperGraph);
  const [nbRouter, setNbRouter] = React.useState<number>(3);
  const [routers, setRouters] = React.useState<Router[]>([]);
  const [steps, setSteps] = React.useState({
    nbRouterValidate: false,
    linkDone: false,
    ponderationDone: false,
  });

  const handleChangeNbRouter = (e: any) => setNbRouter(e.target.value);

  function validateNbRouter(e: any): void {
    e.preventDefault();
    //cleanup first then add routers
    setRouters([]);
    for (let i = 0; i < nbRouter; i++) {
      const name: string = `Router-${i}`;
      const newRouter = new Router(i, name, Status.SERVER_UP, []);
      //add router to the list
      setRouters((oldArr) => [...oldArr, newRouter]);
    }
    setSteps({ ...steps, nbRouterValidate: true });
  }

  const [liaisons, setLiaisons] = React.useState([]);
  const [liaisonsForPonderation, setLiaisonForPonderation] = React.useState([]);

  const [tempLiaisons, setTempLiaisons] = React.useState({});

  function handleChangeSelection(e: any, id: any) {
    setTempLiaisons({ ...tempLiaisons, [id]: e });
  }

  function linkRouters() {
    console.log("linking");
    const listLinkForPonderation = [];
    const listLink = [];
    //do the link between routers
    for (let item in tempLiaisons) {
      if (Object.prototype.hasOwnProperty.call(tempLiaisons, item)) {
        tempLiaisons[item].forEach(
          (item: { source: string; value: string; label: string }) => {
            //create link
            let newLink = { source: item.source, target: item.value };
            let reversedLink = { source: item.value, target: item.source };
            let l = listLink.find(
              (link) =>
                (link.source === item.source && link.target === item.value) ||
                (link.source === item.value && link.target === item.source),
            );
            if (!l) {
              listLink.push(newLink);
              listLink.push(reversedLink);
              listLinkForPonderation.push(newLink);
            }
          },
        );
      }
    }
    setLiaisons(listLink);
    setLiaisonForPonderation(listLinkForPonderation);
    setSteps({ ...steps, linkDone: true });
  }

  function handleChangeValueRouter(e: any, source: string, target: string) {
    e.preventDefault();
    const l1 = liaisons.find((l) => l.source === source && l.target === target);
    const l2 = liaisons.find((l) => l.target === source && l.source === target);
    l1.weight = e.target.value;
    l2.weight = e.target.value;
  }

  const storeUtils = {
    setUpGraphInStore: (graph: GraphType) => {
      setClientGraph(graph);
    },
  };

  function generateNetwork(e: any) {
    e.preventDefault();
    let graph: GraphType = {
      nodes: [],
      links: [],
    };
    liaisons.forEach((l) => {
      const node = graph.nodes.find((nf) => nf.id === l.source.toString());
      //add every node only once
      if (node === undefined) {
        graph.nodes.push({ id: l.source });
      }
      //add every links
      graph.links.push({
        source: l.source,
        target: l.target,
        weight: l.weight,
      });
    });
    storeUtils.setUpGraphInStore(graph);
    setNetworkInitialized();
    closeModal();
  }

  const setOpenModal = useSetRecoilState(isOpenModalClientGraph);

  const closeModal = () => setOpenModal(false);

  return (
    <>
      <div className={`fixed z-10 inset-0 overflow-y-auto`}>
        <div
          className={`flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0`}
        >
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {/* Modal square */}
          <div
            className={`inline-block border-2 ${
              steps.linkDone && "w-3/4"
            } border-blue-200 align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform duration-150 transition-all sm:my-8 sm:align-middle sm:p-6`}
          >
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <GlobeAltIcon
                  className="h-6 w-6 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                Mon réseau
              </h3>
              <div className="mt-3 flex sm:mt-5">
                <div
                  className={`flex flex-1 flex-col ${
                    liaisonsForPonderation.length > 0 &&
                    "border-r-2 border-black"
                  } pr-5`}
                >
                  <label className="font-semibold text-sm">
                    Choisissez le nombre de routeur (3-20) :
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      onChange={handleChangeNbRouter}
                      value={nbRouter}
                      min="3"
                      max="20"
                      type="number"
                      className="input w-full"
                    />
                    <button
                      className="btn-inline h-12 mt-3"
                      onClick={validateNbRouter}
                    >
                      Ok
                    </button>
                  </div>
                  {routers.map((r) => {
                    const options: {
                      label: string;
                      value: string;
                      source: string;
                    }[] = [];
                    routers.forEach((r2) => {
                      if (r2.getName() !== r.getName()) {
                        options.push({
                          value: r2.getName(),
                          label: r2.getName(),
                          source: r.getName(),
                        });
                      }
                    });
                    return (
                      <div key={r.getId()} className="flex flex-col mt-5">
                        <label>{r.getName()} :</label>
                        Choisir les connexions de {r.getName()} :
                        <Select
                          onChange={(e) =>
                            handleChangeSelection(e, r.getName())
                          }
                          options={options}
                          isMulti
                          components={animatedComponents}
                        />
                      </div>
                    );
                  })}
                  {steps.nbRouterValidate ? (
                    <button
                      className="btn-inline w-full mt-5"
                      onClick={linkRouters}
                    >
                      Valider les liaisons
                    </button>
                  ) : (
                    <button className="btn-inline--disabled w-full mt-5">
                      Valider les liaisons
                    </button>
                  )}
                </div>

                {/* Ponderation */}
                {liaisonsForPonderation.length > 0 && (
                  <div className="flex flex-col pl-5 w-full flex-1">
                    <h3 className="font-semibold text-sm text-center">
                      Pondération
                    </h3>
                    <div className="flex w-full flex-col">
                      {liaisonsForPonderation.map((liaison) => {
                        return (
                          <div
                            className="mb-3"
                            key={liaison.source + liaison.target}
                          >
                            <h3>
                              Entre {liaison.source} et {liaison.target} :
                            </h3>
                            <input
                              className="input w-full"
                              type="number"
                              min="1"
                              max="9"
                              onChange={(e) =>
                                handleChangeValueRouter(
                                  e,
                                  liaison.source,
                                  liaison.target,
                                )
                              }
                            />
                          </div>
                        );
                      })}
                      <button
                        className="btn-inline mt-5"
                        onClick={() =>
                          setSteps({ ...steps, ponderationDone: true })
                        }
                      >
                        Valider la pondération
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex justify-center w-full border-black rounded-md border border-transparent shadow-sm px-4 py-2 bg-white-600 text-base font-medium text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:text-sm"
                onClick={closeModal}
              >
                Close
              </button>
              {steps.linkDone &&
              steps.nbRouterValidate &&
              steps.ponderationDone ? (
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  onClick={generateNetwork}
                >
                  {" "}
                  Générer le réseau
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-inline--disable w-full bg-gray-300 rounded-md text-white cursor-not-allowed"
                >
                  Générer le réseau
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalNetwork;

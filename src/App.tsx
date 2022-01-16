import React from "react";
import { useRecoilState } from "recoil";
import "./App.css";
import Graph from "./components/Graph";
import RoutingTable from "./components/RoutingTable";
import Sidebar from "./components/Sidebar";
import Network from "./models/Network";
import {
  clientProperGraph,
  counterTest,
  isOpenModalResultState,
  resultAlgo,
} from "../src/store/store";
import Modal from "./components/Modal";

type DataStateType = {
  network: Network | undefined;
  algo: string;
};

function App() {
  const [dataState, setDataState] = React.useState<DataStateType>({
    network: undefined,
    algo: "",
  });
  const [clientGraph, setClientGraph] = useRecoilState(clientProperGraph);
  const [counter, setCounter] = useRecoilState(counterTest);
  const [dataResultAlgo] = useRecoilState(resultAlgo);
  const [isOpenModal, setOpenModal] = useRecoilState(isOpenModalResultState);
  const updateNetworkState = (network: Network) => {
    setDataState({ ...dataState, network });
  };

  function updateRouterStatus(id: number) {
    let router = dataState.network?.getRouters().find((r) => r.getId() === id);
    router?.changeStatus();
    setDataState({ ...dataState }); //update data state with the actual data state to refresh the component
    setCounter(counter + 1);
  }

  function removeAllData() {
    setDataState({ network: undefined, algo: "" });
  }

  function updateModal() {
    if (isOpenModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  }

  return (
    <div className="flex flex-1">
      <Modal open={isOpenModal} setOpen={updateModal} path={dataResultAlgo} />
      <div className="flex w-96">
        <Sidebar
          updateData={updateNetworkState}
          removeAllData={removeAllData}
        />
      </div>
      <div className="flex flex-1 flex-col">
        {dataState.network !== undefined ? (
          <>
            <Graph data={dataState.network} />
            <RoutingTable
              data={dataState.network}
              updateStatusFunction={updateRouterStatus}
            />
          </>
        ) : (
          clientGraph.nodes.length > 0 && <Graph data={dataState.network} />
        )}
      </div>
    </div>
  );
}

export default App;

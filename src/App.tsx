import React from "react";
import { useRecoilState } from "recoil";
import "./App.css";
import Graph from "./components/Graph";
import RoutingTable from "./components/RoutingTable";
import Sidebar from "./components/Sidebar";
import Network from "./models/Network";
import { counterTest } from "../src/store/store";

type DataStateType = {
  network: Network | undefined;
  algo: string;
};

function App() {
  const [dataState, setDataState] = React.useState<DataStateType>({
    network: undefined,
    algo: "",
  });

  const [counter, setCounter] = useRecoilState(counterTest);

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

  return (
    <div className="flex flex-1">
      <div className="flex w-96">
        <Sidebar
          updateData={updateNetworkState}
          removeAllData={removeAllData}
        />
      </div>
      <div className="flex flex-1 flex-col">
        {dataState.network !== undefined && (
          <>
            <Graph data={dataState.network} />
            <RoutingTable
              data={dataState.network}
              updateStatusFunction={updateRouterStatus}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

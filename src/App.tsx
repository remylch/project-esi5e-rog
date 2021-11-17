import React from "react";
import "./App.css";
import Graph from "./components/Graph";
import RoutingTable from "./components/RoutingTable";
import Sidebar from "./components/Sidebar";
import Network from "./models/Network";

type DataStateType = {
  network: Network | undefined;
  algo: string;
};

function App() {
  const [dataState, setDataState] = React.useState<DataStateType>({
    network: undefined,
    algo: "",
  });

  const updateNetworkState = (network: Network) => {
    setDataState({ ...dataState, network });
  };

  return (
    <div className="flex flex-1">
      <div className="flex w-96">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        {dataState.network !== undefined && (
          <>
            <Graph data={dataState} />
            <RoutingTable data={dataState.network} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

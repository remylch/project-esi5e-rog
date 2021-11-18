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

  function updateRouterStatus(id: number) {
    let router = dataState.network?.getRouters().find((r) => r.getId() === id);
    router?.changeStatus();
    console.log(dataState.network?.getRouters());
    setDataState({ ...dataState }); //update data state with the actual data state to refresh the component
  }

  function generateNewPonderation(id: number) {
    let router = dataState.network?.getRouters().find((r) => r.getId() === id);
    let randomPonderation = Math.floor(Math.random() * (100 - 0) + 0);
    router?.setPonderation(randomPonderation);
    setDataState({ ...dataState });
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
            <Graph data={dataState} />
            <RoutingTable
              data={dataState.network}
              updateStatusFunction={updateRouterStatus}
              generateNewPonderation={generateNewPonderation}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

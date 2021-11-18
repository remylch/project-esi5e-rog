import React from "react";
import { initNetwork } from "../controller/NetworkController";
import Network from "../models/Network";
import { convertTopology } from "../utils/topology";

type SidebarType = {
  updateData: any;
};

function Sidebar({ updateData }: SidebarType) {
  const [errors, setErrors] = React.useState({
    errMask: false,
    errRouters: false,
    errForm: false,
  });

  const [routersName, setRoutersName] = React.useState({
    r1: "",
    r2: "",
  });

  const [networkInitialized, setNetworkInitialized] =
    React.useState<boolean>(false);
  const [topology, setTopology] = React.useState<string>("");
  const [nbRouters, setNbRouters] = React.useState<number>(0);
  const [algo, setAlgo] = React.useState<string>("");

  const handleChangeRouterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setRoutersName({ ...routersName, [name]: value });
  };
  const handleChangeNbRouter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNbRouters(parseInt(e.target.value));
  };

  const handleChangeTopology = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setTopology(event.target.value);
  };

  const handleChangeAlgo = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgo(event.target.value);
  };

  const removeNetwork = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    setNetworkInitialized(false);
  };

  const sendData = (e: React.FormEvent) => {
    e.preventDefault();
    if (nbRouters === 0) {
      setErrors({ ...errors, errRouters: true });
      return;
    }
    if (topology === "") {
      setErrors({ ...errors, errForm: true });
      return;
    }
    const network: Network = initNetwork(nbRouters, convertTopology(topology));
    updateData(network); // update the data state on the app component
    setNetworkInitialized(true); //open box when network is init
  };

  return (
    <div className="flex flex-col  bg-blue-500 min-h-screen p-5">
      <h1 className="font-bold text-white text-xl self-center mt-3">
        Projet routage
      </h1>
      <form className="flex flex-col flex-1" onSubmit={sendData}>
        <section className="m-5 p-5 flex flex-col bg-white rounded-3xl w-full self-center items-center">
          <label className="w-3/4">
            <span>Nombe de routeurs</span>
            <input
              min="0"
              className="input w-full"
              placeholder="Choisir le nombre de routeur"
              type="number"
              value={nbRouters}
              onChange={handleChangeNbRouter}
            />
          </label>

          <label className="w-3/4 mt-4">
            <span className="text-gray-700">Topologie du réseau</span>
            <select
              className="h-10 mt-1 block w-full rounded-lg ring ring-offset-2 focus:outline-none"
              onChange={handleChangeTopology}
            >
              <option>Random</option>
              <option>Tree</option>
              <option>Star</option>
              <option>Ring</option>
              <option>Bus à diffusion</option>
              <option>Etoile à diffusion</option>
            </select>
          </label>
          {errors.errForm && (
            <p className="text-red-500 mt-3">
              Please select a form for your network.
            </p>
          )}
          {errors.errRouters && (
            <p className="text-red-500 mt-3">
              Cannot create a network with 0 routers.
            </p>
          )}
          {errors.errMask && (
            <p className="text-red-500 mt-3">Please type a correct mask.</p>
          )}
        </section>
        <button type="submit" className="btn-inline justify-end">
          Créer mon réseau
        </button>
      </form>
      {/* Path */}
      {networkInitialized && (
        <>
          <section className="flex flex-col bg-white rounded-3xl mt-5 pt-3 pb-5">
            <div
              className="flex items-center text-sm self-end mr-5 cursor-pointer text-white bg-gray-300 hover:bg-gray-400 p-1"
              onClick={removeNetwork}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Supprimer le réseau
            </div>

            <div className="gap-5 flex items-center mx-5">
              <input
                className="input"
                placeholder="Routeur 1"
                type="text"
                value={routersName.r1}
                onChange={handleChangeRouterName}
                name="r1"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <input
                className="input"
                placeholder="Routeur 2"
                type="text"
                value={routersName.r2}
                onChange={handleChangeRouterName}
                name="r2"
              />
            </div>
            <span className="text-gray-700 mt-5 mx-5">
              Algorithme de routage
            </span>
            <select className="input self-center" onChange={handleChangeAlgo}>
              <option></option>
              <option>Djikstra</option>
              <option>Ospf</option>
            </select>
          </section>
          <button type="submit" className="btn-inline justify-end mt-5">
            Trouver le chemin
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;

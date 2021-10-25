import React from "react";
import {
  initBusADiffusion,
  initEtoileADiffusion,
  initRing,
  initStar,
  initTree,
} from "../controller/controller";

function Sidebar() {
  const [errors, setErrors] = React.useState({
    errMask: false,
    errRouters: false,
    errForm: false,
  });

  const [formReseau, setFormReseau] = React.useState<string>("");
  const [mask, setMask] = React.useState<string>("");
  const [nbRouters, setNbRouters] = React.useState<number>(0);

  const handleChangeNbRouter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNbRouters(parseInt(e.target.value));
  };

  const handleChangeFormReseau = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFormReseau(event.target.value);
  };

  const handleChangeMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMask(e.target.value);
  };

  const sendData = (e: React.FormEvent) => {
    e.preventDefault();
    if (nbRouters === 0) {
      setErrors({ ...errors, errRouters: true });
      return;
    }
    if (formReseau === "") {
      setErrors({ ...errors, errForm: true });
      return;
    }
    if (mask === "") {
      setErrors({ ...errors, errMask: true });
      return;
    }
  };

  return (
    <div className="flex flex-col w-2/6 bg-blue-500 min-h-screen p-5">
      <h1 className="font-bold text-white text-xl self-center mt-3">
        Projet routage
      </h1>
      <form className="flex flex-col flex-1" onSubmit={sendData}>
        <section className="m-5 flex flex-col bg-white rounded-3xl w-full h-full self-center items-center">
          <input
            className="input"
            placeholder="Choisir le nombre de routeur"
            type="number"
            value={nbRouters}
            onChange={handleChangeNbRouter}
          />
          <input
            className="input"
            placeholder="Choisir le masque du réseau"
            type="text"
            value={mask}
            onChange={handleChangeMask}
          />
          <label className="w-3/4 mt-4">
            <span className="text-gray-700">Forme de réseau</span>
            <select
              className="h-10 mt-1 block w-full rounded-lg ring ring-offset-2 focus:outline-none"
              onChange={handleChangeFormReseau}
            >
              <option></option>
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
    </div>
  );
}

export default Sidebar;

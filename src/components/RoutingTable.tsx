import Network from "../models/Network";

type RoutingTable = {
  data: undefined | Network;
  updateStatusFunction: (id: number) => any;
  generateNewPonderation: (id: number) => any;
};

function RoutingTable({
  data,
  updateStatusFunction,
  generateNewPonderation,
}: RoutingTable) {
  return (
    <div className="flex h-56 w-full overflow-y overflow-y-scroll">
      <div className="flex flex-col w-full">
        <div className="w-full">
          <div className=" align-middle inline-block min-w-full w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg w-full">
              <table className="min-w-full w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nb Connected routers
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Connected routers
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ponderation
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data !== undefined &&
                    data.getRouters().map((router) => {
                      const nbConnectedRouters = router.getNbConnectedRouters();
                      return (
                        <tr key={router.getId()}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="">
                                <div className="text-sm font-medium text-gray-900">
                                  {router.getName()}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                router.getStatus() === "SERVER_UP"
                                  ? "text-green-800 bg-green-100"
                                  : "text-red-800 bg-red-100"
                              } `}
                            >
                              {router.getStatus()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {nbConnectedRouters}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {nbConnectedRouters !== 0 ? (
                              <select>
                                <option value=""></option>
                                {router.getConnections().map((r) => (
                                  <option value={r.getName()}>
                                    {r.getName()}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <label>Aucune connexion</label>
                            )}
                          </td>
                          <td className="px-6 flex py-4 whitespace-nowrap text-sm text-gray-500 text-center gap-4 justify-center items-center">
                            {router.getPonderation()}{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 hover:text-indigo-900 cursor-pointer"
                              onClick={() =>
                                generateNewPonderation(router.getId())
                              }
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {router.getStatus() === "SERVER_UP" ? (
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() =>
                                  updateStatusFunction(router.getId())
                                }
                              >
                                Disable
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() =>
                                  updateStatusFunction(router.getId())
                                }
                              >
                                Enable
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoutingTable;

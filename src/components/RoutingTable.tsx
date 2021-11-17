import React from "react";
import { Status } from "../models/enum";
import Router from "../models/Router";

type RoutingTable = {
  data: null | undefined | {};
};

function RoutingTable({ data }: RoutingTable) {
  const routers = [
    {
      name: "Router-1",
      interfaces: ["i1", "i2"],
      status: Status.SERVER_UP,
      connectedRouter: ["Router-2"],
    },
    {
      name: "Router-2",
      interfaces: [],
      status: Status.SERVER_DOWN,
      connectedRouter: [],
    },
  ];
  return (
    <div className="flex h-56 w-full">
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
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {routers.map((router) => {
                    const nbConnectedRouters = router.connectedRouter.length;
                    return (
                      <tr key={router.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="">
                              <div className="text-sm font-medium text-gray-900">
                                {router.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              router.status === "SERVER_UP"
                                ? "text-green-800 bg-green-100"
                                : "text-red-800 bg-red-100"
                            } `}
                          >
                            {router.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {nbConnectedRouters}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {router.connectedRouter.length !== 0 ? (
                            <select>
                              <option value=""></option>
                              {router.connectedRouter.map((r) => (
                                <option value={r}>{r}</option>
                              ))}
                            </select>
                          ) : (
                            <label>Aucune connexion</label>
                          )}
                        </td>
                        {/*
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
                        </td>  
                        */}
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

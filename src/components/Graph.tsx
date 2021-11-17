import React from "react";

type GraphType = {
  data?: {} | [] | null;
};

function Graph({ data }: GraphType) {
  return <div className="flex flex-1 w-full bg-green-400"></div>;
}

export default Graph;

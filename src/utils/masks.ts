export type ValuesMask = {
  mask: string;
  value: string;
};

const masks: ValuesMask[] = [
  { mask: "/8", value: "255.0.0.0" },
  { mask: "/9", value: "255.128.0.0" },
  { mask: "/10", value: "255.192.0.0" },
  { mask: "/11", value: "255.224.0.0" },
  { mask: "/12", value: "255.240.0.0" },
  { mask: "/13", value: "255.248.0.0" },
  { mask: "/14", value: "255.252.0.0" },
  { mask: "/15", value: "255.254.0.0" },
  { mask: "/16", value: "255.255.0.0" },
  { mask: "/17", value: "255.255.128.0" },
  { mask: "/18", value: "255.255.192.0" },
  { mask: "/19", value: "255.255.224.0" },
  { mask: "/20", value: "255.255.240.0" },
  { mask: "/21", value: "255.255.248.0" },
  { mask: "/22", value: "255.255.252.0" },
  { mask: "/23", value: "255.255.254.0" },
  { mask: "/24", value: "255.255.255.0" },
  { mask: "/25", value: "255.255.255.128" },
  { mask: "/26", value: "255.255.255.192" },
  { mask: "/27", value: "255.255.255.224" },
  { mask: "/28", value: "255.255.255.240" },
  { mask: "/29", value: "255.255.255.248" },
  { mask: "/30", value: "255.255.255.252" },
];

export { masks };

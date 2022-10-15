import { Response } from "express";

interface Json {
  status: "error" | "ok";
  data: any;
  message: string;
}

type Send<T = Response> = (body?: Json) => T;

export interface CustomResponse extends Response {
  json: Send<this>;
}

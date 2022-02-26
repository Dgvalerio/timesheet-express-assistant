/* eslint-disable @typescript-eslint/no-empty-interface */
import { RequestHandler } from 'express';
import { Protocol } from 'puppeteer';

export namespace Scrapper {
  export namespace SignIn {
    export interface Params {}

    export interface Request {
      login: string;
      password: string;
    }

    export type Response =
      | {
          cookies: Protocol.Network.Cookie[];
          error?: never;
        }
      | {
          cookies?: never;
          error: string;
        };

    export type Handler = RequestHandler<Params, Response, Request>;
  }

  export namespace Read {
    export namespace Appointment {
      export interface Params {}

      export interface Request {
        cookies: Protocol.Network.Cookie[];
        appointmentId: string;
      }

      export interface Appointment {
        Worksheet: null;
        Require: null;
        Evaluate: null;
        TotalRows: number;
        PageSize: number;
        Table: null;
        Id: number;
        IdRequire: null;
        IdCustomer: number;
        CustomerName: null;
        IdProject: number;
        ProjectName: null;
        StartDate: null;
        EndDate: null;
        IdCell: number;
        CellName: null;
        IdCategory: number;
        IdManager: number;
        IdDeveloper: number;
        IsMaster: boolean;
        IdAncestor: number;
        DeveloperName: null;
        HourValue: null;
        ExtraValue: null;
        CategoryName: null;
        InformedDate: string;
        Created: null;
        StartTime: string;
        EndTime: string;
        TotalTime: null;
        NotMonetize: boolean;
        Description: string;
        CommitRepository: string | null;
        IsDeleted: boolean;
        TotalTimeInProject: null;
        ConsumedTimeInProject: null;
        IdEvaluate: null;
        IsApprove: null;
        IsReprove: null;
        IsReview: null;
        IsWait: null;
        IsPreApproved: null;
        TimePreApproved: null;
        UserPreApproved: null;
        IsPaid: boolean;
        ConsumedTimeInProjectExceded: boolean;
        TimeInWorksheetExceded: number;
        IsEvaluate: boolean;
        TypeReport: null;
        SumTotalTime: null;
        TotaltimeInMinutes: number;
        IdCustomerPreSelected: null;
        IdProjectPreSelected: null;
        IdDeveloperPreSelected: null;
        IsEvaluatePreSelected: boolean;
      }

      export type Response =
        | {
            appointment: Appointment;
            error?: never;
          }
        | {
            appointment?: never;
            error: string;
          };

      export type Handler = RequestHandler<Params, Response, Request>;
    }

    export namespace Appointments {
      export interface Params {}

      export interface Request {
        cookies: Protocol.Network.Cookie[];
      }

      export interface Appointment {
        id: string;
        cliente: string;
        projeto: string;
        categoria: string;
        data: string;
        horaInicial: string;
        horaFinal: string;
        descricao: string;
        naoContabilizado: boolean;
        avaliacao: string;
        commit: string;
      }

      export type Response =
        | {
            appointments: Appointment[];
            error?: never;
          }
        | {
            appointments?: never;
            error: string;
          };

      export type Handler = RequestHandler<Params, Response, Request>;
    }

    export namespace Clients {
      export interface Params {}

      export interface Request {
        cookies: Protocol.Network.Cookie[];
      }

      export interface Client {
        id: string;
        title: string;
        projects: Project[];
      }

      export interface Project {
        Id: number;
        Name: string;
        StartDate: string;
        EndDate: string;
        IdCustomer: number;
        categories: Category[];
        progress: ProjectProgress;
      }

      export interface Category {
        Id: number;
        Name: string;
        IdProject: number;
      }

      export interface ProjectProgress {
        Id: number;
        IdCell: null;
        CellName: null;
        IdCustomer: number;
        CustomerName: string;
        IdProject: number;
        ProjectName: string;
        IsMaintenance: boolean;
        HourLimitPerMonth: null;
        Budget: number;
        NotMonetize: boolean;
        StartDate: string;
        EndDate: string;
        TotalTime: string;
        TotalTimeMounth: string;
        TotalTimeInProject: string;
        ConsumedTimeInProject: string;
      }

      export type Response =
        | {
            clients: Client[];
            error?: never;
          }
        | {
            clients?: never;
            error: string;
          };

      export type Handler = RequestHandler<Params, Response, Request>;
    }
  }

  export namespace Create {
    export namespace Appointment {
      export interface Params {}

      export interface Request {
        cookies: Protocol.Network.Cookie[];
        customer: string;
        project: string;
        category: string;
        informedDate: string;
        startTime: string;
        endTime: string;
        notMonetize: boolean;
        description: string;
        commit?: string;
      }

      export type Response =
        | {
            data: string;
            error?: never;
          }
        | {
            data?: never;
            error: string;
          };

      export type Handler = RequestHandler<Params, Response, Request>;
    }
  }
}

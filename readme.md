# Back-End of Timesheet Assistant

### Index

> `GET` _/_
>
> **Response**
>
> _Success_
> <pre>
> Hello World!
> </pre>

### Sign In

> `POST` _/scrapper/sign-in_
>
> **Request**
> <pre>
> {
>   <b>login</b>: string;
>   <b>password</b>: string;
> }
> </pre>
> **Response**
>
> _Success_
> <pre>
> {
>   <b>cookies</b>: Cookie[];
> }
> </pre>
> _Error_
> <pre>
> {
>   <b>error</b>: string;
> }
> </pre>

### Read Appointments

> `POST` _/scrapper/read-appointments_
>
> **Request**
> <pre>
> {
>   <b>cookies</b>: Cookie[];
>   <b>date?</b>: string;
> }
> </pre>
> **Response**
>
> _Success_
> <pre>
> {
>   <b>appointments</b>: {
>     <b>id</b>: string;
>     <b>cliente</b>: string;
>     <b>projeto</b>: string;
>     <b>categoria</b>: string;
>     <b>data</b>: string;
>     <b>horaInicial</b>: string;
>     <b>horaFinal</b>: string;
>     <b>descricao</b>: string;
>     <b>naoContabilizado</b>: boolean;
>     <b>avaliacao</b>: string;
>     <b>commit</b>: string;
>  }[];
> }
> </pre>
> _Error_
> <pre>
> {
>   <b>error</b>: string;
> }
> </pre>

### Read Appointment

> `POST` _/scrapper/read-appointment_
>
> **Request**
> <pre>
> {
>   <b>cookies</b>: Cookie[];
>   <b>appointmentId</b>: string;
> }
> </pre>
> **Response**
>
> _Success_
> <pre>
> {
>   <b>appointment</b>: {
>     <b>Worksheet</b>: null;
>     <b>Require</b>: null;
>     <b>Evaluate</b>: null;
>     <b>TotalRows</b>: number;
>     <b>PageSize</b>: number;
>     <b>Table</b>: null;
>     <b>Id</b>: number;
>     <b>IdRequire</b>: null;
>     <b>IdCustomer</b>: number;
>     <b>CustomerName</b>: null;
>     <b>IdProject</b>: number;
>     <b>ProjectName</b>: null;
>     <b>StartDate</b>: null;
>     <b>EndDate</b>: null;
>     <b>IdCell</b>: number;
>     <b>CellName</b>: null;
>     <b>IdCategory</b>: number;
>     <b>IdManager</b>: number;
>     <b>IdDeveloper</b>: number;
>     <b>IsMaster</b>: boolean;
>     <b>IdAncestor</b>: number;
>     <b>DeveloperName</b>: null;
>     <b>HourValue</b>: null;
>     <b>ExtraValue</b>: null;
>     <b>CategoryName</b>: null;
>     <b>InformedDate</b>: string;
>     <b>Created</b>: null;
>     <b>StartTime</b>: string;
>     <b>EndTime</b>: string;
>     <b>TotalTime</b>: null;
>     <b>NotMonetize</b>: boolean;
>     <b>Description</b>: string;
>     <b>CommitRepository</b>: string | null;
>     <b>IsDeleted</b>: boolean;
>     <b>TotalTimeInProject</b>: null;
>     <b>ConsumedTimeInProject</b>: null;
>     <b>IdEvaluate</b>: null;
>     <b>IsApprove</b>: null;
>     <b>IsReprove</b>: null;
>     <b>IsReview</b>: null;
>     <b>IsWait</b>: null;
>     <b>IsPreApproved</b>: null;
>     <b>TimePreApproved</b>: null;
>     <b>UserPreApproved</b>: null;
>     <b>IsPaid</b>: boolean;
>     <b>ConsumedTimeInProjectExceded</b>: boolean;
>     <b>TimeInWorksheetExceded</b>: number;
>     <b>IsEvaluate</b>: boolean;
>     <b>TypeReport</b>: null;
>     <b>SumTotalTime</b>: null;
>     <b>TotaltimeInMinutes</b>: number;
>     <b>IdCustomerPreSelected</b>: null;
>     <b>IdProjectPreSelected</b>: null;
>     <b>IdDeveloperPreSelected</b>: null;
>     <b>IsEvaluatePreSelected</b>: boolean;
>   };
> }
> </pre>
> _Error_
> <pre>
> {
>   <b>error</b>: string;
> }
> </pre>

### Read Clients

> `POST` _/scrapper/read-clients_
>
> **Request**
> <pre>
> {
>   <b>cookies</b>: Cookie[];
> }
> </pre>
> **Response**
>
> _Success_
> <pre>
> {
>   <b>clients</b>: {
>     <b>id</b>: string;
>     <b>title</b>: string;
>     <b>projects</b>: {
>       <b>Id</b>: number;
>       <b>Name</b>: string;
>       <b>StartDate</b>: string;
>       <b>EndDate</b>: string;
>       <b>IdCustomer</b>: number;
>       <b>categories</b>: {
>         <b>Id</b>: number;
>         <b>Name</b>: string;
>         <b>IdProject</b>: number;
>       }[];
>       <b>progress</b>: {
>         <b>Id</b>: number;
>         <b>IdCell</b>: null;
>         <b>CellName</b>: null;
>         <b>IdCustomer</b>: number;
>         <b>CustomerName</b>: string;
>         <b>IdProject</b>: number;
>         <b>ProjectName</b>: string;
>         <b>IsMaintenance</b>: boolean;
>         <b>HourLimitPerMonth</b>: null;
>         <b>Budget</b>: number;
>         <b>NotMonetize</b>: boolean;
>         <b>StartDate</b>: string;
>         <b>EndDate</b>: string;
>         <b>TotalTime</b>: string;
>         <b>TotalTimeMounth</b>: string;
>         <b>TotalTimeInProject</b>: string;
>         <b>ConsumedTimeInProject</b>: string;
>       };
>     }[];
>   }[];
> }
> </pre>
> _Error_
> <pre>
> {
>   <b>error</b>: string;
> }
> </pre>

### Create Appointment

> `POST` _/scrapper/create-appointment_
>
> **Request**
> <pre>
> {
>   <b>cookies</b>: Cookie[];
>   <b>customer</b>: string;
>   <b>project</b>: string;
>   <b>category</b>: string;
>   <b>informedDate</b>: string;
>   <b>startTime</b>: string;
>   <b>endTime</b>: string;
>   <b>notMonetize</b>: boolean;
>   <b>description</b>: string;
> }
> </pre>
> **Response**
>
> _Success_
> <pre>
> {
>   <b>data</b>: string;
> }
> </pre>
> _Error_
> <pre>
> {
>   <b>error</b>: string;
> }
> </pre>

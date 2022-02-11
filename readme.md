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
>     <b>total</b>: string;
>     <b>naoContabilizado</b>: boolean;
>     <b>avaliacao</b>: string;
>  }[];
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

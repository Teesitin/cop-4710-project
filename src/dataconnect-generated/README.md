# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListJobs*](#listjobs)
  - [*ListEmployees*](#listemployees)
- [**Mutations**](#mutations)
  - [*CreateJob*](#createjob)
  - [*UpdateJobStatus*](#updatejobstatus)
  - [*DeleteJob*](#deletejob)
  - [*UpdateJob*](#updatejob)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListJobs
You can execute the `ListJobs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listJobs(options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface ListJobsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobsData, undefined>;
}
export const listJobsRef: ListJobsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface ListJobsRef {
  ...
  (dc: DataConnect): QueryRef<ListJobsData, undefined>;
}
export const listJobsRef: ListJobsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJobsRef:
```typescript
const name = listJobsRef.operationName;
console.log(name);
```

### Variables
The `ListJobs` query has no variables.
### Return Type
Recall that executing the `ListJobs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJobsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListJobsData {
  jobs: ({
    id: UUIDString;
    title: string;
    status: string;
    salary?: string | null;
  } & Job_Key)[];
}
```
### Using `ListJobs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJobs } from '@dataconnect/generated';


// Call the `listJobs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJobs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJobs(dataConnect);

console.log(data.jobs);

// Or, you can use the `Promise` API.
listJobs().then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

### Using `ListJobs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJobsRef } from '@dataconnect/generated';


// Call the `listJobsRef()` function to get a reference to the query.
const ref = listJobsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJobsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.jobs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.jobs);
});
```

## ListEmployees
You can execute the `ListEmployees` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEmployees(options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;

interface ListEmployeesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeesData, undefined>;
}
export const listEmployeesRef: ListEmployeesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployees(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;

interface ListEmployeesRef {
  ...
  (dc: DataConnect): QueryRef<ListEmployeesData, undefined>;
}
export const listEmployeesRef: ListEmployeesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeesRef:
```typescript
const name = listEmployeesRef.operationName;
console.log(name);
```

### Variables
The `ListEmployees` query has no variables.
### Return Type
Recall that executing the `ListEmployees` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    name: string;
    email: string;
    role: string;
  } & Employee_Key)[];
}
```
### Using `ListEmployees`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployees } from '@dataconnect/generated';


// Call the `listEmployees()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployees();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployees(dataConnect);

console.log(data.employees);

// Or, you can use the `Promise` API.
listEmployees().then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

### Using `ListEmployees`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeesRef } from '@dataconnect/generated';


// Call the `listEmployeesRef()` function to get a reference to the query.
const ref = listEmployeesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employees);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateJob
You can execute the `CreateJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createJob(vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;

interface CreateJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
}
export const createJobRef: CreateJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createJob(dc: DataConnect, vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;

interface CreateJobRef {
  ...
  (dc: DataConnect, vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
}
export const createJobRef: CreateJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createJobRef:
```typescript
const name = createJobRef.operationName;
console.log(name);
```

### Variables
The `CreateJob` mutation requires an argument of type `CreateJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateJobVariables {
  title: string;
  status: string;
  salary?: string | null;
}
```
### Return Type
Recall that executing the `CreateJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateJobData {
  job_insert: Job_Key;
}
```
### Using `CreateJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createJob, CreateJobVariables } from '@dataconnect/generated';

// The `CreateJob` mutation requires an argument of type `CreateJobVariables`:
const createJobVars: CreateJobVariables = {
  title: ..., 
  status: ..., 
  salary: ..., // optional
};

// Call the `createJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createJob(createJobVars);
// Variables can be defined inline as well.
const { data } = await createJob({ title: ..., status: ..., salary: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createJob(dataConnect, createJobVars);

console.log(data.job_insert);

// Or, you can use the `Promise` API.
createJob(createJobVars).then((response) => {
  const data = response.data;
  console.log(data.job_insert);
});
```

### Using `CreateJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createJobRef, CreateJobVariables } from '@dataconnect/generated';

// The `CreateJob` mutation requires an argument of type `CreateJobVariables`:
const createJobVars: CreateJobVariables = {
  title: ..., 
  status: ..., 
  salary: ..., // optional
};

// Call the `createJobRef()` function to get a reference to the mutation.
const ref = createJobRef(createJobVars);
// Variables can be defined inline as well.
const ref = createJobRef({ title: ..., status: ..., salary: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createJobRef(dataConnect, createJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_insert);
});
```

## UpdateJobStatus
You can execute the `UpdateJobStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateJobStatus(vars: UpdateJobStatusVariables): MutationPromise<UpdateJobStatusData, UpdateJobStatusVariables>;

interface UpdateJobStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobStatusVariables): MutationRef<UpdateJobStatusData, UpdateJobStatusVariables>;
}
export const updateJobStatusRef: UpdateJobStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateJobStatus(dc: DataConnect, vars: UpdateJobStatusVariables): MutationPromise<UpdateJobStatusData, UpdateJobStatusVariables>;

interface UpdateJobStatusRef {
  ...
  (dc: DataConnect, vars: UpdateJobStatusVariables): MutationRef<UpdateJobStatusData, UpdateJobStatusVariables>;
}
export const updateJobStatusRef: UpdateJobStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateJobStatusRef:
```typescript
const name = updateJobStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateJobStatus` mutation requires an argument of type `UpdateJobStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateJobStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateJobStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateJobStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateJobStatusData {
  job_update?: Job_Key | null;
}
```
### Using `UpdateJobStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateJobStatus, UpdateJobStatusVariables } from '@dataconnect/generated';

// The `UpdateJobStatus` mutation requires an argument of type `UpdateJobStatusVariables`:
const updateJobStatusVars: UpdateJobStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateJobStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateJobStatus(updateJobStatusVars);
// Variables can be defined inline as well.
const { data } = await updateJobStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateJobStatus(dataConnect, updateJobStatusVars);

console.log(data.job_update);

// Or, you can use the `Promise` API.
updateJobStatus(updateJobStatusVars).then((response) => {
  const data = response.data;
  console.log(data.job_update);
});
```

### Using `UpdateJobStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateJobStatusRef, UpdateJobStatusVariables } from '@dataconnect/generated';

// The `UpdateJobStatus` mutation requires an argument of type `UpdateJobStatusVariables`:
const updateJobStatusVars: UpdateJobStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateJobStatusRef()` function to get a reference to the mutation.
const ref = updateJobStatusRef(updateJobStatusVars);
// Variables can be defined inline as well.
const ref = updateJobStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateJobStatusRef(dataConnect, updateJobStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_update);
});
```

## DeleteJob
You can execute the `DeleteJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteJob(vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;

interface DeleteJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
}
export const deleteJobRef: DeleteJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteJob(dc: DataConnect, vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;

interface DeleteJobRef {
  ...
  (dc: DataConnect, vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
}
export const deleteJobRef: DeleteJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteJobRef:
```typescript
const name = deleteJobRef.operationName;
console.log(name);
```

### Variables
The `DeleteJob` mutation requires an argument of type `DeleteJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteJobVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteJobData {
  job_delete?: Job_Key | null;
}
```
### Using `DeleteJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteJob, DeleteJobVariables } from '@dataconnect/generated';

// The `DeleteJob` mutation requires an argument of type `DeleteJobVariables`:
const deleteJobVars: DeleteJobVariables = {
  id: ..., 
};

// Call the `deleteJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteJob(deleteJobVars);
// Variables can be defined inline as well.
const { data } = await deleteJob({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteJob(dataConnect, deleteJobVars);

console.log(data.job_delete);

// Or, you can use the `Promise` API.
deleteJob(deleteJobVars).then((response) => {
  const data = response.data;
  console.log(data.job_delete);
});
```

### Using `DeleteJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteJobRef, DeleteJobVariables } from '@dataconnect/generated';

// The `DeleteJob` mutation requires an argument of type `DeleteJobVariables`:
const deleteJobVars: DeleteJobVariables = {
  id: ..., 
};

// Call the `deleteJobRef()` function to get a reference to the mutation.
const ref = deleteJobRef(deleteJobVars);
// Variables can be defined inline as well.
const ref = deleteJobRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteJobRef(dataConnect, deleteJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_delete);
});
```

## UpdateJob
You can execute the `UpdateJob` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateJob(vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;

interface UpdateJobRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
}
export const updateJobRef: UpdateJobRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateJob(dc: DataConnect, vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;

interface UpdateJobRef {
  ...
  (dc: DataConnect, vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
}
export const updateJobRef: UpdateJobRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateJobRef:
```typescript
const name = updateJobRef.operationName;
console.log(name);
```

### Variables
The `UpdateJob` mutation requires an argument of type `UpdateJobVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateJobVariables {
  id: UUIDString;
  title: string;
  status: string;
  salary?: string | null;
}
```
### Return Type
Recall that executing the `UpdateJob` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateJobData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateJobData {
  job_update?: Job_Key | null;
}
```
### Using `UpdateJob`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateJob, UpdateJobVariables } from '@dataconnect/generated';

// The `UpdateJob` mutation requires an argument of type `UpdateJobVariables`:
const updateJobVars: UpdateJobVariables = {
  id: ..., 
  title: ..., 
  status: ..., 
  salary: ..., // optional
};

// Call the `updateJob()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateJob(updateJobVars);
// Variables can be defined inline as well.
const { data } = await updateJob({ id: ..., title: ..., status: ..., salary: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateJob(dataConnect, updateJobVars);

console.log(data.job_update);

// Or, you can use the `Promise` API.
updateJob(updateJobVars).then((response) => {
  const data = response.data;
  console.log(data.job_update);
});
```

### Using `UpdateJob`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateJobRef, UpdateJobVariables } from '@dataconnect/generated';

// The `UpdateJob` mutation requires an argument of type `UpdateJobVariables`:
const updateJobVars: UpdateJobVariables = {
  id: ..., 
  title: ..., 
  status: ..., 
  salary: ..., // optional
};

// Call the `updateJobRef()` function to get a reference to the mutation.
const ref = updateJobRef(updateJobVars);
// Variables can be defined inline as well.
const ref = updateJobRef({ id: ..., title: ..., status: ..., salary: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateJobRef(dataConnect, updateJobVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.job_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.job_update);
});
```


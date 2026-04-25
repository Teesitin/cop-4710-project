import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Applicant_Key {
  id: UUIDString;
  __typename?: 'Applicant_Key';
}

export interface Application_Key {
  id: UUIDString;
  __typename?: 'Application_Key';
}

export interface CreateJobData {
  job_insert: Job_Key;
}

export interface CreateJobVariables {
  title: string;
  status: string;
  salary?: string | null;
}

export interface DeleteJobData {
  job_delete?: Job_Key | null;
}

export interface DeleteJobVariables {
  id: UUIDString;
}

export interface Employee_Key {
  id: UUIDString;
  __typename?: 'Employee_Key';
}

export interface Interview_Key {
  id: UUIDString;
  __typename?: 'Interview_Key';
}

export interface Job_Key {
  id: UUIDString;
  __typename?: 'Job_Key';
}

export interface ListApplicationsData {
  applications: ({
    id: UUIDString;
    applicantId: UUIDString;
    jobId: UUIDString;
    applicant: {
      id: UUIDString;
      name: string;
      email: string;
    } & Applicant_Key;
      job: {
        id: UUIDString;
        title: string;
        status: string;
        salary?: string | null;
      } & Job_Key;
        salaryProposed?: number | null;
        status: string;
        appliedDate: DateString;
  } & Application_Key)[];
}

export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    name: string;
    email: string;
    role: string;
  } & Employee_Key)[];
}

export interface ListJobsData {
  jobs: ({
    id: UUIDString;
    title: string;
    status: string;
    salary?: string | null;
  } & Job_Key)[];
}

export interface UpdateApplicationStatusData {
  application_update?: Application_Key | null;
}

export interface UpdateApplicationStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateJobData {
  job_update?: Job_Key | null;
}

export interface UpdateJobStatusData {
  job_update?: Job_Key | null;
}

export interface UpdateJobStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateJobVariables {
  id: UUIDString;
  title: string;
  status: string;
  salary?: string | null;
}

interface ListJobsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListJobsData, undefined>;
  operationName: string;
}
export const listJobsRef: ListJobsRef;

export function listJobs(options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;
export function listJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface CreateJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
  operationName: string;
}
export const createJobRef: CreateJobRef;

export function createJob(vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;
export function createJob(dc: DataConnect, vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;

interface UpdateJobStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobStatusVariables): MutationRef<UpdateJobStatusData, UpdateJobStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateJobStatusVariables): MutationRef<UpdateJobStatusData, UpdateJobStatusVariables>;
  operationName: string;
}
export const updateJobStatusRef: UpdateJobStatusRef;

export function updateJobStatus(vars: UpdateJobStatusVariables): MutationPromise<UpdateJobStatusData, UpdateJobStatusVariables>;
export function updateJobStatus(dc: DataConnect, vars: UpdateJobStatusVariables): MutationPromise<UpdateJobStatusData, UpdateJobStatusVariables>;

interface DeleteJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteJobVariables): MutationRef<DeleteJobData, DeleteJobVariables>;
  operationName: string;
}
export const deleteJobRef: DeleteJobRef;

export function deleteJob(vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;
export function deleteJob(dc: DataConnect, vars: DeleteJobVariables): MutationPromise<DeleteJobData, DeleteJobVariables>;

interface UpdateJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateJobVariables): MutationRef<UpdateJobData, UpdateJobVariables>;
  operationName: string;
}
export const updateJobRef: UpdateJobRef;

export function updateJob(vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;
export function updateJob(dc: DataConnect, vars: UpdateJobVariables): MutationPromise<UpdateJobData, UpdateJobVariables>;

interface ListEmployeesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEmployeesData, undefined>;
  operationName: string;
}
export const listEmployeesRef: ListEmployeesRef;

export function listEmployees(options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;
export function listEmployees(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;

interface ListApplicationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListApplicationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListApplicationsData, undefined>;
  operationName: string;
}
export const listApplicationsRef: ListApplicationsRef;

export function listApplications(options?: ExecuteQueryOptions): QueryPromise<ListApplicationsData, undefined>;
export function listApplications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListApplicationsData, undefined>;

interface UpdateApplicationStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateApplicationStatusVariables): MutationRef<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateApplicationStatusVariables): MutationRef<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;
  operationName: string;
}
export const updateApplicationStatusRef: UpdateApplicationStatusRef;

export function updateApplicationStatus(vars: UpdateApplicationStatusVariables): MutationPromise<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;
export function updateApplicationStatus(dc: DataConnect, vars: UpdateApplicationStatusVariables): MutationPromise<UpdateApplicationStatusData, UpdateApplicationStatusVariables>;


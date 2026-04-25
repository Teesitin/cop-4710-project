import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Application_Key {
  id: UUIDString;
  __typename?: 'Application_Key';
}

export interface CreateApplicationData {
  application_insert: Application_Key;
}

export interface CreateApplicationVariables {
  name: string;
  email: string;
  jobId: UUIDString;
  salaryProposed?: number | null;
  status: string;
  appliedDate: DateString;
}

export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}

export interface CreateEmployeeVariables {
  name: string;
  email: string;
  role: string;
  jobId: UUIDString;
  originalApplicationId: UUIDString;
}

export interface CreateInterviewData {
  interview_insert: Interview_Key;
}

export interface CreateInterviewVariables {
  applicationId: UUIDString;
  interviewerName?: string | null;
  interviewStartDate?: TimestampString | null;
  interviewEndDate?: TimestampString | null;
  interviewModality?: string | null;
}

export interface CreateJobData {
  job_insert: Job_Key;
}

export interface CreateJobVariables {
  title: string;
  status: string;
  salary?: string | null;
}

export interface DeleteApplicationData {
  application_delete?: Application_Key | null;
}

export interface DeleteApplicationVariables {
  id: UUIDString;
}

export interface DeleteEmployeeData {
  employee_delete?: Employee_Key | null;
}

export interface DeleteEmployeeVariables {
  id: UUIDString;
}

export interface DeleteInterviewData {
  interview_delete?: Interview_Key | null;
}

export interface DeleteInterviewVariables {
  id: UUIDString;
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

export interface GetApplicationData {
  application?: {
    id: UUIDString;
    name: string;
    email: string;
    jobId: UUIDString;
    job: {
      id: UUIDString;
      title: string;
      status: string;
      salary?: string | null;
    } & Job_Key;
      salaryProposed?: number | null;
      status: string;
      appliedDate: DateString;
  } & Application_Key;
}

export interface GetApplicationVariables {
  id: UUIDString;
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
    name: string;
    email: string;
    jobId: UUIDString;
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
    jobId: UUIDString;
    originalApplicationId: UUIDString;
    job: {
      id: UUIDString;
      title: string;
      status: string;
      salary?: string | null;
    } & Job_Key;
      originalApplication: {
        id: UUIDString;
        name: string;
        email: string;
        status: string;
        salaryProposed?: number | null;
        appliedDate: DateString;
        jobId: UUIDString;
      } & Application_Key;
  } & Employee_Key)[];
}

export interface ListInterviewsData {
  interviews: ({
    id: UUIDString;
    application: {
      id: UUIDString;
      name: string;
      job: {
        title: string;
      };
    } & Application_Key;
      interviewerName?: string | null;
      interviewStartDate?: TimestampString | null;
      interviewEndDate?: TimestampString | null;
      interviewModality?: string | null;
  } & Interview_Key)[];
}

export interface ListJobsData {
  jobs: ({
    id: UUIDString;
    title: string;
    status: string;
    salary?: string | null;
  } & Job_Key)[];
}

export interface UpdateApplicationData {
  application_update?: Application_Key | null;
}

export interface UpdateApplicationStatusData {
  application_update?: Application_Key | null;
}

export interface UpdateApplicationStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateApplicationVariables {
  id: UUIDString;
  name: string;
  email: string;
  jobId: UUIDString;
  salaryProposed?: number | null;
  status: string;
  appliedDate: DateString;
}

export interface UpdateEmployeeData {
  employee_update?: Employee_Key | null;
}

export interface UpdateEmployeeVariables {
  id: UUIDString;
  name: string;
  email: string;
  role: string;
}

export interface UpdateInterviewData {
  interview_update?: Interview_Key | null;
}

export interface UpdateInterviewVariables {
  id: UUIDString;
  interviewerName?: string | null;
  interviewStartDate?: TimestampString | null;
  interviewEndDate?: TimestampString | null;
  interviewModality?: string | null;
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

interface GetApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetApplicationVariables): QueryRef<GetApplicationData, GetApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetApplicationVariables): QueryRef<GetApplicationData, GetApplicationVariables>;
  operationName: string;
}
export const getApplicationRef: GetApplicationRef;

export function getApplication(vars: GetApplicationVariables, options?: ExecuteQueryOptions): QueryPromise<GetApplicationData, GetApplicationVariables>;
export function getApplication(dc: DataConnect, vars: GetApplicationVariables, options?: ExecuteQueryOptions): QueryPromise<GetApplicationData, GetApplicationVariables>;

interface CreateApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
  operationName: string;
}
export const createApplicationRef: CreateApplicationRef;

export function createApplication(vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;
export function createApplication(dc: DataConnect, vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;

interface UpdateApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateApplicationVariables): MutationRef<UpdateApplicationData, UpdateApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateApplicationVariables): MutationRef<UpdateApplicationData, UpdateApplicationVariables>;
  operationName: string;
}
export const updateApplicationRef: UpdateApplicationRef;

export function updateApplication(vars: UpdateApplicationVariables): MutationPromise<UpdateApplicationData, UpdateApplicationVariables>;
export function updateApplication(dc: DataConnect, vars: UpdateApplicationVariables): MutationPromise<UpdateApplicationData, UpdateApplicationVariables>;

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

interface DeleteApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteApplicationVariables): MutationRef<DeleteApplicationData, DeleteApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteApplicationVariables): MutationRef<DeleteApplicationData, DeleteApplicationVariables>;
  operationName: string;
}
export const deleteApplicationRef: DeleteApplicationRef;

export function deleteApplication(vars: DeleteApplicationVariables): MutationPromise<DeleteApplicationData, DeleteApplicationVariables>;
export function deleteApplication(dc: DataConnect, vars: DeleteApplicationVariables): MutationPromise<DeleteApplicationData, DeleteApplicationVariables>;

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

interface CreateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  operationName: string;
}
export const createEmployeeRef: CreateEmployeeRef;

export function createEmployee(vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;
export function createEmployee(dc: DataConnect, vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface UpdateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  operationName: string;
}
export const updateEmployeeRef: UpdateEmployeeRef;

export function updateEmployee(vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;
export function updateEmployee(dc: DataConnect, vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface DeleteEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
  operationName: string;
}
export const deleteEmployeeRef: DeleteEmployeeRef;

export function deleteEmployee(vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;
export function deleteEmployee(dc: DataConnect, vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;

interface ListInterviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInterviewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListInterviewsData, undefined>;
  operationName: string;
}
export const listInterviewsRef: ListInterviewsRef;

export function listInterviews(options?: ExecuteQueryOptions): QueryPromise<ListInterviewsData, undefined>;
export function listInterviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListInterviewsData, undefined>;

interface CreateInterviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInterviewVariables): MutationRef<CreateInterviewData, CreateInterviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInterviewVariables): MutationRef<CreateInterviewData, CreateInterviewVariables>;
  operationName: string;
}
export const createInterviewRef: CreateInterviewRef;

export function createInterview(vars: CreateInterviewVariables): MutationPromise<CreateInterviewData, CreateInterviewVariables>;
export function createInterview(dc: DataConnect, vars: CreateInterviewVariables): MutationPromise<CreateInterviewData, CreateInterviewVariables>;

interface DeleteInterviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInterviewVariables): MutationRef<DeleteInterviewData, DeleteInterviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteInterviewVariables): MutationRef<DeleteInterviewData, DeleteInterviewVariables>;
  operationName: string;
}
export const deleteInterviewRef: DeleteInterviewRef;

export function deleteInterview(vars: DeleteInterviewVariables): MutationPromise<DeleteInterviewData, DeleteInterviewVariables>;
export function deleteInterview(dc: DataConnect, vars: DeleteInterviewVariables): MutationPromise<DeleteInterviewData, DeleteInterviewVariables>;

interface UpdateInterviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInterviewVariables): MutationRef<UpdateInterviewData, UpdateInterviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateInterviewVariables): MutationRef<UpdateInterviewData, UpdateInterviewVariables>;
  operationName: string;
}
export const updateInterviewRef: UpdateInterviewRef;

export function updateInterview(vars: UpdateInterviewVariables): MutationPromise<UpdateInterviewData, UpdateInterviewVariables>;
export function updateInterview(dc: DataConnect, vars: UpdateInterviewVariables): MutationPromise<UpdateInterviewData, UpdateInterviewVariables>;


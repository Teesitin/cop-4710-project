# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listJobs, createJob, updateJob, updateJobStatus, deleteJob, listApplications, getApplication, createApplication, updateApplication, updateApplicationStatus } from '@dataconnect/generated';


// Operation ListJobs:  For variables, look at type ListJobsVars in ../index.d.ts
const { data } = await ListJobs(dataConnect, listJobsVars);

// Operation CreateJob:  For variables, look at type CreateJobVars in ../index.d.ts
const { data } = await CreateJob(dataConnect, createJobVars);

// Operation UpdateJob:  For variables, look at type UpdateJobVars in ../index.d.ts
const { data } = await UpdateJob(dataConnect, updateJobVars);

// Operation UpdateJobStatus:  For variables, look at type UpdateJobStatusVars in ../index.d.ts
const { data } = await UpdateJobStatus(dataConnect, updateJobStatusVars);

// Operation DeleteJob:  For variables, look at type DeleteJobVars in ../index.d.ts
const { data } = await DeleteJob(dataConnect, deleteJobVars);

// Operation ListApplications:  For variables, look at type ListApplicationsVars in ../index.d.ts
const { data } = await ListApplications(dataConnect, listApplicationsVars);

// Operation GetApplication:  For variables, look at type GetApplicationVars in ../index.d.ts
const { data } = await GetApplication(dataConnect, getApplicationVars);

// Operation CreateApplication:  For variables, look at type CreateApplicationVars in ../index.d.ts
const { data } = await CreateApplication(dataConnect, createApplicationVars);

// Operation UpdateApplication:  For variables, look at type UpdateApplicationVars in ../index.d.ts
const { data } = await UpdateApplication(dataConnect, updateApplicationVars);

// Operation UpdateApplicationStatus:  For variables, look at type UpdateApplicationStatusVars in ../index.d.ts
const { data } = await UpdateApplicationStatus(dataConnect, updateApplicationStatusVars);


```
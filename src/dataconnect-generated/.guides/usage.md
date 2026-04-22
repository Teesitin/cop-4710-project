# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listJobs, createJob, updateJobStatus, deleteJob, updateJob } from '@dataconnect/generated';


// Operation ListJobs: 
const { data } = await ListJobs(dataConnect);

// Operation CreateJob:  For variables, look at type CreateJobVars in ../index.d.ts
const { data } = await CreateJob(dataConnect, createJobVars);

// Operation UpdateJobStatus:  For variables, look at type UpdateJobStatusVars in ../index.d.ts
const { data } = await UpdateJobStatus(dataConnect, updateJobStatusVars);

// Operation DeleteJob:  For variables, look at type DeleteJobVars in ../index.d.ts
const { data } = await DeleteJob(dataConnect, deleteJobVars);

// Operation UpdateJob:  For variables, look at type UpdateJobVars in ../index.d.ts
const { data } = await UpdateJob(dataConnect, updateJobVars);


```
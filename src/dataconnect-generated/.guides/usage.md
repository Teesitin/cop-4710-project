# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listJobs, createCompany, createJob } from '@dataconnect/generated';


// Operation ListJobs: 
const { data } = await ListJobs(dataConnect);

// Operation CreateCompany:  For variables, look at type CreateCompanyVars in ../index.d.ts
const { data } = await CreateCompany(dataConnect, createCompanyVars);

// Operation CreateJob:  For variables, look at type CreateJobVars in ../index.d.ts
const { data } = await CreateJob(dataConnect, createJobVars);


```
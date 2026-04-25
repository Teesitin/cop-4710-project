const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'cop-4710-connect',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const listJobsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListJobs');
}
listJobsRef.operationName = 'ListJobs';
exports.listJobsRef = listJobsRef;

exports.listJobs = function listJobs(dc) {
  return executeQuery(listJobsRef(dc));
};

const createJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateJob', inputVars);
}
createJobRef.operationName = 'CreateJob';
exports.createJobRef = createJobRef;

exports.createJob = function createJob(dcOrVars, vars) {
  return executeMutation(createJobRef(dcOrVars, vars));
};

const updateJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateJob', inputVars);
}
updateJobRef.operationName = 'UpdateJob';
exports.updateJobRef = updateJobRef;

exports.updateJob = function updateJob(dcOrVars, vars) {
  return executeMutation(updateJobRef(dcOrVars, vars));
};

const updateJobStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateJobStatus', inputVars);
}
updateJobStatusRef.operationName = 'UpdateJobStatus';
exports.updateJobStatusRef = updateJobStatusRef;

exports.updateJobStatus = function updateJobStatus(dcOrVars, vars) {
  return executeMutation(updateJobStatusRef(dcOrVars, vars));
};

const deleteJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteJob', inputVars);
}
deleteJobRef.operationName = 'DeleteJob';
exports.deleteJobRef = deleteJobRef;

exports.deleteJob = function deleteJob(dcOrVars, vars) {
  return executeMutation(deleteJobRef(dcOrVars, vars));
};

const listApplicationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListApplications');
}
listApplicationsRef.operationName = 'ListApplications';
exports.listApplicationsRef = listApplicationsRef;

exports.listApplications = function listApplications(dc) {
  return executeQuery(listApplicationsRef(dc));
};

const getApplicationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetApplication', inputVars);
}
getApplicationRef.operationName = 'GetApplication';
exports.getApplicationRef = getApplicationRef;

exports.getApplication = function getApplication(dcOrVars, vars) {
  return executeQuery(getApplicationRef(dcOrVars, vars));
};

const createApplicationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateApplication', inputVars);
}
createApplicationRef.operationName = 'CreateApplication';
exports.createApplicationRef = createApplicationRef;

exports.createApplication = function createApplication(dcOrVars, vars) {
  return executeMutation(createApplicationRef(dcOrVars, vars));
};

const updateApplicationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateApplication', inputVars);
}
updateApplicationRef.operationName = 'UpdateApplication';
exports.updateApplicationRef = updateApplicationRef;

exports.updateApplication = function updateApplication(dcOrVars, vars) {
  return executeMutation(updateApplicationRef(dcOrVars, vars));
};

const updateApplicationStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateApplicationStatus', inputVars);
}
updateApplicationStatusRef.operationName = 'UpdateApplicationStatus';
exports.updateApplicationStatusRef = updateApplicationStatusRef;

exports.updateApplicationStatus = function updateApplicationStatus(dcOrVars, vars) {
  return executeMutation(updateApplicationStatusRef(dcOrVars, vars));
};

const deleteApplicationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteApplication', inputVars);
}
deleteApplicationRef.operationName = 'DeleteApplication';
exports.deleteApplicationRef = deleteApplicationRef;

exports.deleteApplication = function deleteApplication(dcOrVars, vars) {
  return executeMutation(deleteApplicationRef(dcOrVars, vars));
};

const listEmployeesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployees');
}
listEmployeesRef.operationName = 'ListEmployees';
exports.listEmployeesRef = listEmployeesRef;

exports.listEmployees = function listEmployees(dc) {
  return executeQuery(listEmployeesRef(dc));
};

const createEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEmployee', inputVars);
}
createEmployeeRef.operationName = 'CreateEmployee';
exports.createEmployeeRef = createEmployeeRef;

exports.createEmployee = function createEmployee(dcOrVars, vars) {
  return executeMutation(createEmployeeRef(dcOrVars, vars));
};

const listInterviewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInterviews');
}
listInterviewsRef.operationName = 'ListInterviews';
exports.listInterviewsRef = listInterviewsRef;

exports.listInterviews = function listInterviews(dc) {
  return executeQuery(listInterviewsRef(dc));
};

const createInterviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInterview', inputVars);
}
createInterviewRef.operationName = 'CreateInterview';
exports.createInterviewRef = createInterviewRef;

exports.createInterview = function createInterview(dcOrVars, vars) {
  return executeMutation(createInterviewRef(dcOrVars, vars));
};

const deleteInterviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteInterview', inputVars);
}
deleteInterviewRef.operationName = 'DeleteInterview';
exports.deleteInterviewRef = deleteInterviewRef;

exports.deleteInterview = function deleteInterview(dcOrVars, vars) {
  return executeMutation(deleteInterviewRef(dcOrVars, vars));
};

const updateInterviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateInterview', inputVars);
}
updateInterviewRef.operationName = 'UpdateInterview';
exports.updateInterviewRef = updateInterviewRef;

exports.updateInterview = function updateInterview(dcOrVars, vars) {
  return executeMutation(updateInterviewRef(dcOrVars, vars));
};

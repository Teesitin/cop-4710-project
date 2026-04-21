import { ConnectorConfig, DataConnectSettings } from 'firebase/data-connect';

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

export interface Job_Key {
  id: UUIDString;
  __typename?: 'Job_Key';
}


// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorModel from '../../../app/model/errorModel';

declare module 'egg' {
  interface IModel {
    ErrorModel: ReturnType<typeof ExportErrorModel>;
  }
}

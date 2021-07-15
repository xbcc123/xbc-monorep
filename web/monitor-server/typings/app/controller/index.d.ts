// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportError from '../../../app/controller/error';
import ExportHome from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    error: ExportError;
    home: ExportHome;
  }
}

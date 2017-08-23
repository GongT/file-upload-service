/// <reference path="./globals.d.ts"/>

import "@gongt/jenv-data/global";

import {initDefaultDatabaseConnection} from "@gongt/ts-stl-server/database/mongodb";
import "source-map-support/register";

export const defaultDatabaseConnectionString = JsonEnv.DataBaseUrlTemplate.replace('%DATABASE-NAME%', 'DefaultDatabase');
initDefaultDatabaseConnection(defaultDatabaseConnectionString);

const {resolve} = require('path');
export const SERVER_ROOT = resolve(process.cwd());
export const TEMP_ROOT = resolve(SERVER_ROOT, 'temp');

global['IS_CLIENT'] = false;
global['IS_DEBUG'] = true;

require('./server');

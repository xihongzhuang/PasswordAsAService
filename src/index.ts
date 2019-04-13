'use strict';

import { PasswdService } from './passwd.service';

let app = new PasswdService().getApp();

export { app };
import express from 'express';
import {
  createNodeRequestHandler,
  AngularNodeAppEngine,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

const app = express();
const engine = new AngularNodeAppEngine();

app.use((req, res, next) => {
  engine.handle(req).then((response) => {
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  }).catch(next);
});

export default createNodeRequestHandler(app);

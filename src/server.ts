import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import nextBuild from "next/dist/build"
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

//this to get types of context, very usefull whe you want to get something like token from context :)
export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & {rawBody: Buffer}

const start = async () => {

 

  //stripe webhook 
  const webHookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest,_,buffer)=>{
      req.rawBody = buffer
    }
  })
  //also for stripe
  app.post("/api/webhooks/stripe",webHookMiddleware,stripeWebhookHandler)

  //for build
  if(process.env.NEXT_BUILD){
    app.listen(PORT,async()=>{
      payload.logger.info("Nxt.js is building for production")
      //@ts-expect-error
      await nextBuild(path.join(__dirname,'../'))

      process.exit()
    })
  }


  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");
    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL : ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();

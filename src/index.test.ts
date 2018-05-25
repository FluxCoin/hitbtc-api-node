import { test } from "ava";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import "chai/register-should";
chai.use(chaiAsPromised);

import HitBTC from './index';

test("uses the demo domain when isDemo", async () => {
  const client = new HitBTC({ key: "key", secret: "secret", isDemo: true });

  client.baseUrl.should.equal("https://demo-api.hitbtc.com/api/v2");
});

test("uses the production domain when not isDemo", async () => {
  const client = new HitBTC({ key: "key", secret: "secret", isDemo: false });

  client.baseUrl.should.equal("https://api.hitbtc.com/api/v2");
});

test("uses the passed baseUrl when provided", async () => {
  const client = new HitBTC({ key: "key", secret: "secret", baseUrl: "http://localhost:4499/hitbtc/api" });

  client.baseUrl.should.equal("http://localhost:4499/hitbtc/api");
});

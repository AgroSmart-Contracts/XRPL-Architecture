import xrpl from "xrpl";

export async function getClient() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();
  return client;
}

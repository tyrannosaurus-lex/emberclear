const defaultRelays = [
  {
    socket: 'wss://mesh-relay-in-us-1.herokuapp.com/socket',
    og: 'https://mesh-relay-in-us-1.herokuapp.com/open_graph',
    host: 'mesh-relay-in-us-1.herokuapp.com',
  },
];

export async function initialize(applicationInstance: any) {
  const store = applicationInstance.lookup('service:store');
  const existing = await store.findAll('relay');
  const existingHosts = existing.map(e => e.host);

  return await Promise.all(
    defaultRelays.map(defaultRelay => {
      if (existingHosts.includes(defaultRelay.host)) {
        return;
      }

      const record = store.createRecord('relay', defaultRelay);
      return record.save();
    })
  );
}

export default { initialize };

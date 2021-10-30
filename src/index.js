import { create } from "ipfs";
import { createInstance } from "orbit-db";
import Libp2pbundle from "./libp2p";

async function main() {
    const ipfs = await create({ repo: "./ipfs1", libp2p: Libp2pbundle });
    const o1 = await createInstance(ipfs, { directory: "./orbit1" });
    window.ipfs = ipfs;
    window.orbitdb = o1;
}

window.getPublicKey = () => {
    console.log(orbitdb);
    console.log(orbitdb.id);
};

window.createDB = async (pubKey) => {
    const options = {
        accessController: {
            write: [orbitdb.identity.id, pubKey],
        },
    };
    const db = await orbitdb.log("room", options);
    await db.load();
    db.events.on("replicated", () => {
        const message = db
            .iterator()
            .collect()
            .map((e) => e.payload.value)[0];
        console.log(message);
    });
    window.createdDB = db;
};

window.openDB = async (room) => {
    const db = await orbitdb.eventlog(roomID);
    await db.load();
    db.events.on("replicated", () => {
        const message = db
            .iterator()
            .collect()
            .map((e) => e.payload.value)[0];
        console.log(message);
    });
    window.openedDB = db;
};

main();

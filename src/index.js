import { create } from "ipfs";
import { createInstance } from "orbit-db";
import Libp2pbundle from "./libp2p";

async function main() {
    const ipfs = await create({ repo: "./ipfs1", libp2p: Libp2pbundle });
    const o1 = await createInstance(ipfs, { directory: "./orbit1" });
    document
        .getElementById("get-pub-key")
        .addEventListener("click", getPublicKey);
    document.getElementById("create-db").addEventListener("click", createDB);
    document.getElementById("open-db").addEventListener("click", openDB);
    document
        .getElementById("send-message")
        .addEventListener("click", sendMessage);
    window.ipfs = ipfs;
    window.orbitdb = o1;
}

const getPublicKey = () => {
    console.log(orbitdb);
    console.log(orbitdb.id);
};

const createDB = async () => {
    const pubKey = prompt("enter public key");
    const options = {
        accessController: {
            write: [orbitdb.identity.id, pubKey],
        },
    };
    const db = await orbitdb.log("room", options);
    await db.load();
    db.events.on("replicated", () => {
        console.log("noda");
        const message = db
            .iterator()
            .collect()
            .map((e) => e.payload.value)[0];
        console.log(message);
    });
    console.log(db.address.toString());
    window.db = db;
    window.createdDB = db;
};

const openDB = async () => {
    const room = prompt("Enter orbitdb room hash");
    const db = await orbitdb.eventlog(room);
    await db.load();
    db.events.on("replicated", () => {
        console.log("here");
        const message = db
            .iterator()
            .collect()
            .map((e) => e.payload.value)[0];
        console.log(message);
    });
    console.log(db.address.toString());
    window.db = db;
    window.openedDB = db;
};

const sendMessage = () => {
    const message = prompt("Enter the message");
    window.db.add({ message: message });
};

main();

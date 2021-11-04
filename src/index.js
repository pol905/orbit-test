import { create } from "ipfs";
import { createInstance } from "orbit-db";
import Libp2pbundle from "./libp2p";

async function main() {
    const ipfs = await create({ repo: "./ipfs1", libp2p: Libp2pbundle });
    const o1 = await createInstance(ipfs, { directory: "./orbit1" });
    document
        .getElementById("get-pub-key")
        .addEventListener("click", getPublicKey);
    document
        .getElementById("create-db")
        .addEventListener("click", async () => await createDB());
    document
        .getElementById("open-db")
        .addEventListener("click", async () => await openDB());
    document
        .getElementById("send-message")
        .addEventListener("click", async () => await sendMessage());
    window.ipfs = ipfs;
    window.orbitdb = o1;
}

const getPublicKey = () => {
    console.log(orbitdb);
    document.getElementById("disp-pub").append(orbitdb.identity.id);
};

const createDB = async () => {
    const pubKey = document.getElementById("in-pub-key").value;
    console.log("node 2:", pubKey);
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
        document.getElementById("messages").append(message);
    });
    document.getElementById("create-id").append(db.address.toString());
    window.db = db;
    window.createdDB = db;
};

const openDB = async () => {
    const room = document.getElementById("db-hash").value;
    console.log(`Entering Room: ${room}`);
    const db = await orbitdb.eventlog(room);
    await db.load();
    db.events.on("replicated", () => {
        console.log("loda");
        const message = db
            .iterator()
            .collect()
            .map((e) => e.payload.value)[0];
        document.getElementById("messages").append(message);
    });
    console.log("Entered!");
    window.db = db;
    window.openedDB = db;
};

const sendMessage = async () => {
    const message = document.getElementById("msg").value;
    const hash = await window.db.add({ message: message });
    console.log(hash);
};

main();

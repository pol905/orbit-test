import Libp2p from "libp2p";
import Bootstrap, { tag } from "libp2p-bootstrap";
import Websockets from "libp2p-websockets";
import WebRTCStar, { tag as _tag } from "libp2p-webrtc-star";
import GossipSub from "libp2p-gossipsub";
import KadDHT from "libp2p-kad-dht";
import MPLEX from "libp2p-mplex";
import { NOISE } from "@chainsafe/libp2p-noise";
import PubsubPeerDiscovery, {
    tag as __tag,
} from "libp2p-pubsub-peer-discovery";

//Custom LibP2P bundle
const libp2pBundle = (opts) => {
    const peerId = opts.peerId;
    const bootstrapList = opts.config.Bootstrap;
    return new Libp2p({
        peerId,
        addresses: {
            listen: [
                "/dns4/shrouded-shelf-54137.herokuapp.com/tcp/443/wss/p2p-webrtc-star/",
            ],
        },
        modules: {
            transport: [Websockets, WebRTCStar],
            streamMuxer: [MPLEX],
            connEncryption: [NOISE],
            peerDiscovery: [Bootstrap, PubsubPeerDiscovery],
            dht: KadDHT,
            pubsub: GossipSub,
        },
        config: {
            peerDiscovery: {
                [tag]: {
                    enabled: true,
                    list: bootstrapList,
                    interval: 3000,
                },
                [_tag]: {
                    enabled: true,
                },
                [__tag]: {
                    interval: 1000,
                    enabled: true,
                },
            },
            pubsub: {
                emitSelf: false,
                enabled: true,
            },
        },
    });
};

export default libp2pBundle;

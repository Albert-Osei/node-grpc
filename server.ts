import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoloader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/random';
import { RandomHandlers } from './proto/randomPackage/Random';

const Port = 8082;
const PROTO_FILE = './proto/random.proto';

const packageDef = protoloader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const randomPackage = grpcObj.randomPackage

function main() {
    const server = getServer();

    server.bindAsync(`0.0.0.0:${Port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if(err) {
            console.error(err);
            return
        }
        console.log(`Server has started on port ${port}`);
        server.start()
    })
}

function getServer() {
    const server = new grpc.Server();
    server.addService(randomPackage.Random.service, {
        pingPong: (req, res) => {
            console.log(req, res)
        }
    } as RandomHandlers)
    return server;
}

main()





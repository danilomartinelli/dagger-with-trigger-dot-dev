import { connect, Client } from "@dagger.io/dagger";

export async function runPipeline(payload: { image: { version: string } }) {
    return new Promise((resolve, reject) => {
        connect(
            async (client: Client) => {
                try {
                    const node = client.container()
                        .withEnvVariable("DO_NOT_TRACK", process.env.DO_NOT_TRACK ?? "1")
                        .withEnvVariable("CI", "true")
                        .from(`node:${payload.image.version}`)
                        .withExec(["node", "-v"]);

                    const version = (await node.stdout()).trim();

                    console.log(`Pipeline executed with Node.js version ${version}`);

                    resolve({
                        message: `Pipeline completed successfully`,
                        nodeVersion: version,
                    });
                } catch (error) {
                    reject(error);
                }
            },
            { LogOutput: process.stderr }
        );
    });
}

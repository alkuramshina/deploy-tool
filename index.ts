import { Clerc, helpPlugin, versionPlugin } from "clerc";
import { deploy } from "./commands/deploy";
import { setup } from "./commands/setup";
import { setSshPass, ssh } from "./utils/ssh";

Clerc.create()
  .scriptName("deploytool")
  .description("Deploy tool")
  .version("0.1.0")
  .use(helpPlugin())
  .use(versionPlugin())
  .command("setup", "Set up a server for future deployment", {
    parameters: ["<ip>"],
    flags: {
      sshUser: {
        alias: "u",
        type: String,
        default: "root",
        description: "SSH user",
      },
      sshPassword: {
        type: String,
        description: "SSH pass",
      },
      interactive: {
        alias: "i",
        type: Boolean,
        default: false,
        description: "Interactive mode",
      },
      verbose: {
        alias: "v",
        type: Boolean,
        default: false,
        description: "Verbose mode",
      }
    },
  })
  .command("deploy", "Deploy a new version of a service", {
    parameters: ["<ip>", "<domain>", "<image>", "<name>"],
    flags: {
      port: {
        alias: "p",
        type: String,
        default: "80",
        description: "Port the container listens to",
      },
      path: {
        alias: "P",
        type: String,
        description: "Path prefix the service should handle",
      },
      sshUser: {
        alias: "u",
        type: String,
        default: "root",
        description: "SSH user",
      },
      sshPassword: {
        type: String,
        description: "SSH pass",
      },
      interactive: {
        alias: "i",
        type: Boolean,
        default: false,
        description: "Interactive mode",
      },
      verbose: {
        type: Boolean,
        default: false,
        description: "Verbose mode",
      },
      environment: {
        alias: "e",
        type: [String],
        description: "Environment variables",
      },
      registry: {
        type: String,
        description: "Docker registry server",
      },
      "registry-username": {
        type: String,
        description: "Docker registry username",
      },
      "registry-password": {
        type: String,
        description: "Docker registry password",
      },
    },
  })
  .on("setup", async (context) => {
    const { ip } = context.parameters;
    const { sshUser, interactive, sshPassword, verbose } = context.flags;

    setSshPass(sshPassword);

    await setup(ssh(ip, sshUser, interactive, verbose), { ip });
  })
  .on("deploy", async (context) => {
    const { ip, domain, image, name } = context.parameters;
    const { port, path, sshUser, interactive, verbose, sshPassword, environment } = context.flags;

    setSshPass(sshPassword);

    await deploy(ssh(ip, sshUser, interactive, verbose), {
      domain,
      image,
      name,
      port,
      path,
      environment,
      registry: {
        server: context.flags.registry,
        username: context.flags["registry-username"],
        password: context.flags["registry-password"],
      },
    });
  })
  .parse();
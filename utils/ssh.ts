import { $, type ShellPromise } from "bun";

export type SSHRunner = (command: string) => ShellPromise;

export const ssh =
  (ip: string, sshUser: string, interactive: boolean, verbose: boolean): SSHRunner =>
    (command: string) =>
      interactive
        ? $`ssh ${verbose ? '-v' : ''} ${sshUser}@${ip} ${command}`.throws(true)
        : $`sshpass -e ssh ${verbose ? '-v' : ''} -o StrictHostKeyChecking=no ${sshUser}@${ip} ${command}`.throws(true);

export function setSshPass(sshPassword?: string) {
  $.env({ SSHPASS: sshPassword });
}
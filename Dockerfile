FROM oven/bun:1.1.16

WORKDIR /

COPY . .

RUN apt-get clean && apt-get update
RUN apt-get install openssh-server sshpass -y
RUN bun install

ENTRYPOINT ["bun", "run", "deploy"]
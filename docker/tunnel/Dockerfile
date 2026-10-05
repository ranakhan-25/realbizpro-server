FROM alpine:3.20

RUN apk add --no-cache openssh-client sshpass autossh

CMD ["sh", "-c", "echo \"Starting SSH tunnel to $SSH_USER@$SSH_HOST:$SSH_PORT...\" && sshpass -p \"$SSH_PASSWORD\" autossh -M 0 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -N -L 0.0.0.0:5432:127.0.0.1:5432 $SSH_USER@$SSH_HOST -p ${SSH_PORT:-22}"]

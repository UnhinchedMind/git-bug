FROM node:14-alpine AS webui-dependencies

WORKDIR /src/webui
COPY webui/package*.json ./
RUN npm ci

WORKDIR /src/api/graphql/schema
COPY api/graphql/schema .

WORKDIR /src/webui
COPY webui .

#############################################
# By making 'npm run build' as a separate build step, the startup time of the
# dev-webui service (in docker-compose) can be reduced. As the dev-webui
# doesn't require a build of the webui - only the dependencies.
FROM webui-dependencies AS build-webui
RUN npm run build

#############################################
FROM golang:1.15.6 AS build-binary

WORKDIR /app/src
COPY . .
# Pack recent changes of the webui
COPY --from=build-webui /src/webui/build /app/src/webui/build
RUN go run webui/pack_webui.go
# Build git-bug binary
# CGO_ENABLED is disabled, to produce a static binary for the scratch image
RUN CGO_ENABLED=0 make build

#############################################
FROM build-binary AS setup-playground-issue-repository

ARG ISSUE_REPO_USER_NAME=TestUser
ARG ISSUE_REPO_USER_EMAIL=TestUser@fake.email

WORKDIR /repository
RUN git init
RUN git config --local user.name $ISSUE_REPO_USER_NAME
RUN git config --local user.email $ISSUE_REPO_USER_EMAIL

# Create the required user identity for git-bug
RUN /app/src/git-bug user create \
    --non-interactive \
    --name  $ISSUE_REPO_USER_NAME \
    --email $ISSUE_REPO_USER_EMAIL

# Add an issue to the repository.
RUN /app/src/git-bug add \
    -t "Hello Friend, this is an Issue. Click me to learn more." \
    -m "This is an Issue automatically created for your convenience. \
        Actually this whole issue-repository was created and initialized \
        with a test user so you don't have to. If you want to use your \
        own issue-repository instead of this \"playground\", hop over to the \
        git-bug ReadMe at \
        https://github.com/GlancingMind/git-bug/tree/docker-automated-build-latest#small-exceptions or if you \
        used docker-compose take a look at the webui-ReadMe right over \
        here: https://github.com/GlancingMind/git-bug/tree/docker-automated-build-latest/webui#readme"

#############################################
FROM busybox AS release

WORKDIR /etc/ssl/certs
COPY --from=build-binary /etc/ssl/certs .

WORKDIR /bin
COPY --from=build-binary /app/src/git-bug .

WORKDIR /repository
COPY --from=setup-playground-issue-repository /repository .

STOPSIGNAL SIGINT
EXPOSE 3000
ENTRYPOINT ["/bin/git-bug"]
CMD ["webui", "--host", "0.0.0.0", "--port", "3000", "--no-open"]

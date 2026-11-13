# How to Contribute

If you want to add a new feature please [open an issue](https://github.com/pyrra-dev/pyrra/issues/new) first.

## Git Workflow

A good example on how to setup your repository for development can be found on the
[Kubernetes Github Workflow](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md) page.

## Dependencies

Make sure you have a recent version of:

- [Go](https://go.dev/doc/install) (1.17+)
- [npm](https://docs.npmjs.com/cli/v8/configuring-npm/install)

In order to build the UI you'll also need

```
npm install react-scripts
```

Then install all dependencies

```bash
make install
```

## Building

Please check out the [Makefile](Makefile) on which targets are available to test
and build the project.

## Running locally

`.agents/run <mode>` starts Pyrra for development, for people and coding agents alike.
Every mode serves the UI from the Vite dev server on [localhost:3000](http://localhost:3000), so UI changes reload without a rebuild.

| Mode    | Runs                                                 | Queries                                                                                         |
|---------|------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `ui`    | UI                                                   | demo.pyrra.dev's API                                                                            |
| `api`   | UI, API                                              | a backend at `PYRRA_BACKEND_URL` and a Prometheus at `PROMETHEUS_URL`, e.g. port-forwarded ones |
| `demo`  | UI, API, filesystem backend with `examples/*.yaml`   | demo.pyrra.dev's Prometheus                                                                     |
| `local` | UI, API, filesystem backend, Prometheus              | only the processes it starts                                                                    |

`.agents/run --help` has the details.
To run the components by hand instead, build with `make all` and see `./pyrra api --help`, `./pyrra filesystem --help` and `./pyrra kubernetes --help`.

# wk.1 build

This is an overview of some of the technical details of what was built during Week 1.

## Technical Details

I built a small webserver to accomplish the goal. I wrote the server using the [bun.sh](https://bun.sh) framework and here is an overview of the endpoints

```
POST  /store     - store file into burrito
GET   /          - feed of burrito content
GET   /<hash>    - page for specific hash
GET   /f/<hash>  - file stored at hash
GET   /m/<hash>  - metadata.json for hash
```

### `/store`

This is where the meat of the application is. It is effectively the entrypoint.

The high level overview of `/store` is to

1. Store the file on the filesystem
2. Process that file according to it's type

The `/store` endpoint is a `POST` for `multipart/form-data` with two params

```
type StoreRequest {
    // file to store
	data: File;

    // optional metadata
	metadata?: {
        // type of file. indicates what processing to do
		type: string
        // unix timestamp sec
		created: number
	}
}
```

#### File Storage

When we receive a valid `/store` request we first do a few things before running any processing.

1. Compute `sha256` `hash` of the file
2. Get `mime`, file extension `ext`, and other handy metadata.
3. Store the file at `BRAIN_STORAGE_ROOT/data/<hash>/data.<ext>`

For reference the overall file hierarchy looks like:

```
BRAIN_STORAGE_ROOT/          // env var set for the root of the brain
└── data/
    └── <hash>               // the sha256 hash of data.ext
        ├── data.ext         // the raw data in it's native extension
        └── metadata.json    // metadata JSON containing processing output
```

#### Processing Pipeline

After the file has been stored, we run a processing pipeline. The idea of this pipeline is to iteratively build a javascript object through a series of steps. This object will eventually be written to `BRAIN_STORAGE_ROOT/data/<hash>/metadata.json`.

The input to the pipeline is the metadata we got from the `File Storage` step.

```typescript
type FileMetadata = {
  hash: string;
  type: string;
  ext: string;
  created: number;
  added: number;
  originalName: string;
};
```

The output is a JSON object. The object's type is determined by what steps are run in the pipeline.

At a very high level the pipeline execution looks like this:

```python
def runPipeline(input, steps):
	metadata = input
	for step in steps:
		metadata = step.run()
	return metadata
```

That is, it first takes an input and a list of steps. It forms the output by running each step and adding the result of the step to the output. After all the steps are run the output is formed and the metadata file will be written.

##### Deeper Dive

Let's dive into some of the core components in the pipeline and how it works in more specifics.

The pipeline is built from a series of `Steps` and will execute them in the sequence provided.

###### Step

The basic definition of a step is as follows. The idea behind a step is that it has a defined Input and Output type. We will validate at runtime that we get a valid input to the step as well as a valid output after `run` has been called. `run` is the function that processes the input into the output. The optional `validate` function is there to provide some additional validation that the step has run correctly. More detail will be provided in the Pipeline Execution section below.

```typescript
export interface Step<Input, Output> {
  name: string;
  inputType: z.ZodType<Input>;
  outputType: z.ZodType<Output>;
  validate?: (input: Output) => Promise<boolean>;
  run: (input: Input) => Promise<Output>;
}
```

###### Pipeline Execution

The pipeline execution is quite simple. It has a few optimizations that reduce cost. The function definition is as follows.

```typescript
export const processPipeline = async <Input>(
  input: Input,
  steps: Step<any, any>[],
  tag?: string
): Promise<any>
```

The idea of this function is to take some `input` and a series of `steps`, run the series of steps sequentially and output a javascript object to be written to the `metadata.json` file.

This execution function however does have some optimizations up it's sleeve as a result of the `Step` interface. Since often times we are calling LLM's or other compute intensive functions, we only want to run steps when absolutely necessary.

First thing to do is make sure the input is valid to our step. We use `zod` schemas to validate this. If it is not valid, we throw an error. However if the input is valid, next we want to check if the step has already been run. The first part of this process is checking if the `outputType` of the step already exists in the `input` to the step. Then if there is a `validate` function, we run it to make sure that the data in the output matches our expectation of what it should be. If the step does not need to be run, we skip it, otherwise we run it.

That's about it.

###### `validate`

One thing worth covering in more detail is the `validate` function. There are some use cases where it seems helpful to me. One is doing data integrity checks. Say we have split a file into parts and wrote each part to the filesystem. Maybe we want to `validate` that those files actually exist on the filesystem. Perhaps this doesn't matter, but it leaves a door open for something like self testing code.

# wk.1 unwrapped

## Motivation

The motivation for building initially came through working on [Tanaki](https://lingonberry.ai/tanaki), and a “brain” we were building for Dr. Tanaki Lingonberry. The interface into the brain was dead simple, send audio note to a server. The server processes the audio and we could ask questions to the brain using basic RAG. In building this it became clear that there were always more modules to add or processing to be done. Some of the requests

- summarize in 1 sentence
- summarize in 2 sentences
- send a notification after summary generated
- answer questions involving time
- who has been mentioned

All of this was doable, but it was clear doing each of these was often just adding another step or column to a database effectively. This was becoming very tedious. Not to mention I'd built many RAG applications already, and I wanted a more unified way of building them.

Plus I wanted a brain for myself and my personal data. I wanted to start asking questions and introspecting into myself, as well as being able to build a website from my raw unstructured data. The motivation being better able to express myself more fully to more people without spamming them with nonsense and things they don't care about. Eventually I would like to put all of my data into this.

For now I am calling this project `burrito`. (or keep it brain)

## Goal

So looking at all of this the overall goal was to build a flexible data ingestion system. One key premise for building this system was that I don’t know how the data should be retrieved in advance (upon a question being asked, or literally just querying the data). So we want to build a system that let’s us play with the processing of the data so it can be used in a wide variety of ways. To do this we will build a pipeline which takes in data of a `type` and processes it in whatever steps you want.

**Requirements?**

A concrete example is:

- input a audio file
- transcribe it
- summarize the transcription
- get embeddings of the summary
- add this data to a database.
- add embeddings to a vector database

This is pretty simple, but maybe I realize I want to add some additional processing steps. I want to generate knowledge graph triples, and add those triples to a knowledge graph. This is the idea that maybe knowledge graph retrieval will aid in getting data out of the system.

So we now want to add those steps to the pipeline and make it easy to do so.

## What was built

### Overview

More or less the website [brain.burrito.place](https://brain.burrito.place) was built and deployed on my Mac Mini. I send it voice notes from my iPhone and they show up on the website. A bunch of fancy stuff as described in the goal happens behind the scenes to make it work.

[small demo video]()

Some notes on the site:

- homepage content is AI generated
  - title, summary text
- each note has it's own page
  - has the summary, raw transcript, and raw audio file for listening
  - has similar entries listed on the side of the page

### Pipeline Framework

The pipeline was built to make it very easy to process data in all kinds of different ways. Leaving flexibility for using databases, knowledge graphs, custom data retrievers and indexers at any point in the future.

### Audio Pipeline

In addition to the raw specification and implementation of the store and pipeline, I also implemented the beginnings of an audio processing pipeline. The steps are as follows:

1. Split the audio file into 5 minute chunks w/ffmpeg
2. Transcribe the chunks with OpenAI Whisper
3. Get the full transcript (concat the chunk transcripts)
4. Get embeddings for each of the chunks
5. Generate a 2 sentence summary for each of the chunks
6. Put the embeddings into a vector database (chromadb)
7. Get an overall summary for the audio (concat the chunk summaries)
8. Add a title based on the summary

Being able to separate these into independent steps and verify them one at a time was massively helpful.

[Here](https://brain.burrito.place/m/50a4826c30e9c6915317f385b540d71cd41a20d39ecc88247be0a25fa258d961) is a sample metadata file as a result of the audio pipeline.

### Are you a nerd? Wanna nerd out

[Read this](/nerdin-wk1). The technical details of what I did this week. Mostly regarding the pipeline and framework for the `burrito`

## Reflections

It was interesting implementing a pipeline and also trying to have it be typed. It became almost annoying to make sure types were effectively passed through the system. However once it works, it is pretty remarkable. I really like breaking down tasks in a pipeline. I also feel like this mode of execution may be helpful for LLM's to insert into. That is they can build steps of the pipeline as they think step by step. Determining input and output of each step and then writing the appropriate code. Often times the surface area of code is quite small so an LLM should be suited to do this.

LLM's continue to impress me, especially when given a constrained task. Adding new processing steps like "what (people/places/questions) were mentioned" work remarkably well. Finding great questions is almost the harder thing. Curiosity about the possibilities is the most important. Being able to experiment and see those results quickly matters. I think the pipeline enables this nicely. How that data is to be used next is uncertain, but generating massive amounts of intelligible and categorized data from unstructured text seems almost trivial.

Embeddings also impress me, I keep wondering new ways to work with them. To me RAG seems like the most boring way to use them in some way. I have some ideas about how I want to use them in a social context after having used them to find similar documents to an existing doc.

Throughout the week I kept thinking about retrieval. How is this going to be done? I know I want to get to the point where I can ask the question _"when did i go surfing this week? tell me the date, location, and surf conditions"_ and get a very good answer. But getting there is still a little unknown. Do I process the data upfront? Or RAG? Or DB+RAG? Or...??

Beyond just plain retrieval I am wanting to know how the heck I can fit my Messages into this same data store. I want to get answers to very complex questions like _"who is Chandler?"_. Files for it may not be the right way. Maybe a DB is the base data type for this one, but that's okay. Maybe `.sqlite` to keep it as a file? This is future question, but actively thinking about.

## Next steps

The overall next experiment is more social. Seeing if we can utilize the vector embeddings to find similar documents across a network of people. I really want to be in a network and know who is nearby. Being able to find those clusters more easily would be really really great. This would be working towards having more conversations with more people. With this I am concerned about living in a bubble of my own creation. Though I suppose I would rather it be my own creation than someone putting me in a bubble. Ideally I would like to enable popping of the bubble too. Intentionally having opposing or differing views. Mostly to improve my own thinking and getting in touch with reality.

Being able to support more than just files seems very important. It started as files mostly because I was building a tiny feed on https://test.cjpais.com and this code was bootstrapped from that. Messages and Calendar are up on the list 😈

It annoys me that I am building the `burrito` site directly from the data management software. Those two should not be bundled together. Many frontends should be served from the same data source.

Adding a function for simple LLM questions, or structured LLM output seems particularly important. Especially when adding all kinds of new metadata in the pipeline. Want to get it out in a certain format. Say I want to know if this entry is about surfing, and I want the surf data in a particular format. Maybe build a specific activity log via this pipeline.

### Pipeline

The pipeline definitely needs improvement. There are a few areas of concern

#### Execution

Execution can be improved in a few ways. The biggest improvement is turning the sequential execution into a parallel execution. To do this we will need to compute a dependency graph and form a DAG. This should allow us to build some kind of execution stack, and then be able to execute through that stack and parallelizing where possible.

Parallel execution is particularly important if we are making a lot of LLM calls.

Beyond just pure execution optimization, it will be important in the future to be able to insert a `Step` into the execution. Compute where this `Step` falls into the graph and compute it too. Exact use case for this is still unknown, but I suspect it may be helpful. It's also possible there is some other methodology that works entirely better.

#### Usability

The main issue working with the pipeline at the moment is being too strictly typed. It's _annoying_ to work with as a developer. Getting it perfectly right with `zod` is not always the easiest given the idea to build a giant javascript object. _Annoying_ is unacceptable. It needs to be trivial to use as a developer or a regular person.

The solution to this I am a bit unsure right now. It's structure will need to serve two purposes

1.  help efficiently compute the dependency graph
2.  be very easy to work with as a dev
3.  ideally be extensible for the future webui as well

I think one thing would be to simplify down to concatenated key names and types, but I don't think this will work very well for arrays. Further thinking on this topic needs to be done. Perhaps the pipeline as it works now is not suitable for ease of development. Worth considering alternatives.

It would also be VERY cool to be able to add steps and manage the pipeline for a particular process via a webui.

### Curious?

If you're curious about any of this, drop me a line: [cj@cjpais.com](mailto:cj@cjpais.com)

I'd love to chat with you!

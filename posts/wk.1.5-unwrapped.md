# wk.1.5 - unwrapped

## Motivation

After week 1, one thing stood out to me in particular. I really wanted to find people who are writing/saying/thinking similar things to me. Heck I might even want to query "climbing" across these people and see who's been climbing. Maybe find some tech + climbers I didn't know about.

So the overall question would be how can `burrito` help with this?

## Goal

My answer to the question was to make a tiny protocol, if you can even call it that. The protocol's first purpose is to allow another person to query your embeddings.

## What was built

### "Peers Similar Entries"

I added a little feature to the [hash](https://brain.burrito.place/2dd11f100505cf910ae0dbaaf7b1c800f5b3e36fb8db19aedbdfd9afc271b990) page which shows similar entries from peers.

![similar entries from Jon!](https://test.burrito.place/f/bf7d84bed893648d714c33769f21edf37369d510a995f79f0db9ddd46882d93a)

### Jon's Brain

I cooked up a [burrito](https://jon.burrito.place) for [Jon](https://jon.bo/) on my mac mini.

### Technical Details

#### `/query/embeddings`

I enabled the "Peers Similar Entries" by adding a `POST /query/embeddings` endpoint to the server. This allows you to query any person's embeddings assuming they support this structure.

#### Request

The request to `/query/embeddings` is:

```json
{
	"vectors": [[]],  // an array of arrays of size 1536. vectors to query
	"num": number     // optional: number of results to return
}
```

#### Response

The expected response from `/query/embeddings` is:

```json
[
	{
		"hash": string,
		"distance": number,
		"title": string,
		"summary": string,
		"text": string,
	}
]
```

## What was learned

Turns out it works! A interesting little demo. Though the thing I learned most, is it really requires a large degree of active participation, a larger corpus of data, and more people to make it interesting. Even then it is unknown since we haven't gotten there yet.

Input methods are starting to become more and more important. Really starting to feel the pain of only audio, and Jon mentioning wanting some new input methods.

Feeling similar with social loops. I am happy to put into the system, but I built it. Even I can fall off of using it on days I'm less excited. Very curious to play with some things that prove immediate utility. Or give me good reflections, or make me stoked, or whatever. Lots of playing to do here. So many options.

Or maybe it all needs more inherent value, the value I believe is there but still digging and experimenting. Maybe shining a turd, but I certainly don't know yet.

## Next steps

Having voice notes only is a bit obtuse, and same for just files. Will want to handle more arbitrary data types very soon.

I really want to try to build a tiny social network with 25 or so people. Figuring out some details of what that might look like and how to get the `burrito` to a place where other people can easily use it and participate. How to build this in a decentralized way I am also curious about. Maybe there is a registry contract on Base or Ethereum that has the URL's for participants.

Want to add more kinds of querying beyond just embeddings. Can I ask a specific question to someone else's data and get an answer?

Permissions are becoming more and more relevant by the second. I stumble into moments where I want to add to the `burrito`, but I don't want what I am saying to be public. I probably am fine having it go to close friends, but often not public. There are a few things I want to be entirely private as well. I am curious if it's possible to have an LLM handle some of the filtering, but ultimately I imagine public key cryptography to be very important. And I guess overall I do want FHE LLM. But that's a story for another day.

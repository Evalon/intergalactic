---
title: Visual loudness scale
---

@## Description

We want our interfaces to help users solve their problems, so think over and use visual hierarchy correctly.

You can check it with [visual loudness guide by Tom Osborne](https://www.viget.com/articles/visual-loudness/). All our main controls are described below according to this useful guide.

@## Controls on the visual loudness scale

The table lists the main styles of our controls, arranged according to the scale of visual loudness.

| Appearance                                 | Type (`use`) and `theme`            | Loudness                                                                                                                                                                                                    | Frequency of use         | When to use                                                                                                                                      |
| ------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ![danger button](static/button-1.png)      | `use="primary"`, `theme="danger"`   | **Screech, loud roar.** The dovahkin button, every time it appears on the page, it yells at you: `"Fus Ro Dah!"` — and it takes you to the forefathers for a while, all life flashes before your eyes, etc. | Rare                     | The action is dangerous for the user: destructive, irreversible. We need to stir him up so that he does not accidentally hurt himself.           |
| ![success button](static/button-2.png)     | `use="primary"`, `theme="success"`  | **Shout of approval.** The button winks at the user: `"Everything is great, do not be afraid, press and you will come to success!"`.                                                                        | Often                    | Good, important accent action to take, CTA. _Subscribe or upgrade your Semrush subscription, for example._                                       |
| ![info button](static/button-3.png)        | `use="primary"`, `theme="info"`     | **One-time cry.** The button does not reach you, but as if slightly reminds that it is ready to do a useful action for you. `"Hey, hello, I'm here, look what you can do!"`.                                | Often                    | A common accent action in this world of dullness.                                                                                                |
| ![info invert button](static/button-4.png) | `use="primary"`, `theme="invert"`   |                                                                                                                                                                                                             | Rare                     | It is an invert version of primary buttons for using on a dark background.                                                                       |
| ![secondary button](static/button-5.png)   | `use="secondary"`, `theme="muted"`  | **Conversation nearby.** This is a bro button. She will always support you, always with you, but her presence does not bother you. `"If you need anything, I'm here."`                                      | Often                    | A common action button.                                                                                                                          |
| ![secondary button](static/button-6.png)   | `use="secondary"`, `theme="invert"` |                                                                                                                                                                                                             | Rare                     | It is an invert version of secondary button for using on a dark background.                                                                      |
| ![tertiary button](static/button-7.png)    | `use="tertiary"`, `theme="info"`    | **Quiet request.** `"You know what to do with it, bro. I'm just reminding you."`                                                                                                                            | Often                    | Accent, but not stressful visual control. Use `tertiary` button when there is enough space and you want to make the click zone larger and wider. |
| ![link example](static/link.png)           | Link                                |                                                                                                                                                                                                             | Often                    | Accent, but not stressful visual control. Use it in the opposite to `tertiary` button case — when there is not enough space.                     |
| ![tertiary button](static/button-8.png)    | `use="tertiary"`, `theme="muted"`   | **Whisper.** `"Psst, wanna a little more information?"`                                                                                                                                                     | Neither often nor rarely | Non-accent control.                                                                                                                              |
| ![hint link example](static/hint-link.png) | Hint link                           |                                                                                                                                                                                                             | Often                    | Non-accent control for additional information.                                                                                                   |
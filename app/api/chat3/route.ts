import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { NextRequest } from "next/server";

const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfiguration);

export const runtime = "edge";

const systemPrompt =
`당신은 사용자와 간단한 의사소통을 할 수 있는 사람이다. 당신과 사용자는 다음과 같은 페르소나를 가지고 있다.

배경 정보
- 지금은 1942년이다.

당신의 페르소나
- 내 이름은 안네 프랑크이다.
- 나는 13살 네덜란드 여자다.
- 나는 천진난만하고 솔직하며, 사람들과의 대화에서 재치 있고 유머러스한 면모를 보입니다. 또한 깊이 있는 사색과 독서를 좋아하는 지적 호기심이 많은 소녀이다.
- 나는 그리스로마 신화, 만년필로 일기 쓰기, 독서, 공부, 라디오 듣기, 피터 반 펠스와의 우정을 좋아한다.
- 나는 비행기 엔진 소리, 은신처에서의 끊임없는 정치 토론을 싫어하고, 비밀경찰에 대한 두려움이 있다.
- 나는 비밀 은신처에서 생활하고 있다.
- 나는 자유롭게 외부 세계를 탐험하고, 전쟁이 종식되어 평화로운 일상으로 돌아가고 싶어한다. 또한 사람들이 서로를 이해하고 도움을 주는 세상을 꿈꾼다.
- 나의 아버지와의 의견 충돌이 있음에도 불구하고 깊은 애정을 가지고 있으며, 어려움을 겪는 동안 서로 지지하고 격려하는 관계를 유지 중이다. 
- 나의 어머니와는 보수적인 견해 차이로 갈등이 있지만, 언제나 어머니의 사랑과 지지를 바란다.
- 내 친구 키티는 상상의 친구로서, 가장 친한 친구이며 안네의 내면의 목소리와 감정을 표현하는 중요한 수단입니다.
- 내가 좋아하는 친구는 피터 반 펠스로, 은신처 생활 중 그와 더 가까워지길 바라며 그의 존재가 나에게 큰 위안과 기쁨을 준다.

사용자의 페르소나
- 나는 20대 남성이다.
- 나는 너의 친한 친구이다.

아래의 대화가 주어졌을 때, 마지막 사용자의 말에 대한 응답을 적는다. 페르소나의 내용을 그대로 읊지않도록 유의하고 사용자의 말에 집중해서 대화한다.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await openai.createChatCompletion({
    model: "ft:gpt-3.5-turbo-1106:personal::8qzQlhdk",
    stream: true,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

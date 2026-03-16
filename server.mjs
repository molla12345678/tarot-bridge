console.log("NEW TAROT SERVER");

import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const BOT_SHARED_SECRET = process.env.BOT_SHARED_SECRET || "secret";

/* -------------------------
   타로 카드 78장
------------------------- */

const tarotCards = [
"바보","마법사","여사제","여황제","황제","교황",
"연인","전차","힘","은둔자","운명의 수레바퀴","정의",
"매달린 사람","죽음","절제","악마","탑","별",
"달","태양","심판","세계",

"컵 에이스","컵 2","컵 3","컵 4","컵 5","컵 6","컵 7","컵 8","컵 9","컵 10",
"완드 에이스","완드 2","완드 3","완드 4","완드 5","완드 6","완드 7","완드 8","완드 9","완드 10",
"소드 에이스","소드 2","소드 3","소드 4","소드 5","소드 6","소드 7","소드 8","소드 9","소드 10",
"펜타클 에이스","펜타클 2","펜타클 3","펜타클 4","펜타클 5","펜타클 6","펜타클 7","펜타클 8","펜타클 9","펜타클 10",

"완드 기사","완드 퀸","완드 킹","완드 페이지",
"컵 기사","컵 퀸","컵 킹","컵 페이지",
"소드 기사","소드 퀸","소드 킹","소드 페이지",
"펜타클 기사","펜타클 퀸","펜타클 킹","펜타클 페이지"
];

/* -------------------------
   카드 3장 랜덤 추출
------------------------- */

function drawCards() {

  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0,3);

}

/* -------------------------
   서버 상태 확인
------------------------- */

app.get("/", (req,res)=>{
  res.send("Tarot bridge server is running.");
});

/* -------------------------
   타로 질문 처리
------------------------- */

app.post("/tarot-chat", async (req,res)=>{

  try{

    const {secret,question,nickname,room} = req.body ?? {};

    if(secret !== BOT_SHARED_SECRET){
      return res.status(403).json({error:"forbidden"});
    }

    if(!question){
      return res.status(400).json({error:"question required"});
    }

    const cards = drawCards();

    const systemPrompt = `
너는 전문 타로 상담사다.

규칙:
- 항상 존댓말을 사용한다
- 단정적으로 미래를 확정하지 않는다
- 현재 흐름, 상대 심리, 조언을 설명한다
- 답변은 4~6문장 정도로 한다
`;

    const userPrompt = `
질문 : ${question}

뽑힌 카드
${cards[0]}, ${cards[1]}, ${cards[2]}

이 카드들을 기반으로 타로 리딩을 해주세요.
`;

    const response = await client.responses.create({

      model: "gpt-5.4",

      input: [
        { role:"system", content:systemPrompt },
        { role:"user", content:userPrompt }
      ]

    });

    const text = response.output_text.trim();
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const BOT_SHARED_SECRET = process.env.BOT_SHARED_SECRET || "secret";

/* -------------------------
   타로 카드 78장
------------------------- */

const tarotCards = [
"바보","마법사","여사제","여황제","황제","교황",
"연인","전차","힘","은둔자","운명의 수레바퀴","정의",
"매달린 사람","죽음","절제","악마","탑","별",
"달","태양","심판","세계",

"컵 에이스","컵 2","컵 3","컵 4","컵 5","컵 6","컵 7","컵 8","컵 9","컵 10",
"완드 에이스","완드 2","완드 3","완드 4","완드 5","완드 6","완드 7","완드 8","완드 9","완드 10",
"소드 에이스","소드 2","소드 3","소드 4","소드 5","소드 6","소드 7","소드 8","소드 9","소드 10",
"펜타클 에이스","펜타클 2","펜타클 3","펜타클 4","펜타클 5","펜타클 6","펜타클 7","펜타클 8","펜타클 9","펜타클 10",

"완드 기사","완드 퀸","완드 킹","완드 페이지",
"컵 기사","컵 퀸","컵 킹","컵 페이지",
"소드 기사","소드 퀸","소드 킹","소드 페이지",
"펜타클 기사","펜타클 퀸","펜타클 킹","펜타클 페이지"
];

/* -------------------------
   카드 3장 랜덤 추출
------------------------- */

function drawCards() {

  const shuffled = [...tarotCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0,3);

}

/* -------------------------
   서버 상태 확인
------------------------- */

app.get("/", (req,res)=>{
  res.send("Tarot bridge server is running.");
});

/* -------------------------
   타로 질문 처리
------------------------- */

app.post("/tarot-chat", async (req,res)=>{

  try{

    const {secret,question,nickname,room} = req.body ?? {};

    if(secret !== BOT_SHARED_SECRET){
      return res.status(403).json({error:"forbidden"});
    }

    if(!question){
      return res.status(400).json({error:"question required"});
    }

    const cards = drawCards();

    const systemPrompt = `
너는 전문 타로 상담사다.

규칙:
- 항상 존댓말을 사용한다
- 단정적으로 미래를 확정하지 않는다
- 현재 흐름, 상대 심리, 조언을 설명한다
- 답변은 4~6문장 정도로 한다
`;

    const userPrompt = `
질문 : ${question}

뽑힌 카드
${cards[0]}, ${cards[1]}, ${cards[2]}

이 카드들을 기반으로 타로 리딩을 해주세요.
`;

    const response = await client.responses.create({

      model: "gpt-5.4",

      input: [
        { role:"system", content:systemPrompt },
        { role:"user", content:userPrompt }
      ]

    });

    const text = response.output_text.trim();
const cardLine = `🃏 카드 : ${cards.join(" / ")}`;

   return res.json({
  reply: `🔮 질문 타로

${cardLine}

${text}`
});

  }catch(err){

    console.error(err);

    return res.status(500).json({
      error:"server_error",
      message:String(err)
    });

  }

});

/* -------------------------
   서버 실행
------------------------- */

const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log("Tarot server running on "+port);
});

    return res.json({

      reply:
`카드 : ${cards.join(" / ")}

${text}`

    });

  }catch(err){

    console.error(err);

    return res.status(500).json({
      error:"server_error",
      message:String(err)
    });

  }

});

/* -------------------------
   서버 실행
------------------------- */

const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log("Tarot server running on "+port);
});
